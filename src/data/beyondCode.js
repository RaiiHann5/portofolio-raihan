import { bi } from "../i18n/localize";
//shelf
import GhostofTsushima from "../assets/ghostoftsushima.jpg";
import Batman from "../assets/batman.jpg";
import Sherlock from "../assets/astudyinscarlet.jpg";
import AgathaChristie from "../assets/listerdalemystery.jpg";
import MobileLegend from "../assets/sora.jpg";
import Letterboxd from "../assets/letterboxd.jpg";
import EAFC from "../assets/eafc.jpg";

//movie
import Obsession from "../assets/obsession.webp";
import Odyssey from "../assets/odyssey.jpg";
import Se7en from "../assets/se7en.jpg";
import TheBatman from "../assets/thebatman.jpg";
import SpiderMan from "../assets/spiderman.jpeg";
import ProjectHailMary from "../assets/projecthailmary.jpg";
import Heat from "../assets/heat.jpg";
import InglouriousBasterds from "../assets/inglouriousbasterds.jpg";

//hobbies
import Design from "../assets/designweb.jpeg";
import WatchMovies from "../assets/movie.jpg";
import Reading from "../assets/book.jpg";
import Soundscapes from "../assets/music.jpg";

//musicArt

import realityClub1 from "../assets/reality-club.jpg";
import realityClub2 from "../assets/reality-club2.jpg";
import realityClub3 from "../assets/reality-club3.jpg";
import magnoliaCelebration from "../assets/magnolia-celebration.jpg";
import louisArmstrong from "../assets/louis-armstrong.jpg";
import theBeatles from "../assets/the-beatles.jpg";
import marvinGaye from "../assets/marvin-gaye.jpg";
import johnLennon from "../assets/john-lennon.jpg";
import TearForFears from "../assets/tears-for-fears.jpg";
import justinHurwitz from "../assets/justin-hurwitz.jpg";

export const topMusic = [
  {
    id: 1,
    track: "You'll Find Lovers Like You and Me",
    artist: "Reality Club",
    duration: "3:24",
    art: realityClub1,
    spotifyId: "6BQiGGlPp294KMLYQMmS0C", // isi track ID dari link Spotify lagu ini
  },
  {
    id: 2,
    track: "Magnolia",
    artist: "Magnolia Celebration",
    duration: "3:41",
    art: magnoliaCelebration,
    spotifyId: "3JkDuxcnIzBUngCk6peKZi",
  },
  {
    id: 3,
    track: "Telenovia",
    artist: "Reality Club",
    duration: "3:12",
    art: realityClub2,
    spotifyId: "67YVZ8XKist6XE3Usm0cZt",
  },
  {
    id: 4,
    track: "Close To You",
    artist: "Reality Club",
    duration: "3:58",
    art: realityClub3,
    spotifyId: "2G5ItTp6kepUVeJrsmFSbQ",
  },
  {
    id: 5,
    track: "La vie en rose",
    artist: "Louis Armstrong",
    duration: "3:23",
    art: louisArmstrong,
    spotifyId: "0Yj7WP1MbAqQVQA5Na4I7E",
  },
  {
    id: 6,
    track: "Here, There, and Everywhere",
    artist: "The Beatles",
    duration: "2:25",
    art: theBeatles,
    spotifyId: "2B4Y9u4ERAFiMo13XPJyGP",
  },
  {
    id: 7,
    track: "Distant Lover",
    artist: "Marvin Gaye",
    duration: "4:15",
    art: marvinGaye,
    spotifyId: "7vpkmzisaB8R47XlxyTcfs",
  },
  {
    id: 8,
    track: "Beautiful Boy",
    artist: "John Lennon",
    duration: "4:02",
    art: johnLennon,
    spotifyId: "5URfZHMlUWTWxPvvSBWcPk",
  },
  {
    id: 9,
    track: "Head Over Heels",
    artist: "Tear For Fears",
    duration: "3:32",
    art: TearForFears,
    spotifyId: "0aF9m87P8Tja3NUMv4DfHt",
  },
  {
    id: 10,
    track: "Epilogue (La La Land Soundtrack)",
    artist: "Justin Hurwitz",
    duration: "7:39",
    art: justinHurwitz,
    spotifyId: "762K1h8yVV5IgAVuEMpqfZ",
  },
];

export const games = [
  {
    id: 1,
    title: "Ghost of Tsushima",
    status: "Playing",
    hours: 86,
    cover: "linear-gradient(135deg, #3c3480 0%, #26215c 100%)",
    image: GhostofTsushima, // isi path/URL cover art, kosongin buat pakai gradient di atas
    genre: "RPG",
    note: "",
    lastPlayed: "",
  },
  {
    id: 2,
    title: "Batman Arkham Knight",
    status: "Gamelist",
    hours: 0,
    cover: "linear-gradient(135deg, #993c1d 0%, #4a1b0c 100%)",
    image: Batman,
    genre: "Roguelike",
    note: "",
    lastPlayed: "",
  },
  {
    id: 3,
    title: "Sherlock Holmes: A Study In Scarlet",
    status: "Reading",
    hours: 0,
    cover: "linear-gradient(135deg, #993c1d 0%, #4a1b0c 100%)",
    image: Sherlock,
    genre: "Roguelike",
    note: "",
    lastPlayed: "",
  },
  {
    id: 5,
    title: "Agatha Christie: Listerdale Mystery",
    status: "Readlist",
    hours: 0,
    cover: "linear-gradient(135deg, #993c1d 0%, #4a1b0c 100%)",
    image: AgathaChristie,
    genre: "Roguelike",
    note: "",
    lastPlayed: "",
  },
  {
    id: 6,
    title: "EAFC",
    status: "Gamelist",
    hours: 0,
    cover: "linear-gradient(135deg, #993c1d 0%, #4a1b0c 100%)",
    image: EAFC,
    genre: "Roguelike",
    note: "",
    lastPlayed: "",
  },
  {
    id: 7,
    title: "Mobile Legends: Bang Bang",
    status: "Gamelist",
    hours: 0,
    cover: "linear-gradient(135deg, #993c1d 0%, #4a1b0c 100%)",
    image: MobileLegend,
    genre: "Roguelike",
    note: "",
    lastPlayed: "",
  },
  {
    id: 8,
    title: "Letterboxd",
    status: "Write movie reviews",
    hours: 0,
    cover: "linear-gradient(135deg, #993c1d 0%, #4a1b0c 100%)",
    image: Letterboxd,
    genre: "Roguelike",
    note: "",
    lastPlayed: "",
  },
  
 
];

