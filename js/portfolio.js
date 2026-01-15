// 1. GLOBAL SYNC: Using Port 5050 and 127.0.0.1 for MacBook stability
const API_BASE = "http://127.0.0.1:5050/api"; 

async function loadPortfolio() {
  console.log("Starting Portfolio Load from Port 5050...");

  try {
    // --- 1. HERO SECTION ---
    // Matches app.use("/api/public/hero", ...)
    const heroRes = await fetch(`${API_BASE}/public/hero`);
    if (heroRes.ok) {
      const heroData = await heroRes.json();
      if (heroData) {
        if (document.getElementById("hero-name"))
          document.getElementById("hero-name").innerText = heroData.name || "Atul Dubey";
        if (document.getElementById("hero-desc"))
          document.getElementById("hero-desc").innerText = heroData.description || "";
      }
    }

    // --- 2. HIGHLIGHTS SECTION ---
    // Matches app.use("/api/public/highlights", ...)
    const hlRes = await fetch(`${API_BASE}/public/highlights`);
    if (hlRes.ok) {
      const highlights = await hlRes.json();
      const hlContainer = document.getElementById("highlights-container");

      if (hlContainer && highlights.length > 0) {
        hlContainer.innerHTML = highlights.map((h) => `
          <div class="col-md-4 d-flex ftco-animate fadeInUp ftco-animated">
            <div class="blog-entry justify-content-end w-100">
              <a href="${h.link || "#"}" class="block-20" 
                 style="background-image: url('${h.image || "images/default.webp"}');">
              </a>
              <div class="text mt-3 float-right d-block">
                <div class="d-flex align-items-center mb-3 meta">
                  <p class="mb-0">
                    <span class="mr-2"><strong>${h.category}</strong> | ${h.status} | ${new Date(h.eventDate).toLocaleDateString()}</span>
                  </p>
                </div>
                <h3 class="heading"><a href="${h.link || "#"}">${h.title}</a></h3>
                <p>${h.summary || h.content || ""}</p>
              </div>
            </div>
          </div>
        `).join("");
      }
    }

    // --- 3. SKILLS SECTION ---
    // Matches app.use("/api/public/skills", ...)
    const skillContainer = document.getElementById("skills-container");
    if (skillContainer) {
      const skillRes = await fetch(`${API_BASE}/public/skills`);
      if (skillRes.ok) {
        const skills = await skillRes.json();
        if (skills.length > 0) {
          skillContainer.innerHTML = skills.map((s) => `
            <div class="col-md-6 col-lg-3 d-flex ftco-animate fadeInUp ftco-animated">
                <div class="media block-6 services d-block bg-white rounded-lg shadow w-100">
                    <div class="icon shadow d-flex align-items-center justify-content-center">
                        <span class="${s.iconClass || "flaticon-web-programming"}"></span>
                    </div>
                    <div class="media-body">
                        <h3 class="heading mb-3">${s.name || s.title || "New Tech"}</h3>
                        <p>${s.description || ""}</p>
                    </div>
                </div>
            </div>
          `).join("");
        }
      }
    }

    // --- 4. LOAD YOUTUBE VIDEOS ---
    // Matches app.use("/api/public/videos", ...)
    const videoRes = await fetch(`${API_BASE}/public/videos`);
    if (videoRes.ok) {
      const videos = await videoRes.json();
      const videoContainer = document.getElementById("video-container");
      if (videoContainer && videos.length > 0) {
        videoContainer.innerHTML = videos.map((v, index) => {
            let embedUrl = v.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
            if (!embedUrl.includes("enablejsapi=1")) embedUrl += (embedUrl.includes("?") ? "&" : "?") + "enablejsapi=1";
            return `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                    <div class="embed-responsive embed-responsive-16by9">
                        <div class="video-wrapper">
                            <iframe class="embed-responsive-item" src="${embedUrl}" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>`;
          }).join("");
          
          // Re-initialize Bootstrap Carousel logic here
          $("#videoCarousel").carousel({ interval: false });
      }
    }

    // --- 5. LOAD ACHIEVEMENTS STATS ---
    // Matches app.use("/api/public/stats", ...)
    const statRes = await fetch(`${API_BASE}/public/stats`);
    if (statRes.ok) {
      const stats = await statRes.json();
      const data = Array.isArray(stats) ? stats[0] : stats;
      if (data) {
          const mappings = {
            "stat-mentored": data.mentored, "stat-projects": data.projects, "stat-prototypes": data.prototypes,
            "stat-hardware": data.hardware, "stat-papers": data.papers, "stat-assisted": data.assisted,
            "stat-countries": data.countries, "stat-workshops": data.workshops,
          };
          Object.keys(mappings).forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = mappings[id] || 0;
          });
      }
    }

    // --- 6. LOAD IMAGE GALLERY ---
    // Matches app.use("/api/public/gallery", ...)
    const galleryRes = await fetch(`${API_BASE}/public/gallery`);
    if (galleryRes.ok) {
      const galleryItems = await galleryRes.json();
      const carouselContainer = document.getElementById("gallery-carousel");
      if (carouselContainer && galleryItems.length > 0) {
        carouselContainer.innerHTML = galleryItems.map((item) => `
          <div class="item">
              <div class="project img d-flex justify-content-center align-items-center" 
                   style="background-image: url('${item.imageUrl || item.image || "images/default.jpg"}'); height: 350px; margin: 10px; border-radius: 8px; background-size: cover; background-position: center;">
                  <a href="#" class="text text-center px-4" data-toggle="modal" data-target="#galleryModal" 
                     onclick="document.getElementById('galleryModalImg').src='${item.imageUrl || item.image}'">
                      <h3 class="mb-0 text-white font-weight-bold" style="font-size: 18px;">${item.title || "View Detail"}</h3>
                      <span class="text-white-50 small">${item.category || "Project"}</span>
                  </a>
              </div>
          </div>`).join("");
          
        // Re-initialize Owl Carousel
        $("#gallery-carousel").owlCarousel({ loop: true, autoplay: true, margin: 20, nav: true, responsive: { 0: { items: 1 }, 768: { items: 2 }, 1000: { items: 3 } } });
      }
    }

    // --- 7. LOAD PROJECT TILES ---
    // Matches app.use("/api/public/projects", ...)
    const projectRes = await fetch(`${API_BASE}/public/projects`);
    if (projectRes.ok) {
      const projects = await projectRes.json();
      const container = document.getElementById("projects-container");
      if (container && projects.length > 0) {
        container.innerHTML = projects.map((proj) => `
          <div class="col-md-3 mb-4 ftco-animate fadeInUp ftco-animated">
            <div class="project img d-flex justify-content-center align-items-center shadow-sm rounded" 
                 style="background-image: url('${proj.imageUrl || proj.image || "images/default-illustration.png"}'); height: 320px; background-size: contain; background-repeat: no-repeat; background-position: center; background-color: #fff;">
                <div class="overlay" style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255, 255, 255, 0.88); z-index: 1;"></div>
                <div class="text text-center px-3" style="z-index: 5; position: relative;">
                    <h3 class="font-weight-bold mb-1" style="color: #000 !important; font-size: 22px;">${proj.title}</h3>
                    <span style="color: #b1b493; font-weight: 700; text-transform: uppercase; font-size: 11px;">${proj.category}</span>
                </div>
                <a href="portfolio-detail.html?id=${proj._id}" class="stretched-link"></a>
            </div>
          </div>`).join("");
      }
    }
  } catch (err) {
    console.error("Critical Portfolio Load Error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadPortfolio);