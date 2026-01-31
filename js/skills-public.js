document.addEventListener("DOMContentLoaded", async () => {
  const skillContainer = document.getElementById("skills-container");
  const API_URL = "${API_BASE}/public/skills";

  if (!skillContainer) return;

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const skills = Array.isArray(data) ? data : data.data || [];

    if (skills.length > 0) {
      skillContainer.innerHTML = skills.map(s => `
        <div class="col-md-6 col-lg-3 d-flex mb-5">
          <div class="media block-6 services d-block bg-white rounded shadow-sm w-100 skill-card-main">
            <div class="skill-icon-circle shadow-sm">
              ${s.icon 
                ? `<img src="${s.icon}" class="skill-custom-img" alt="${s.title}">` 
                : `<span class="flaticon-web-programming" style="font-size:35px; color:#333;"></span>`}
            </div>
            <div class="media-body mt-2">
              <h3 class="heading">${s.title}</h3>
              <p>${s.description}</p>
            </div>
          </div>
        </div>`).join("");

      // Trigger animations
      if (typeof contentWayPoint === 'function') {
        setTimeout(contentWayPoint, 400);
      }
    }
  } catch (err) {
    console.error("Skills Load Error:", err);
  }
});