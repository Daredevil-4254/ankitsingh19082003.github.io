// 1. GLOBAL SYNC: Using Port 5050 and 127.0.0.1 for MacBook stability
const API_BASE = (window.portfolioConfig && window.portfolioConfig.API_BASE)
  ? window.portfolioConfig.API_BASE
  : (window.CONFIG ? window.CONFIG.API_BASE : '');
// Global State for Highlights
let showingAllHighlights = false;

async function loadPortfolio() {
  console.log("Starting Portfolio Load from Port 5050...");

  try {
    // --- 1. HERO SECTION ---
    try {
      const heroRes = await fetch(`${API_BASE}/public/hero`);
      if (heroRes.ok) {
        const heroData = await heroRes.json();
        const hero = Array.isArray(heroData) ? heroData[0] : heroData;

        if (hero) {
          if (document.getElementById("hero-greeting"))
            document.getElementById("hero-greeting").innerText = hero.greeting;
          if (document.getElementById("hero-name"))
            document.getElementById("hero-name").innerText = hero.name;
          if (document.getElementById("hero-subtitle"))
            document.getElementById("hero-subtitle").innerText = hero.subtitle;
          if (document.getElementById("hero-desc"))
            document.getElementById("hero-desc").innerText = hero.description;

          if (document.getElementById("hero-resume"))
            document.getElementById("hero-resume").href = hero.resumeLink;
          if (document.getElementById("hero-linkedin"))
            document.getElementById("hero-linkedin").href = hero.socialLinks?.linkedin;
          if (document.getElementById("hero-github"))
            document.getElementById("hero-github").href = hero.socialLinks?.github;

          if (hero.image) {
            const heroImg = document.getElementById("hero-img");
            if (heroImg) {
              heroImg.src = hero.image;
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

    // --- 2. HIGHLIGHTS SECTION ---
    const hlContainer = document.getElementById("highlights-container");
    if (hlContainer) {
      try {
        const hlRes = await fetch(`${API_BASE}/public/highlights`);
        if (hlRes.ok) {
          const data = await hlRes.json();
          window.allHighlights = Array.isArray(data) ? data : data.data || [];

          const urlParams = new URLSearchParams(window.location.search);
          const filterTag = urlParams.get('tag');

          if (filterTag) {
            const filtered = window.allHighlights.filter(h =>
              h.tags && h.tags.some(t => t.toLowerCase() === filterTag.toLowerCase())
            );
            renderHighlights(filtered, true);

            const heading = document.querySelector("#highlights-section .heading-section h2");
            if (heading) {
              heading.innerHTML = `Highlights <span style="color: #b1b493; font-size: 0.6em;">#${filterTag}</span>`;

              if (!document.getElementById("clear-filter-btn")) {
                const clearBtn = document.createElement("div");
                clearBtn.id = "clear-filter-btn";
                clearBtn.className = "text-center mt-2";
                clearBtn.innerHTML = `
                <button onclick="window.clearHighlightFilter()" 
                        class="btn btn-link font-weight-bold p-0 shadow-none text-uppercase" 
                        style="color: #b1b493; text-decoration: underline; font-size: 0.75rem; letter-spacing: 1px;">
                  Clear Filter
                </button>`;
                heading.parentNode.appendChild(clearBtn);
              }
            }
          } else {
            renderHighlights(window.allHighlights, false);
          }

          if (window.location.hash === '#highlights-section') {
            setTimeout(() => {
              document.getElementById('highlights-section').scrollIntoView({ behavior: 'smooth' });
            }, 800);
          }
        }
      } catch (e) {
        console.error("Highlights Error:", e);
        hlContainer.innerHTML = '<div class="col-12 text-center text-danger">Failed to load highlights.</div>';
      }
    }

    // --- 3. PROJECTS SECTION ---
    const projectRes = await fetch(`${API_BASE}/public/projects`);
    if (projectRes.ok) {
      const data = await projectRes.json();
      const projects = Array.isArray(data) ? data : data.data || [];
      const container = document.getElementById("projects-container");

      if (container && projects.length > 0) {
        container.innerHTML = projects.map(proj => `
        <div class="col-md-4 col-lg-3 mb-4 ftco-animate fadeInUp ftco-animated">
          <div class="project-card shadow-sm rounded bg-white h-100" 
               style="overflow: hidden; transition: transform 0.3s ease; border: 1px solid #eee;">
              <div class="img-wrap" style="height: 220px; position: relative; overflow: hidden; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); cursor: pointer;" 
                   onclick="window.location.href='portfolio-detail.html?id=${proj._id}'">
                  ${proj.image
            ? `<div class="project-img" style="background-image: url('${proj.image}'); background-size: cover; background-position: center; height: 100%; width: 100%; transition: transform 0.5s ease;"></div>`
            : `<div style="height:100%;display:flex;align-items:center;justify-content:center;"><i class="fas fa-code" style="font-size:3rem;color:rgba(177,180,147,0.4);"></i></div>`
          }
                  <div class="img-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(177, 180, 147, 0.2); opacity: 0; transition: 0.3s;"></div>
              </div>
              <div class="p-3 text-center">
                  <span style="color: #b1b493; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; display: block; margin-bottom: 5px;">
                      ${proj.category}
                  </span>
                  <h3 class="h6 font-weight-bold" style="margin-bottom: 0;">
                      <a href="portfolio-detail.html?id=${proj._id}" style="color: #000; text-decoration: none;">${proj.title}</a>
                  </h3>
              </div>
              <a href="portfolio-detail.html?id=${proj._id}" class="stretched-link" style="z-index: 10;"></a>
          </div>
        </div>`).join("");
      }
    }

  } catch (criticalErr) {
    console.error("Critical Load Error:", criticalErr);
  }
}

// --- GLOBAL HELPER FUNCTIONS ---

function renderHighlights(highlights, showAll = false) {
  const container = document.getElementById("highlights-container");
  if (!container) return;

  container.innerHTML = "";

  if (highlights.length === 0) {
    container.innerHTML = '<div class="col-12 text-center py-5 text-muted"><p>No highlights found.</p></div>';
    return;
  }

  const displayList = showAll ? highlights : highlights.slice(0, 6);

  container.innerHTML = displayList.map(h => {
    const dateOptions = { year: "numeric", month: "short" };
    const dateStr = h.eventDate ? new Date(h.eventDate).toLocaleDateString("en-US", dateOptions).toUpperCase() : "";
    const meta = [h.category, h.status, dateStr].filter(Boolean).join(" | ").toUpperCase();

    // Helper to safely strip HTML tags from scraped DB content 
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = h.content || h.description || "No summary available.";
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const safeSnippet = plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;

    return `
      <div class="col-lg-4 col-md-6 mb-4 ftco-animate fadeInUp ftco-animated">
        <div class="card highlight-card h-100 border-0 shadow-sm" style="transition: transform 0.3s ease;">
          <div class="highlight-img-wrap" style="cursor: pointer; overflow: hidden; height: 200px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);" onclick="window.location.href='highlight-details.html?id=${h._id}'">
            ${h.image ? `<img src="${h.image}" class="card-img-top" style="height: 100%; width: 100%; object-fit: cover;" alt="${h.title}" onerror="this.parentElement.innerHTML='<div style=height:100%;display:flex;align-items:center;justify-content:center;><i class=fas fa-file-alt style=font-size:3rem;color:rgba(177,180,147,0.4);></i></div>'">` : `<div style="height:100%;display:flex;align-items:center;justify-content:center;"><i class="fas fa-file-alt" style="font-size:3rem;color:rgba(177,180,147,0.4);"></i></div>`}
          </div>
          <div class="card-body d-flex flex-column p-4">
            <div class="mb-2 small font-weight-bold" style="color: #b1b493; letter-spacing: 1px; font-size: 0.75rem;">${meta}</div>
            <h5 class="card-title font-weight-bold mb-3 text-dark">${h.title}</h5>
            <p class="card-text text-muted flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; min-height: 4.5em;">
              ${safeSnippet}
            </p>
            <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <a href="highlight-details.html?id=${h._id}" class="font-weight-bold small text-uppercase" style="color: #b1b493; letter-spacing: 2px; text-decoration: none; font-size: 0.75rem;">
                    Read Case Study <i class="fas fa-long-arrow-alt-right ml-2"></i>
                </a>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");

  const viewMoreBtn = document.getElementById("view-more-highlights");
  if (viewMoreBtn) {
    viewMoreBtn.style.display = highlights.length > 6 ? "inline-block" : "none";
    viewMoreBtn.innerHTML = showAll
      ? `Show Less <i class="fas fa-chevron-up ml-2"></i>`
      : `View More Highlights <i class="fas fa-chevron-down ml-2"></i>`;
  }
}

window.toggleHighlights = function () {
  showingAllHighlights = !showingAllHighlights;
  renderHighlights(window.allHighlights, showingAllHighlights);

  if (!showingAllHighlights) {
    const el = document.getElementById("highlights-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
};

window.clearHighlightFilter = function () {
  window.location.href = "index.html#highlights-section";
};

window.openGalleryModal = function (src) {
  const modalImg = document.getElementById("galleryModalImg");
  if (modalImg) {
    modalImg.src = src;
    if (window.jQuery && typeof window.jQuery.fn.modal === "function") {
      window.jQuery("#galleryModal").modal("show");
    }
  }
};

// Start Load
document.addEventListener("DOMContentLoaded", loadPortfolio);