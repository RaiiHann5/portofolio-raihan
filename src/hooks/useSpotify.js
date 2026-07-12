import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useSpotify — a real, working Spotify integration for the "Now Playing" widget.
 *
 * Uses the Authorization Code + PKCE flow, which is the one OAuth flow Spotify
 * supports entirely client-side (no server, no client secret). You still need
 * a free Spotify Developer app:
 *
 *   1. Go to https://developer.spotify.com/dashboard -> Create app.
 *   2. Add a Redirect URI that matches SPOTIFY_REDIRECT_URI below exactly
 *      (e.g. http://localhost:5173/spotify-callback in dev, and your real
 *      domain + /spotify-callback in prod). Spotify requires an exact match.
 *   3. Copy the Client ID into your env as VITE_SPOTIFY_CLIENT_ID.
 *   4. Make sure your app calls `handleSpotifyRedirect()` (see below) on the
 *      /spotify-callback route, or just call `useSpotify()` anywhere mounted
 *      at that path — it detects the ?code= param automatically.
 *
 * Scopes requested: reading what's currently playing / recently played,
 * saving tracks to the user's library, and (best-effort) play/pause/skip.
 * Playback control needs Spotify Premium + an active device — if that fails
 * we surface a friendly `controlError` instead of throwing.
 */

const CLIENT_ID = import.meta?.env?.VITE_SPOTIFY_CLIENT_ID ?? "";
const REDIRECT_URI =
  import.meta?.env?.VITE_SPOTIFY_REDIRECT_URI ??
  (typeof window !== "undefined" ? `${window.location.origin}/spotify-callback` : "");
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-recently-played",
  "user-library-read",
  "user-library-modify",
].join(" ");

const STORAGE_KEY = "spotify_pkce_tokens";
const VERIFIER_KEY = "spotify_pkce_verifier";

/* ------------------------------ PKCE helpers ------------------------------ */