export const movies = [
  {
    id: 1,
    title: "Obsession",
    year: 2026,
    status: "Watched",
    poster: "#a8482e",
    image: Obsession,
    rating: 10,
    note: bi("A story that completely pulled me in. The tension, emotions, and characters made it unforgettable.", "Cerita yang benar-benar menarik saya masuk. Ketegangan, emosi, dan karakternya bikin film ini sulit dilupakan."),
  },
  {
    id: 2,
    title: "Odyssey",
    year: 2024,
    status: "Soon",
    poster: "#8a6a3f",
    image: Odyssey,
    rating: 0,
    note: bi("One of the most anticipated space adventures. Can't wait to experience the journey and mystery behind it.", "Salah satu petualangan luar angkasa yang paling ditunggu. Nggak sabar merasakan perjalanan dan misteri di baliknya."),
  },
  {
    id: 3,
    title: "Se7en",
    year: 1995,
    status: "Watched",
    poster: "#7a2f3f",
    image: Se7en,
    rating: 9,
    note: bi("A dark psychological thriller with an unforgettable atmosphere and one of the strongest endings in cinema.", "Thriller psikologis yang gelap dengan atmosfer tak terlupakan dan salah satu ending terkuat di dunia perfilman."),
  },
  {
    id: 4,
    title: "The Batman",
    year: 2025,
    status: "Rewatch",
    poster: "#3a4a7a",
    image: TheBatman,
    rating: 10,
    note: bi("A beautifully dark take on Batman with incredible cinematography, mood, and detective vibes.", "Interpretasi Batman yang gelap dan indah, dengan sinematografi, mood, dan nuansa detektif yang luar biasa."),
  },
  {
    id: 5,
    title: "Spider-Man: Brand New Day",
    year: 2026,
    status: "Watchlist",
    poster: "#3a4a7a",
    image: SpiderMan,
    rating: 0,
    note: bi("Looking forward to seeing a new chapter of Spider-Man and where the story goes next.", "Menantikan babak baru Spider-Man dan ke mana ceritanya melangkah selanjutnya."),
  },
  {
    id: 6,
    title: "Project Hail Mary",
    year: 2026,
    status: "Watched",
    poster: "#3a4a7a",
    image: ProjectHailMary,
    rating: 0,
    note: bi("A sci-fi adventure filled with space exploration, survival, and an exciting mystery to uncover.", "Petualangan sci-fi penuh eksplorasi luar angkasa, bertahan hidup, dan misteri seru untuk diungkap."),
  },
  {
    id: 7,
    title: "Heat",
    year: 1995,
    status: "Watched",
    poster: "#3a4a7a",
    image: Heat,
    rating: 9,
    note: bi("A legendary crime thriller with intense performances, smart writing, and one of the best rivalries in film.", "Thriller kriminal legendaris dengan akting yang intens, penulisan yang cerdas, dan salah satu rivalitas terbaik di dunia film."),
  },
  {
    id: 8,
    title: "Inglourious Basterds",
    year: 2009,
    status: "Watched",
    poster: "#3a4a7a",
    image: InglouriousBasterds,
    rating: 10,
    note: bi("Tarantino's unique storytelling at its best. Sharp dialogue, memorable characters, and unforgettable scenes.", "Gaya bercerita khas Tarantino di titik terbaiknya. Dialog tajam, karakter memorable, dan adegan yang tak terlupakan."),
  },
];

export const hobbies = [
  {
    id: 1,
    icon: "🎨",
    label: bi("Visual Craft", "Karya Visual"),
    blurb: bi("Where imagination meets structure — turning simple ideas into meaningful visuals.", "Tempat imajinasi bertemu struktur — mengubah ide sederhana jadi visual yang bermakna."),
    image: Design,
  },
  {
    id: 2,
    icon: "🎥",
    label: bi("Cinematic Worlds", "Dunia Sinematik"),
    blurb: bi("Exploring stories, emotions, and creative perspectives through films.", "Menjelajahi cerita, emosi, dan sudut pandang kreatif lewat film."),
    image: WatchMovies,
  },
  {
    id: 3,
    icon: "📖",
    label: bi("Quiet Pages", "Halaman Sunyi"),
    blurb: bi("A quiet space for learning, curiosity, and discovering new perspectives.", "Ruang tenang untuk belajar, penasaran, dan menemukan sudut pandang baru."),
    image: Reading,
  },
  {
    id: 4,
    icon: "🎵",
    label: bi("Soundscapes", "Lanskap Suara"),
    blurb: bi("A soundtrack for every moment, from deep focus to late-night creativity.", "Soundtrack untuk setiap momen, dari fokus mendalam sampai kreativitas larut malam."),
    image: Soundscapes,
  },
];

export const beyondCode = {
  topMusic,
  games,
  movies,
  hobbies,
};