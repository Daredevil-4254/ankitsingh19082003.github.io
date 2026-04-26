const API_BASE = window.portfolioConfig.API_BASE;

document.addEventListener("DOMContentLoaded", async () => {
  const titleEl = document.getElementById("highlight-title");
  const categoryEl = document.getElementById("highlight-category");
  const bgEl = document.getElementById("hero-bg");
  const descEl = document.getElementById("highlight-desc");
  const tagsEl = document.getElementById("highlight-tags");
  const linksEl = document.getElementById("highlight-links");
  const relatedEl = document.getElementById("related-highlights");
  const galleryEl = document.getElementById("project-gallery");
  const mainContent = document.getElementById("main-content");
  const spinner = document.getElementById("loading-spinner");

  // NEW: Metadata elements for Date and Location
  const dateEl = document.getElementById("highlight-date");
  const locationEl = document.getElementById("highlight-location");

  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) { window.location.href = 'index.html'; return; }

    const res = await fetch(`${API_BASE}/public/highlights`);
    const json = await res.json();
    const allHighlights = Array.isArray(json) ? json : (json.data || []);
    const item = allHighlights.find((h) => String(h._id) === String(id));

    if (!item) { 
        if (titleEl) titleEl.innerText = "Project Not Found"; 
        return; 
    }

    // 1. HEADER & HERO
    if (titleEl) titleEl.innerText = item.title;
    if (categoryEl) categoryEl.innerText = item.category || "Highlight"; 
    if (bgEl) {
      bgEl.style.backgroundImage = `url('${item.image && item.image.trim() ? item.image : 'images/bg_1.jpg'}')`;
    }

    // 2. METADATA (Date & Venue)
    if (dateEl) {
      if (item.eventDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.innerText = new Date(item.eventDate).toLocaleDateString(undefined, options);
      } else {
        dateEl.innerText = "Date TBD";
      }
    }

    if (locationEl) {
      locationEl.innerText = item.venue || "Global / Remote";
    }

    // 3. CONTENT
    if (descEl) {
      descEl.innerHTML = item.content || item.description || "<p>No description available.</p>";
    }

    // 4. TAGS
    if (tagsEl) {
      if (item.tags && item.tags.length > 0) {
        tagsEl.innerHTML = item.tags.map(t =>
          `<a href="index.html?tag=${encodeURIComponent(t)}#highlights-section" class="tag-cloud-link">${t}</a>`
        ).join("");
      } else {
        tagsEl.innerHTML = "<span class='text-muted small'>No tags</span>";
      }
    }

    // 5. LINKS
    if (linksEl && item.link) {
      linksEl.innerHTML = `
            <a href="${item.link}" target="_blank" class="btn btn-primary py-2 px-4 shadow-sm" style="background: #b1b493; border:none; border-radius: 50px; font-weight: 600;">
                <i class="fas fa-external-link-alt mr-2"></i> View Project / Source
            </a>`;
    }

    // 6. GALLERY (Owl Carousel & Magnific Popup)
    if (galleryEl) {
      let allImages = [];
      if (item.image && item.image.trim().length > 10) allImages.push(item.image);
      
      if (item.gallery && Array.isArray(item.gallery)) {
        const validGallery = item.gallery.filter(img => img && typeof img === 'string' && img.length > 10);
        allImages = [...allImages, ...validGallery];
      }
      allImages = [...new Set(allImages)];

      if (allImages.length > 0) {
        galleryEl.className = "owl-carousel owl-theme";
        galleryEl.innerHTML = allImages.map(imgSrc => `
            <div class="item">
                <a href="${imgSrc}" class="image-popup gallery-item-link" style="display: block; position: relative;">
                    <img src="${imgSrc}" alt="Gallery" style="height: 250px; width: 100%; object-fit: cover; border-radius: 6px;">
                    <div class="gallery-overlay-hover">
                         <i class="fa fa-expand text-white fa-2x"></i>
                    </div>
                </a>
            </div>
        `).join("");

        setTimeout(() => {
          if (window.jQuery && window.jQuery.fn.owlCarousel) {
            const $gallery = window.jQuery(galleryEl);
            $gallery.trigger('destroy.owl.carousel');
            $gallery.owlCarousel({
              loop: allImages.length > 1,
              margin: 20,
              nav: true,
              dots: true,
              autoplay: true,
              autoplayTimeout: 4000,
              smartSpeed: 800,
              navText: [
                '<span class="fa fa-chevron-left"></span>',
                '<span class="fa fa-chevron-right"></span>'
              ],
              responsive: {
                0: { items: 1, nav: false },
                600: { items: 2, nav: true },
                1000: { items: 3, nav: true }
              }
            });

            if (window.jQuery.fn.magnificPopup) {
              $gallery.magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: { enabled: true }
              });
            }
          }
        }, 300);
      } else {
        galleryEl.innerHTML = `<div class="p-3 text-muted">No additional images available.</div>`;
      }
    }

    // 7. RELATED WORK
    if (relatedEl) {
      const related = allHighlights.filter(h => String(h._id) !== String(item._id)).slice(0, 3);
      if (related.length > 0) {
        relatedEl.innerHTML = related.map(r => `
              <a href="highlight-details.html?id=${r._id}" class="related-item d-flex align-items-center mb-3 text-dark text-decoration-none">
                  <div style="width: 60px; height: 60px; background-image: url('${r.image || 'images/bg_1.jpg'}'); background-size: cover; border-radius: 5px; margin-right: 15px;"></div>
                  <div><h6 style="font-size: 14px; font-weight: 600; margin:0;">${r.title}</h6></div>
              </a>
          `).join("");
      } else {
        relatedEl.innerHTML = "<p class='text-muted small'>No related projects.</p>";
      }
    }

    // Final UI Unhide
    if (spinner) spinner.style.display = "none";
    if (mainContent) {
      mainContent.classList.remove("d-none");
      mainContent.style.opacity = "1";
    }

  } catch (err) {
    console.error("Error loading highlight:", err);
    if (spinner) spinner.style.display = "none";
  }
});