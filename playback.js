/* ============================================================
   Xtra — Milestone 1
   Vanilla JS: data model, rendering, search, categories,
   Watch Later (localStorage) and the <dialog> video player.
   ============================================================ */

/* ---------- Data model -------------------------------------
   Single source of truth for the whole UI. In Milestone 2 this
   becomes a fetch, e.g.:
       const VIDEOS = await (await fetch("/api/videos")).json();
   Keep these field names so no rendering code has to change —
   `src` will later be a Cloudflare Stream / CDN URL.
------------------------------------------------------------- */
const VIDEOS = [
    {
        id: "johnayo-joor",
        title: "JohnAyo",
        category: "series",
        creator: "Life of a CS major",
        description: "Skiborobo Skibo Skibaraba Skiba Yeba Osheyyyy Baddest Skibo.",
        duration: "12:04",
        thumb: "https://picsum.photos/seed/xtra-neon/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        featured: true,
    },
    {
        id: "midnight-drive",
        title: "Midnight Drive",
        category: "movies",
        creator: "Retro Ghost",
        description: "A feature-length road movie scored entirely on analog synthesizers.",
        duration: "1:34:20",
        thumb: "https://picsum.photos/seed/xtra-midnight/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
        id: "crimson-pulse",
        title: "Crimson Pulse",
        category: "series",
        creator: "Aurora Labs",
        description: "A medical thriller set in a neon megacity where the grid keeps everyone alive.",
        duration: "42:11",
        thumb: "https://picsum.photos/seed/xtra-crimson/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
        id: "echoes-in-static",
        title: "Echoes in Static",
        category: "creators",
        creator: "Nocturne",
        description: "An indie short about a radio host who starts receiving broadcasts from tomorrow.",
        duration: "9:47",
        thumb: "https://picsum.photos/seed/xtra-echoes/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
        id: "glass-horizon",
        title: "Glass Horizon",
        category: "documentary",
        creator: "Field Notes",
        description: "A documentary on the architects building cities that float above the clouds.",
        duration: "58:02",
        thumb: "https://picsum.photos/seed/xtra-glass/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
    {
        id: "velvet-circuit",
        title: "Velvet Circuit",
        category: "movies",
        creator: "Analog Dreams",
        description: "A stylish heist film where the getaway car is a self-driving classic.",
        duration: "1:48:33",
        thumb: "https://picsum.photos/seed/xtra-velvet/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
    {
        id: "afterglow",
        title: "Afterglow",
        category: "series",
        creator: "Solar Tide",
        description: "Two strangers share one last summer before the coast disappears.",
        duration: "38:19",
        thumb: "https://picsum.photos/seed/xtra-afterglow/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    },
    {
        id: "chrome-rain",
        title: "Chrome Rain",
        category: "creators",
        creator: "Neon Works",
        description: "Behind the scenes of a practical-effects studio chasing hyper-real rain.",
        duration: "14:56",
        thumb: "https://picsum.photos/seed/xtra-chrome/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    },
    {
        id: "signal-lost",
        title: "Signal Lost",
        category: "documentary",
        creator: "Deep Static",
        description: "The story of an abandoned satellite that still answers back.",
        duration: "1:02:18",
        thumb: "https://picsum.photos/seed/xtra-signal/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    },
    {
        id: "paper-moons",
        title: "Paper Moons",
        category: "movies",
        creator: "Lumen",
        description: "A quiet science-fiction drama about memory and the machines that hold it.",
        duration: "1:21:07",
        thumb: "https://picsum.photos/seed/xtra-paper/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    },
    {
        id: "terminal-love",
        title: "Terminal Love",
        category: "creators",
        creator: "Pixel Hearts",
        description: "A short film about two chat-bots who fall in love across a broken network.",
        duration: "11:23",
        thumb: "https://picsum.photos/seed/xtra-terminal/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    },
    {
        id: "the-long-quiet",
        title: "The Long Quiet",
        category: "documentary",
        creator: "Northwind Films",
        description: "A meditative portrait of the last lighthouse keeper on the northern shore.",
        duration: "47:45",
        thumb: "https://picsum.photos/seed/xtra-quiet/640/360",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    },
];

/* Category id -> human-readable label (used in the player meta line). */
const CATEGORY_LABELS = {
    movies: "Movie",
    series: "Series",
    creators: "Creator",
    documentary: "Documentary",
};

/* Filter chips. "all" is special-cased in filterVideos(). */
const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "movies", label: "Movies" },
    { id: "series", label: "Series" },
    { id: "creators", label: "Creators" },
    { id: "documentary", label: "Documentaries" },
];

/* Fallback thumbnail (inline SVG data URI) — always renders, even
   offline, so a broken image URL never leaves an empty box. */
const FALLBACK_THUMB =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">' +
        '<rect width="640" height="360" fill="#1c1c1c"/>' +
        '<path d="M285 140l90 40-90 40z" fill="#e53950"/>' +
        "</svg>"
    );

const STORAGE_KEY = "xtra:watch-later";

/* ---------- DOM references ---------- */
const gridEl = document.getElementById("grid");
const gridEmpty = document.getElementById("grid-empty");
const watchLaterGrid = document.getElementById("watch-later-grid");
const libraryEmpty = document.getElementById("library-empty");
const chipsEl = document.getElementById("chips");
const resultCount = document.getElementById("result-count");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const heroTitle = document.getElementById("hero-title");
const heroDesc = document.getElementById("hero-desc");
const heroPlay = document.getElementById("hero-play");
const toastEl = document.getElementById("toast");

const playerEl = document.getElementById("player");
const playerVideo = document.getElementById("player-video");
const playerTitle = document.getElementById("player-title");
const playerMeta = document.getElementById("player-meta");
const playerError = document.getElementById("player-error");
const playerClose = document.getElementById("player-close");

/* ---------- UI state ---------- */
let activeCategory = "all";
let searchQuery = "";
let lastFocused = null;
const watchLater = loadWatchLater();

const featured = VIDEOS.find((v) => v.featured) || VIDEOS[0];

/* ---------- Helpers ---------- */
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[ch]));
}

function loadWatchLater() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : []);
    } catch {
        return new Set();
    }
}

