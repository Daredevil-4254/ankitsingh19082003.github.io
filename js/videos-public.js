document.addEventListener("DOMContentLoaded", async () => {
    const videoContainer = document.getElementById("video-container");
    const API_URL = "http://127.0.0.1:5050/api/public/videos";

    if (!videoContainer) return;

    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const videos = Array.isArray(data) ? data : data.data || [];

        if (videos.length > 0) {
            videoContainer.innerHTML = videos.map((v, index) => {
                let videoId = null;
                if (v.url.includes("v=")) {
                    videoId = v.url.split("v=")[1].split("&")[0];
                } else if (v.url.includes("youtu.be/")) {
                    videoId = v.url.split("youtu.be/")[1].split("?")[0];
                }

                return `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                    <div class="row justify-content-center">
                        <div class="col-md-10">
                            <div class="video-player-wrap shadow-lg">
                                <div class="embed-responsive embed-responsive-16by9">
                                    <iframe class="embed-responsive-item youtube-player" 
                                            src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0" 
                                            allowfullscreen></iframe>
                                </div>
                            </div>
                            <div class="video-info-bar text-center">
                                <h3 class="vid-title">${v.title}</h3>
                                <p class="vid-desc">${v.description || 'Watch Project Walkthrough'}</p>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join("");

            // FORCE AUTO-SCROLL INITIALIZATION
            if (window.jQuery && typeof window.jQuery.fn.carousel === "function") {
                const $carousel = window.jQuery("#videoCarousel");
                
                // Reset and Start
                $carousel.carousel('dispose'); 
                $carousel.carousel({
                    interval: 4000, // 4 seconds per slide
                    pause: "hover",
                    ride: "carousel"
                });
                $carousel.carousel('cycle'); 
            }
        }
    } catch (err) {
        console.error("Video Loading Error:", err);
    }
});