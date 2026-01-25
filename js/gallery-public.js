document.addEventListener("DOMContentLoaded", async () => {
  const carouselContainer = document.getElementById("gallery-carousel");
  const gridContainer = document.getElementById("gallery-grid-container");
  const API_URL = "http://127.0.0.1:5050/api/public/gallery";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const images = Array.isArray(data) ? data : data.data || [];

    if (images.length === 0) return;

    // 1. Populate Owl Carousel (Home Page View)
    if (carouselContainer) {
      // Cleanup existing Owl instance to prevent doubling
      if (window.jQuery && typeof window.jQuery.fn.owlCarousel === "function") {
        window.jQuery("#gallery-carousel").trigger("destroy.owl.carousel");
      }

      carouselContainer.innerHTML = images.map(img => `
        <div class="item">
          <div class="project-wrap shadow-sm">
            <a href="javascript:void(0)" onclick="openGalleryModal('${img.image}')" 
               class="img d-flex align-items-center justify-content-center" 
               style="background-image: url(${img.image}); height: 320px; border-radius: 15px; background-size: cover; background-position: center;">
              <div class="icon d-flex align-items-center justify-content-center">
                <span class="fa fa-expand text-white"></span>
              </div>
            </a>
            <div class="text p-3 text-center">
              <h3 class="mb-0" style="font-size: 19px; font-weight: 800; color: #000;">${img.title || "Innovation"}</h3>
            </div>
          </div>
        </div>`).join("");

      // Re-init Owl Carousel
      if (window.jQuery && typeof window.jQuery.fn.owlCarousel === "function") {
        window.jQuery("#gallery-carousel").owlCarousel({
          autoplay: true,
          loop: images.length > 3,
          margin: 25,
          dots: true,
          responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 3 } },
        });
      }
    }

    // 2. Populate Full Grid Modal (View All Gallery)
    // Inside your gallery-public.js loop for gridContainer
    gridContainer.innerHTML = images.map(img => `
    <div class="col-lg-4 col-md-6 col-12 mb-4">
        <div class="gallery-grid-item-wrap" onclick="openGalleryModal('${img.image}')" style="cursor: zoom-in;">
            <img src="${img.image}" class="img-fluid" alt="${img.title || 'Project'}">
            <div class="grid-cap-area text-center">
                <h6 class="text-truncate">${img.title || 'Technical Innovation'}</h6>
            </div>
        </div>
    </div>`).join("");


  } catch (e) {
    console.error("Gallery Sync Error:", e);
  }
});

// Universal Modal Preview Logic
window.openGalleryModal = function (src) {
  const modalImg = document.getElementById("galleryModalImg");
  if (modalImg) {
    modalImg.src = src;
    window.jQuery('#galleryModal').modal('show');
  }
};