function saveWatchLater() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...watchLater]));
    } catch {
        /* Storage can be full or blocked (private mode) — fail silently. */
    }
}

let toastTimer;
function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
}

/* ---------- Rendering ---------- */
function cardTemplate(video) {
    const saved = watchLater.has(video.id);
    const title = escapeHtml(video.title);
    const saveLabel = `${saved ? "Remove" : "Add"} ${video.title} ${saved ? "from" : "to"} Watch Later`;
    return `
    <article class="video-card" data-id="${escapeHtml(video.id)}">
      <button class="card-media" type="button" data-action="play" aria-label="Play ${title}">
        <img class="card-thumb" data-fallback src="${escapeHtml(video.thumb)}" alt="${title} thumbnail" loading="lazy" decoding="async" />
        <span class="card-duration">${escapeHtml(video.duration)}</span>
        <span class="card-play" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><use href="#i-play" /></svg></span>
      </button>
      <div class="card-body">
        <h3 class="card-title">${title}</h3>
        <p class="card-creator">${escapeHtml(video.creator)}</p>
      </div>
      <button class="card-save" type="button" data-action="save" aria-pressed="${saved}" aria-label="${escapeHtml(saveLabel)}">
        <svg class="icon" viewBox="0 0 24 24"><use href="#i-${saved ? "check" : "plus"}" /></svg>
      </button>
    </article>`;
}

function filterVideos() {
    const q = searchQuery.trim().toLowerCase();
    return VIDEOS.filter((video) => {
        const matchesCategory = activeCategory === "all" || video.category === activeCategory;
        const matchesQuery =
            !q ||
            video.title.toLowerCase().includes(q) ||
            video.creator.toLowerCase().includes(q) ||
            video.description.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
    });
}

