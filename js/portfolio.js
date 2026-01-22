// 1. GLOBAL SYNC: Using Port 5050 and 127.0.0.1 for MacBook stability
const API_BASE = "http://127.0.0.1:5050/api";

async function loadPortfolio() {
  console.log("Starting Portfolio Load from Port 5050...");

  try {
    // --- 1. HERO SECTION (Sync with CMS) ---
    try {
      const heroRes = await fetch(`${API_BASE}/public/hero`);
      if (heroRes.ok) {
        const heroData = await heroRes.json();
        const hero = Array.isArray(heroData) ? heroData[0] : heroData;

        if (hero) {
          // Text Elements
          if (document.getElementById("hero-greeting"))
            document.getElementById("hero-greeting").innerText = hero.greeting;
          if (document.getElementById("hero-name"))
            document.getElementById("hero-name").innerText = hero.name;
          if (document.getElementById("hero-subtitle"))
            document.getElementById("hero-subtitle").innerText = hero.subtitle;
          if (document.getElementById("hero-desc"))
            document.getElementById("hero-desc").innerText = hero.description;

          // Links
          if (document.getElementById("hero-resume"))
            document.getElementById("hero-resume").href = hero.resumeLink;
          if (document.getElementById("hero-linkedin"))
            document.getElementById("hero-linkedin").href =
              hero.socialLinks?.linkedin;
          if (document.getElementById("hero-github"))
            document.getElementById("hero-github").href =
              hero.socialLinks?.github;

          // Background Image (or <img> tag)
          if (hero.image) {
            const heroImg = document.getElementById("hero-img");
            if (heroImg) {
              heroImg.src = hero.image;
              console.log("Profile image successfully updated from CMS.");
            } else {
              const bgEl = document.getElementById("hero-bg");
              if (bgEl) bgEl.style.backgroundImage = `url(${hero.image})`;
            }
          }
        }
      }
    } catch (e) {
      console.error("Hero Sync Error:", e);
    }

    // --- 2. HIGHLIGHTS SECTION (Interactive & Filterable) ---
    const hlContainer = document.getElementById("highlights-container");

    if (hlContainer) {
      try {
        const hlRes = await fetch(`${API_BASE}/public/highlights`);
        if (hlRes.ok) {
          const data = await hlRes.json();
          // Store globally for filtering
          window.allHighlights = Array.isArray(data) ? data : data.data || [];

          // Initial Render
          renderHighlights(window.allHighlights);
        }
      } catch (e) {
        console.error("Highlights Error:", e);
        hlContainer.innerHTML =
          '<div class="col-12 text-center text-danger">Failed to load highlights.</div>';
      }
    }

    // --- 3. SKILLS SECTION ---
    const skillContainer = document.getElementById("skills-container");
    if (skillContainer) {
      const skillRes = await fetch(`${API_BASE}/public/skills`);
      if (skillRes.ok) {
        const data = await skillRes.json();
        const skills = Array.isArray(data) ? data : data.data || [];

        if (skills.length > 0) {
          skillContainer.innerHTML = skills
            .map(
              (s) => `
            <div class="col-md-6 col-lg-3 d-flex ftco-animate fadeInUp ftco-animated">
                <div class="media block-6 services d-block bg-white rounded-lg shadow w-100">
                    <div class="icon shadow d-flex align-items-center justify-content-center">
                        ${
                          s.icon
                            ? `<img src="${s.icon}" style="width:40px; height:40px; object-fit:contain;">`
                            : `<span class="flaticon-web-programming"></span>`
                        }
                    </div>
                    <div class="media-body">
                        <h3 class="heading mb-3">${s.title || "New Tech"}</h3>
                        <p>${s.description || ""}</p>
                    </div>
                </div>
            </div>
          `,
            )
            .join("");
        }
      }
    }

    // --- 4. PROJECTS SECTION ---
    const projectRes = await fetch(`${API_BASE}/public/projects`);
    if (projectRes.ok) {
      const data = await projectRes.json();
      const projects = Array.isArray(data) ? data : data.data || [];
      const container = document.getElementById("projects-container");
      if (container && projects.length > 0) {
        container.innerHTML = projects
          .map(
            (proj) => `
          <div class="col-md-3 mb-4 ftco-animate fadeInUp ftco-animated">
            <div class="project img d-flex justify-content-center align-items-center shadow-sm rounded" 
                 style="background-image: url('${
                   proj.image || "images/default-illustration.png"
                 }'); height: 320px; background-size: contain; background-repeat: no-repeat; background-position: center; background-color: #fff;">
                <div class="overlay" style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255, 255, 255, 0.88); z-index: 1;"></div>
                <div class="text text-center px-3" style="z-index: 5; position: relative;">
                    <h3 class="font-weight-bold mb-1" style="color: #000 !important; font-size: 22px;">${
                      proj.title
                    }</h3>
                    <span style="color: #b1b493; font-weight: 700; text-transform: uppercase; font-size: 11px;">${
                      proj.category
                    }</span>
                </div>
                <a href="portfolio-detail.html?id=${
                  proj._id
                }" class="stretched-link"></a>
            </div>
          </div>`,
          )
          .join("");
      }
    }

    // --- 5. LOAD ACHIEVEMENT STATS ---
    const statsContainer = document.getElementById("stats-display");
    if (statsContainer) {
      try {
        const statRes = await fetch(`${API_BASE}/public/stats`);
        if (statRes.ok) {
          const data = await statRes.json();
          let rawStats = Array.isArray(data) ? data : data.data || [];

          const uniqueMap = {};
          rawStats.forEach((s) => {
            uniqueMap[s.label] = s;
          });
          let stats = Object.values(uniqueMap).reverse();

          if (stats.length > 0) {
            statsContainer.innerHTML = stats
              .map((s) => {
                const iconHtml = s.icon
                  ? `<img src="${s.icon}" alt="${s.label}" style="width: 60px; height: 60px; object-fit: cover;" class="rounded-circle mr-3 shadow-sm">`
                  : `<div class="icon d-flex justify-content-center align-items-center rounded-circle mr-3 shadow-sm" style="width: 60px; height: 60px; background: #b1b493; flex-shrink: 0;"><span class="fa fa-chart-line text-white" style="font-size: 24px"></span></div>`;

                return `
                <div class="col-md-3 justify-content-center counter-wrap d-flex">
                    <div class="block-18 d-flex shadow-sm rounded bg-white p-3 mb-4 align-items-center w-100" style="min-height: 100px; overflow: hidden;">
                        ${iconHtml}
                        <div class="text" style="max-width: calc(100% - 70px);">
                            <strong class="number" style="font-size: 1.5rem; color: #000; line-height: 1.2; word-wrap: break-word; display: block;">${s.value}</strong>
                            <span class="d-block mt-1" style="font-size: 11px; color: #b1b493; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2;">${s.label}</span>
                        </div>
                    </div>
                </div>`;
              })
              .join("");
          }
        }
      } catch (e) {
        console.error("Stats fetch failed", e);
      }
    }

    // --- 6. LOAD YOUTUBE VIDEOS ---
    try {
      const videoRes = await fetch(`${API_BASE}/public/videos`);
      if (videoRes.ok) {
        const videos = await videoRes.json();
        const videoContainer = document.getElementById("video-container");

        if (videoContainer && videos.length > 0) {
          videoContainer.innerHTML = videos
            .map((v, index) => {
              const finalId =
                v.videoId ||
                v.url.split("v=")[1]?.split("&")[0] ||
                v.url.split("/").pop();
              const embedUrl = `https://www.youtube.com/embed/${finalId}`;

              return `
              <div class="carousel-item ${index === 0 ? "active" : ""}">
                <div class="embed-responsive embed-responsive-16by9 bg-dark rounded shadow-sm">
                  <iframe class="embed-responsive-item" src="${embedUrl}" allowfullscreen style="border: none;"></iframe>
                </div>
                <div class="carousel-caption d-none d-md-block bg-black-50 rounded mt-2 p-2">
                  <h5 class="text-white mb-0">${v.title}</h5>
                </div>
              </div>`;
            })
            .join("");

          if (
            window.jQuery &&
            typeof window.jQuery.fn.carousel === "function"
          ) {
            const $carousel = window.jQuery("#videoCarousel");
            $carousel.carousel("dispose");
            $carousel.carousel({ interval: false });
          }
        }
      }
    } catch (err) {
      console.error("Video Loading Error:", err);
    }
    // ... existing sections 1-6 (Hero, Highlights, Skills, Projects, Stats, YouTube) ...

    // --- 7. ENHANCED GALLERY SECTION ---
    const carouselContainer = document.getElementById("gallery-carousel");
    const gridContainer = document.getElementById("gallery-grid-container");

    if (carouselContainer || gridContainer) {
      try {
        const galRes = await fetch(`${API_BASE}/public/gallery`);
        if (galRes.ok) {
          const data = await galRes.json();
          const images = Array.isArray(data) ? data : data.data || [];

          if (images.length > 0) {
            // A. Update the Carousel (Main Page)
            if (carouselContainer) {
              // 🟢 CRITICAL: Wipe old Owl Carousel data before injecting new HTML
              if (
                window.jQuery &&
                typeof window.jQuery.fn.owlCarousel === "function"
              ) {
                window
                  .jQuery("#gallery-carousel")
                  .trigger("destroy.owl.carousel");
              }

              carouselContainer.innerHTML = images
                .map(
                  (img) => `
            <div class="item">
              <div class="project-wrap shadow-sm">
                <a href="javascript:void(0)" 
                   onclick="openGalleryModal('${img.image}')"
                   class="img d-flex align-items-center justify-content-center" 
                   style="background-image: url(${img.image}); height: 320px; border-radius: 15px;">
                  <div class="icon d-flex align-items-center justify-content-center">
                    <span class="fa fa-expand text-white"></span>
                  </div>
                </a>
                <div class="text p-3 text-center">
                  <h3 class="mb-0" style="font-size: 18px; color: #000;">${img.title || "Innovation"}</h3>
                </div>
              </div>
            </div>`,
                )
                .join("");

              // RE-INITIALIZE OWL CAROUSEL
              if (
                window.jQuery &&
                typeof window.jQuery.fn.owlCarousel === "function"
              ) {
                window.jQuery("#gallery-carousel").owlCarousel({
                  autoplay: true,
                  loop: images.length > 3, // Only loop if there are enough items
                  margin: 20,
                  dots: true,
                  responsive: {
                    0: { items: 1 },
                    600: { items: 2 },
                    1000: { items: 3 },
                  },
                });
              }
            }

            // B. Update the Grid (Inside the "View Full Gallery" Modal)
            if (gridContainer) {
              gridContainer.innerHTML = images
                .map(
                  (img) => `
            <div class="col-md-3 col-6 p-2">
              <div class="gallery-grid-item" onclick="openGalleryModal('${img.image}')" style="cursor: pointer;">
                <img src="${img.image}" class="img-fluid rounded shadow-sm" style="height: 200px; width: 100%; object-fit: cover;">
              </div>
            </div>`,
                )
                .join("");
            }
          }
        }
      } catch (e) {
        console.error("Gallery Load Error:", e);
      }
    }
  } catch (criticalErr) {
    console.error("Critical Load Error:", criticalErr);
  }
}

