// js/highlight-details.js
const API_BASE = "http://localhost:5050/api"; 

document.addEventListener("DOMContentLoaded", async () => {
  const spinner = document.getElementById("loading-spinner");
  
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("No ID found in URL");
        window.location.href = 'index.html'; 
        return;
    }

    const res = await fetch(`${API_BASE}/public/highlights`);
    if (!res.ok) throw new Error("API Connection Failed");

    const json = await res.json();
    const allHighlights = Array.isArray(json) ? json : (json.data || []);
    const item = allHighlights.find((h) => String(h._id) === String(id));

    if (!item) {
      if(spinner) spinner.innerHTML = `<h3 class="text-danger py-5">Highlight not found.</h3>`;
      return;
    }

    // 🟢 FORCE SHOW CONTENT IMMEDIATELY
    if(spinner) spinner.classList.add("d-none");
    const mainContent = document.getElementById("main-content");
    if(mainContent) {
        mainContent.classList.remove("d-none");
        mainContent.style.display = "flex"; // Force display
    }

    // --- 1. TITLE, DATE & HERO ---
    const titleEl = document.getElementById("highlight-title");
    if(titleEl) titleEl.textContent = item.title;
    
    const dateEl = document.getElementById("highlight-date");
    if(dateEl && item.eventDate) {
        dateEl.textContent = new Date(item.eventDate).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
    }

    const heroEl = document.getElementById("hero-section");
    if(heroEl && item.image) {
        heroEl.style.backgroundImage = `url('${item.image}')`;
        heroEl.style.display = "block";
    }

    // --- 2. SUMMARY / CONTENT ---
    // Mapping 'content' from your admin.js payload and Mongoose Model
    const descEl = document.getElementById("highlight-desc");
    if(descEl) descEl.innerText = item.content || "No detailed summary available.";

    // --- 3. TAGS ---
    const tagsEl = document.getElementById("highlight-tags");
    if(tagsEl) {
        let tags = Array.isArray(item.tags) ? item.tags : [];
        tagsEl.innerHTML = tags.map(tag => `
            <a href="index.html?tag=${tag}" class="tag-cloud-link">#${tag}</a>
        `).join("");
    }

    // --- 4. LINKS ---
    const linksEl = document.getElementById("highlight-links");
    if(linksEl && item.link) {
        linksEl.innerHTML = `
            <a href="${item.link}" target="_blank" class="btn btn-primary py-3 px-4 shadow-sm">
                <i class="fas fa-external-link-alt mr-2"></i>View Project Source
            </a>`;
    }

    // --- 5. GALLERY ---
    const galleryEl = document.getElementById("project-gallery");
    if(galleryEl) {
        let galleryHtml = `<div class="col-md-12 mb-4"><img src="${item.image}" class="img-fluid rounded shadow border"></div>`;
        if(Array.isArray(item.gallery) && item.gallery.length > 0) {
            galleryHtml += item.gallery.map(imgSrc => `
                <div class="col-md-6 mb-4"><img src="${imgSrc}" class="img-fluid rounded shadow-sm border"></div>
            `).join("");
        }
        galleryEl.innerHTML = galleryHtml;
    }

  } catch (err) {
    console.error("Content Load Error:", err);
    if(spinner) spinner.innerHTML = `<div class="alert alert-warning">Error loading project. Check if Backend is on 5050.</div>`;
  }
});