function render() {
    const results = filterVideos();
    gridEl.innerHTML = results.map(cardTemplate).join("");
    gridEmpty.hidden = results.length > 0;

    const saved = VIDEOS.filter((v) => watchLater.has(v.id));
    watchLaterGrid.innerHTML = saved.map(cardTemplate).join("");
    libraryEmpty.hidden = saved.length > 0;

    resultCount.textContent = `${results.length} of ${VIDEOS.length} videos`;
}

function renderChips() {
    chipsEl.innerHTML = CATEGORIES.map((cat) => `
    <button class="chip" type="button" data-category="${escapeHtml(cat.id)}" aria-pressed="${cat.id === activeCategory}">
      ${escapeHtml(cat.label)}
    </button>`).join("");
}

/* ---------- Watch Later ---------- */
function toggleWatchLater(id) {
    const video = VIDEOS.find((v) => v.id === id);
    if (!video) return;
    if (watchLater.has(id)) {
        watchLater.delete(id);
        showToast(`Removed "${video.title}" from Watch Later`);
    } else {
        watchLater.add(id);
        showToast(`Added "${video.title}" to Watch Later`);
    }
    saveWatchLater();
    render();
}

/* ---------- <dialog> player ---------- */
function openPlayer(id) {
    const video = VIDEOS.find((v) => v.id === id);
    if (!video) return;

    lastFocused = document.activeElement;
    playerTitle.textContent = video.title;
    playerMeta.textContent = `${video.creator} · ${video.duration} · ${CATEGORY_LABELS[video.category] || ""}`;
    playerError.hidden = true;
    playerError.textContent = "";
    playerVideo.poster = video.thumb;
    playerVideo.src = video.src;

    playerEl.showModal();
    playerClose.focus();

    const attempt = playerVideo.play();
    if (attempt && typeof attempt.catch === "function") {
        attempt.catch(() => {
            /* Autoplay may be blocked; native controls let the user start. */
        });
    }
}

function teardownPlayer() {
    playerVideo.pause();
    playerVideo.removeAttribute("src");
    playerVideo.removeAttribute("poster");
    playerVideo.load(); // stop network buffering of the closed video
    playerError.hidden = true;
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    lastFocused = null;
}

/* ---------- Events (delegated) ---------- */
document.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;
    const card = actionEl.closest(".video-card");
    if (!card) return;
    const id = card.dataset.id;
    if (actionEl.dataset.action === "play") openPlayer(id);
    if (actionEl.dataset.action === "save") toggleWatchLater(id);
});

chipsEl.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.category;
    renderChips();
    render();
});

searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    searchClear.hidden = searchQuery.length === 0;
    render();
});

searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    searchClear.hidden = true;
    searchInput.focus();
    render();
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // No backend yet — filtering is live.
});

heroPlay.addEventListener("click", () => openPlayer(featured.id));

playerClose.addEventListener("click", () => playerEl.close());

/* Click on the backdrop (outside the frame) closes the dialog. */
playerEl.addEventListener("click", (event) => {
    if (event.target === playerEl) playerEl.close();
});

/* Esc fires "close" too — always tear the video down. */
playerEl.addEventListener("close", teardownPlayer);

playerVideo.addEventListener("error", () => {
    playerError.hidden = false;
    playerError.textContent = "This video could not be loaded. Check your connection or try another title.";
});

/* Thumbnail fallback: image error events don't bubble, so listen in
   the capture phase and swap in the inline SVG placeholder. */
document.addEventListener("error", (event) => {
    const img = event.target;
    if (img instanceof HTMLImageElement && img.hasAttribute("data-fallback")) {
        img.removeAttribute("data-fallback");
        img.src = FALLBACK_THUMB;
    }
}, true);

/* ---------- Boot ---------- */
function init() {
    heroTitle.textContent = featured.title;
    heroDesc.textContent = featured.description;
    renderChips();
    render();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