// --- GLOBAL HELPER FUNCTIONS (Outside loadPortfolio) ---

window.openGalleryModal = function (src) {
  const modalImg = document.getElementById("galleryModalImg");
  if (modalImg) {
    modalImg.src = src;
    if (window.jQuery && typeof window.jQuery.fn.modal === "function") {
      window.jQuery("#galleryModal").modal("show"); // Standard Bootstrap 4 trigger
    }
  }
};
// ==============================================
// HIGHLIGHTS HELPER FUNCTIONS (Global Scope)
// ==============================================

//  1.) Updated Render Logic
// portfolio.js - Updated Render Logic

function renderHighlights(highlights) {
  const container = document.getElementById("highlights-container");
  if (!container) return;

  if (highlights.length === 0) {
    container.innerHTML =
      '<div class="col-12 text-center py-5 text-muted"><p>No highlights found.</p></div>';
    return;
  }

  container.innerHTML = highlights
    .map((h) => {
      // 1. Format Date (e.g., "OCT, 2024")
      const dateOptions = { year: "numeric", month: "short" };
      const dateStr = h.date
        ? new Date(h.date)
            .toLocaleDateString("en-US", dateOptions)
            .toUpperCase()
        : "";

      // 2. Format Category & Status (e.g., "PROJECT | ONGOING")
      const meta = [h.category, h.status, dateStr]
        .filter(Boolean)
        .join(" | ")
        .toUpperCase();

      return `
      <div class="col-lg-4 col-md-6 mb-4 ftco-animate fadeInUp ftco-animated">
        <div class="card highlight-card h-100 border-0 shadow-sm" onclick="window.location.href='highlight-details.html?id=${h._id}'" style="cursor: pointer;">
          
          <div class="highlight-img-wrap">
            <img src="${h.image || "images/default.webp"}" class="card-img-top" alt="${h.title}">
          </div>
          
          <div class="card-body d-flex flex-column p-4">
            
            <div class="mb-2 small font-weight-bold" style="color: #b1b493; letter-spacing: 1px; font-size: 0.75rem;">
                ${meta}
            </div>

            <h5 class="card-title font-weight-bold mb-3 text-dark">
                ${h.title}
            </h5>
            
            <p class="card-text text-muted flex-grow-1" style="line-height: 1.6; font-size: 0.95rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${h.description || "No description available."}
            </p>
            
            <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <div>
                   ${(h.tags || [])
                     .slice(0, 1)
                     .map(
                       (t) =>
                         `<span class="badge bg-light text-muted border px-2 py-1">#${t}</span>`,
                     )
                     .join("")}
                </div>

                <span class="text-primary font-weight-bold small text-uppercase" style="letter-spacing: 0.5px;">
                    Read Case Study <i class="fas fa-arrow-right ml-1"></i>
                </span>
            </div>

          </div>
        </div>
      </div>
    `;
    })
    .join("");
}
// 2. Open Detail Modal
window.openHighlightModal = function (id) {
  const highlight = window.allHighlights.find((h) => h._id === id);
  if (!highlight) return;

  const dateStr = highlight.date
    ? new Date(highlight.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Fill Modal Data
  document.getElementById("modalHTitle").innerText = highlight.title;
  document.getElementById("modalHDate").innerText = dateStr
    ? `Published on ${dateStr}`
    : "";
  document.getElementById("modalHImg").src =
    highlight.image || "images/default.webp";
  document.getElementById("modalHDesc").innerText =
    highlight.description || highlight.content || "";

  // Fill Tags
  const tagsContainer = document.getElementById("modalHTags");
  const tags = Array.isArray(highlight.tags) ? highlight.tags : [];
  tagsContainer.innerHTML = tags
    .map(
      (tag) => `
    <span class="highlight-tag" onclick="filterHighlightsByTag('${tag}'); $('#highlightModal').modal('hide');" style="font-size: 0.85rem; padding: 0.5em 1em;">#${tag}</span>
  `,
    )
    .join("");

  // Fill Links
  const linksContainer = document.getElementById("modalHLinks");
  let linksHtml = "";
  if (highlight.paperLink) {
    linksHtml += `<a href="${highlight.paperLink}" target="_blank" class="btn btn-primary shadow-sm px-4"><i class="fas fa-external-link-alt mr-2"></i>View Paper/Project</a>`;
  }
  // Check both galleryLink and link (legacy support)
  const galLink = highlight.galleryLink || highlight.link;
  if (galLink) {
    const isInternal = galLink.startsWith("#");
    const target = isInternal ? "_self" : "_blank";
    linksHtml += `<a href="${galLink}" target="${target}" class="btn btn-outline-secondary shadow-sm px-4"><i class="fas fa-images mr-2"></i>View Media</a>`;
  }
  linksContainer.innerHTML = linksHtml;

  // Show Modal (Bootstrap 4)
  if (window.jQuery) window.jQuery("#highlightModal").modal("show");
};

// 3. Filter by Tag
window.filterHighlightsByTag = function (tag) {
  const filtered = window.allHighlights.filter(
    (h) => h.tags && h.tags.includes(tag),
  );

  // Update Heading to show filter status
  const heading = document.querySelector(
    "#highlights-section .heading-section h2",
  );
  if (heading) {
    if (!heading.getAttribute("data-original"))
      heading.setAttribute("data-original", heading.innerText);

    heading.innerHTML = `Highlights <span class="text-primary" style="font-size: 0.6em; vertical-align: middle;">#${tag}</span>`;

    // Add Clear Button if missing
    if (!document.getElementById("clear-filter-btn")) {
      const clearBtn = document.createElement("div");
      clearBtn.id = "clear-filter-btn";
      clearBtn.className = "text-center mt-2";
      clearBtn.innerHTML = `<button class="btn btn-sm btn-outline-dark" onclick="window.clearHighlightFilter()"><i class="fas fa-times mr-2"></i>Clear Filter</button>`;
      heading.parentNode.appendChild(clearBtn);
    }
  }

  renderHighlights(filtered);
  document
    .getElementById("highlights-section")
    .scrollIntoView({ behavior: "smooth" });
};

// 4. Clear Filter
window.clearHighlightFilter = function () {
  const heading = document.querySelector(
    "#highlights-section .heading-section h2",
  );
  if (heading && heading.getAttribute("data-original")) {
    heading.innerText = heading.getAttribute("data-original");
  }
  const btn = document.getElementById("clear-filter-btn");
  if (btn) btn.remove();

  renderHighlights(window.allHighlights);
};
document.addEventListener("DOMContentLoaded", loadPortfolio);
