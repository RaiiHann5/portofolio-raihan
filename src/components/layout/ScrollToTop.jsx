import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Multi-page nav means every route mounts fresh — without this, navigating
// from the bottom of one page lands you mid-scroll on the next.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
