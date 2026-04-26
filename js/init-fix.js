// Add this at the bottom of your scripts in index.html
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Run all public fetchers
    if (window.loadHero) await window.loadHero();
    if (window.loadSkills) await window.loadSkills();
    if (window.loadGallery) await window.loadGallery();
    if (window.loadVideos) await window.loadVideos();

    // 2. Trigger theme animations once data is in the DOM
    setTimeout(() => {
        if (typeof window.contentWayPoint === 'function') {
            window.contentWayPoint();
        }
    }, 800);
});