function randomString(length = 64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function codeChallengeFromVerifier(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

function loadTokens() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function saveTokens(tokens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

function clearTokens() {
  localStorage.removeItem(STORAGE_KEY);
}

/* --------------------------------- API core -------------------------------- */

async function exchangeCodeForToken(code, verifier) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Spotify token exchange failed");
  const json = await res.json();
  return { ...json, obtained_at: Date.now() };
}

async function refreshAccessToken(refreshToken) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Spotify token refresh failed");
  const json = await res.json();
  return { ...json, refresh_token: json.refresh_token ?? refreshToken, obtained_at: Date.now() };
}

function isExpired(tokens) {
  if (!tokens) return true;
  return Date.now() > tokens.obtained_at + (tokens.expires_in - 60) * 1000;
}

/* ---------------------------- shape normalization --------------------------- */

function normalizeNowPlaying(json) {
  if (!json || !json.item) return null;
  const item = json.item;
  const ms = item.duration_ms || 1;
  const durationSec = Math.round(ms / 1000);
  return {
    id: item.id,
    track: item.name,
    artist: (item.artists || []).map((a) => a.name).join(", "),
    album: item.album?.name,
    art: item.album?.images?.[0]?.url,
    progress: (json.progress_ms || 0) / ms,
    progressMs: json.progress_ms || 0,
    durationMs: ms,
    duration: `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`,
    isPlaying: !!json.is_playing,
    device: json.device?.name || null,
  };
}

/* ----------------------------------- hook ----------------------------------- */

export function useSpotify({ pollMs = 5000 } = {}) {
  const [tokens, setTokens] = useState(loadTokens);
  const [connecting, setConnecting] = useState(false);
  const [track, setTrack] = useState(null);
  const [queueNext, setQueueNext] = useState([]);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);
  const [controlError, setControlError] = useState(null);
  const pollRef = useRef(null);

  const connected = !!tokens?.access_token;

  // Kick off login: redirect the browser to Spotify's consent screen.
  const connect = useCallback(async () => {
    if (!CLIENT_ID) {
      setError("Missing VITE_SPOTIFY_CLIENT_ID — add your app's Client ID to .env to enable this.");
      return;
    }
    const verifier = randomString(64);
    sessionStorage.setItem(VERIFIER_KEY, verifier);
    const challenge = await codeChallengeFromVerifier(verifier);
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      code_challenge_method: "S256",
      code_challenge: challenge,
      scope: SCOPES,
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  }, []);

  const disconnect = useCallback(() => {
    clearTokens();
    setTokens(null);
    setTrack(null);
  }, []);

  // On mount: if we just got redirected back with ?code=..., exchange it.
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;
    const verifier = sessionStorage.getItem(VERIFIER_KEY);
    if (!verifier) return;
    setConnecting(true);
    exchangeCodeForToken(code, verifier)
      .then((t) => {
        saveTokens(t);
        setTokens(t);
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());
      })
      .catch((e) => setError(e.message))
      .finally(() => setConnecting(false));
  }, []);

  // Authenticated fetch wrapper that refreshes the token when needed.
  const apiFetch = useCallback(
    async (path, options = {}) => {
      let current = tokens;
      if (isExpired(current)) {
        if (!current?.refresh_token) throw new Error("Session expired — reconnect Spotify.");
        current = await refreshAccessToken(current.refresh_token);
        saveTokens(current);
        setTokens(current);
      }
      const res = await fetch(`https://api.spotify.com/v1${path}`, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${current.access_token}` },
      });
      return res;
    },
    [tokens]
  );

  const fetchNowPlaying = useCallback(async () => {
    if (!connected) return;
    try {
      const res = await apiFetch("/me/player/currently-playing?additional_types=track");
      if (res.status === 204) {
        setTrack(null);
        return;
      }
      if (!res.ok) throw new Error("Couldn't reach Spotify");
      const json = await res.json();
      setTrack(normalizeNowPlaying(json));
      setError(null);

      if (json?.item?.id) {
        const savedRes = await apiFetch(`/me/tracks/contains?ids=${json.item.id}`);
        if (savedRes.ok) {
          const [isSaved] = await savedRes.json();
          setLiked(!!isSaved);
        }
      }
    } catch (e) {
      setError(e.message);
    }
  }, [connected, apiFetch]);

  const fetchQueue = useCallback(async () => {
    if (!connected) return;
    try {
      const res = await apiFetch("/me/player/queue");
      if (!res.ok) return;
      const json = await res.json();
      setQueueNext((json.queue || []).slice(0, 3).map((t) => ({ track: t.name, artist: (t.artists || []).map((a) => a.name).join(", ") })));
    } catch {
      /* queue endpoint is best-effort; ignore failures */
    }
  }, [connected, apiFetch]);

  useEffect(() => {
    if (!connected) return;
    fetchNowPlaying();
    fetchQueue();
    pollRef.current = window.setInterval(fetchNowPlaying, pollMs);
    return () => window.clearInterval(pollRef.current);
  }, [connected, fetchNowPlaying, fetchQueue, pollMs]);

  const withControlErrorHandling = (fn) => async (...args) => {
    try {
      setControlError(null);
      const res = await fn(...args);
      if (res && !res.ok && res.status !== 204) {
        if (res.status === 403 || res.status === 404) {
          setControlError("Needs Spotify Premium and an active device to control playback.");
        } else {
          setControlError("Spotify couldn't complete that action.");
        }
        return;
      }
      window.setTimeout(fetchNowPlaying, 300);
    } catch {
      setControlError("Spotify couldn't complete that action.");
    }
  };

  const togglePlay = withControlErrorHandling(async () => {
    const path = track?.isPlaying ? "/me/player/pause" : "/me/player/play";
    return apiFetch(path, { method: "PUT" });
  });

  const skip = withControlErrorHandling(async (direction = 1) => {
    const path = direction > 0 ? "/me/player/next" : "/me/player/previous";
    return apiFetch(path, { method: "POST" });
  });

  const seek = withControlErrorHandling(async (progress) => {
    if (!track?.durationMs) return;
    const positionMs = Math.round(progress * track.durationMs);
    return apiFetch(`/me/player/seek?position_ms=${positionMs}`, { method: "PUT" });
  });

  const toggleLike = withControlErrorHandling(async () => {
    if (!track?.id) return;
    const method = liked ? "DELETE" : "PUT";
    const res = await apiFetch(`/me/tracks?ids=${track.id}`, { method });
    if (res.ok) setLiked((l) => !l);
    return res;
  });

  return {
    connected,
    connecting,
    connect,
    disconnect,
    track,
    queueNext,
    liked,
    error,
    controlError,
    togglePlay,
    skip,
    seek,
    toggleLike,
    refresh: fetchNowPlaying,
  };
}