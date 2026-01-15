// =========================================================
//  MASTER CMS CONTROLLER
//  Target: http://127.0.0.1:5050/api
// =========================================================

const API_BASE = "http://127.0.0.1:5050/api";
const TOKEN_KEY = "token"; // Unified token key

// --- 1. GLOBAL HELPERS -----------------------------------

// Authorization Header
const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem(TOKEN_KEY)}`
});

// Generic Toast Notification
window.showToast = function(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type} border-0 mb-2`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${msg}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.closest('.toast').remove()"></button>
        </div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Generic Image Reader (Handles all file inputs)
function setupImagePreview(inputId, hiddenId, previewId, containerId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                document.getElementById(hiddenId).value = evt.target.result;
                const img = document.getElementById(previewId);
                img.src = evt.target.result;
                if(containerId) document.getElementById(containerId).classList.remove("hidden", "d-none");
            };
            reader.readAsDataURL(file);
        }
    });
}

// --- 2. AUTHENTICATION -----------------------------------
(function checkAuth() {
    if (window.location.pathname.includes("login.html")) return;
    if (!localStorage.getItem(TOKEN_KEY)) window.location.href = "login.html";
})();

window.logout = function() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "login.html";
};


// --- 3. HIGHLIGHTS SECTION -------------------------------
let galleryFilesArray = []; // Local state for gallery upload

window.loadHighlights = async function() {
    const list = document.getElementById("highlights-list");
    list.innerHTML = `<p class="placeholder-text">Loading...</p>`;
    try {
        const res = await fetch(`${API_BASE}/public/highlights`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.data || [];
        
        list.innerHTML = items.length ? items.map(h => `
            <div class="card p-3 mb-2 shadow-sm border-0">
                <div class="d-flex justify-content-between">
                    <h5 class="fw-bold m-0">${h.title}</h5>
                    <span class="badge bg-primary">${h.category}</span>
                </div>
                <small class="text-muted">${h.eventDate ? new Date(h.eventDate).toLocaleDateString() : 'No Date'}</small>
                <div class="d-flex gap-2 mt-2">
                    <button onclick="editHighlight('${h._id}')" class="btn btn-sm btn-warning text-white">Edit</button>
                    <button onclick="deleteHighlight('${h._id}')" class="btn btn-sm btn-outline-danger">Delete</button>
                </div>
            </div>`).join("") : `<p class="placeholder-text">No highlights found.</p>`;
    } catch(e) { list.innerHTML = `<p class="text-danger">Error loading data.</p>`; }
};

window.editHighlight = async function(id) {
    try {
        const res = await fetch(`${API_BASE}/public/highlights/${id}`);
        const data = await res.json();
        const item = data.data || data;

        document.getElementById("hlId").value = item._id;
        document.getElementById("hlTitle").value = item.title;
        document.getElementById("hlCategory").value = item.category;
        document.getElementById("hlStatus").value = item.status;
        document.getElementById("hlVenue").value = item.venue || "";
        document.getElementById("hlDesc").value = item.content || "";
        document.getElementById("hlTags").value = item.tags ? (Array.isArray(item.tags) ? item.tags.join(",") : item.tags) : "";
        document.getElementById("highlight-link-input").value = item.link || "";
        if(item.eventDate) document.getElementById("hlDate").value = new Date(item.eventDate).toISOString().split("T")[0];

        // Images
        if(item.image) {
            document.getElementById("poster-hidden-value").value = item.image;
            document.getElementById("poster-preview-img").src = item.image;
            document.getElementById("poster-preview-container").classList.remove("hidden");
        }
        
        document.getElementById("highlightForm").scrollIntoView({behavior:"smooth"});
        window.showToast("Loaded entry details", "info");
    } catch(e) { window.showToast("Error loading entry", "danger"); }
};

window.deleteHighlight = async function(id) {
    if(!confirm("Delete this highlight?")) return;
    await fetch(`${API_BASE}/admin/highlights/${id}`, { method: "DELETE", headers: getAuthHeaders() });
    loadHighlights();
};

// Form Handler
const hlForm = document.getElementById("highlightForm");
if(hlForm) {
    // Setup Poster Image
    setupImagePreview("poster-upload-input", "poster-hidden-value", "poster-preview-img", "poster-preview-container");
    
    // Setup Gallery Array
    document.getElementById("gallery-upload-input").addEventListener("change", (e) => {
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                galleryFilesArray.push(evt.target.result);
                // Simple Preview Render
                const img = document.createElement("img");
                img.src = evt.target.result;
                img.style = "width:50px; height:50px; object-fit:cover; border-radius:4px;";
                document.getElementById("gallery-preview-container").classList.remove("hidden");
                document.getElementById("gallery-preview-container").appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    hlForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("hlId").value;
        const payload = {
            title: document.getElementById("hlTitle").value,
            category: document.getElementById("hlCategory").value,
            status: document.getElementById("hlStatus").value,
            content: document.getElementById("hlDesc").value,
            venue: document.getElementById("hlVenue").value,
            tags: document.getElementById("hlTags").value,
            eventDate: document.getElementById("hlDate").value,
            link: document.getElementById("highlight-link-input").value,
            image: document.getElementById("poster-hidden-value").value,
            gallery: galleryFilesArray
        };

        const url = id ? `${API_BASE}/admin/highlights/${id}` : `${API_BASE}/admin/highlights`;
        const method = id ? "PUT" : "POST";

        const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
        if(res.ok) {
            window.showToast("Highlight Saved!", "success");
            hlForm.reset();
            galleryFilesArray = []; // Reset gallery
            document.getElementById("gallery-preview-container").innerHTML = "";
            document.getElementById("hlId").value = "";
            loadHighlights();
        } else {
            window.showToast("Save Failed", "danger");
        }
    });
}


// --- 4. PROJECTS SECTION ---------------------------------
window.loadProjects = async function() {
    const list = document.getElementById("projectsList");
    try {
        const res = await fetch(`${API_BASE}/public/projects`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.data || [];
        
        list.innerHTML = items.map(p => `
            <div class="card p-3 mb-3 shadow-sm border-0">
                <div class="d-flex align-items-center gap-3">
                    <img src="${p.image || p.thumbnail || ''}" style="width:60px; height:60px; object-fit:cover; border-radius:5px; background:#eee;">
                    <div class="flex-grow-1">
                        <h5 class="m-0 fw-bold">${p.title}</h5>
                        <small class="text-muted">${p.category}</small>
                    </div>
                    <div>
                         <button onclick="editProject('${p._id}')" class="btn btn-sm btn-warning text-white">Edit</button>
                         <button onclick="deleteProject('${p._id}')" class="btn btn-sm btn-outline-danger">Del</button>
                    </div>
                </div>
            </div>`).join("");
    } catch(e) { list.innerHTML = `<p class="text-danger">Error loading projects</p>`; }
};

window.editProject = async function(id) {
    const res = await fetch(`${API_BASE}/public/projects/${id}`);
    const item = await res.json();
    document.getElementById("pId").value = item._id;
    document.getElementById("pTitle").value = item.title;
    document.getElementById("pCategory").value = item.category;
    document.getElementById("pSummary").value = item.summary;
    document.getElementById("pDescription").value = item.description || "";
    document.getElementById("pTech").value = Array.isArray(item.technologies) ? item.technologies.join(", ") : item.technologies;
    document.getElementById("pLink").value = item.link || "";
    document.getElementById("pImage").value = item.image || "";
    document.getElementById("projectForm").scrollIntoView({behavior:"smooth"});
};

window.deleteProject = async function(id) {
    if(confirm("Delete Project?")) {
        await fetch(`${API_BASE}/admin/projects/${id}`, { method: "DELETE", headers: getAuthHeaders() });
        loadProjects();
    }
};

const projForm = document.getElementById("projectForm");
if(projForm) {
    setupImagePreview("pThumbnail", "pImage", null, null); // Just value, no preview img in this form
    projForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("pId").value;
        const payload = {
            title: document.getElementById("pTitle").value,
            category: document.getElementById("pCategory").value,
            summary: document.getElementById("pSummary").value,
            description: document.getElementById("pDescription").value,
            technologies: document.getElementById("pTech").value,
            link: document.getElementById("pLink").value,
            image: document.getElementById("pImage").value
        };
        const url = id ? `${API_BASE}/admin/projects/${id}` : `${API_BASE}/admin/projects`;
        await fetch(url, { method: id ? "PUT" : "POST", headers: getAuthHeaders(), body: JSON.stringify(payload) });
        window.showToast("Project Saved!", "success");
        projForm.reset();
        document.getElementById("pId").value = "";
        loadProjects();
    });
}


// --- 5. STATS SECTION ------------------------------------
window.loadStats = async function() {
    const list = document.getElementById("statsList");
    const res = await fetch(`${API_BASE}/public/stats`);
    const data = await res.json();
    const items = data.data || data;
    list.innerHTML = items.map(s => `
        <div class="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center">
            <span class="fw-bold">${s.value} <small class="text-muted">${s.label}</small></span>
            <button onclick="deleteStat('${s._id}')" class="btn btn-sm btn-danger">&times;</button>
        </div>`).join("");
};

window.deleteStat = async function(id) {
    if(confirm("Delete?")) {
        await fetch(`${API_BASE}/admin/stats/${id}`, { method: "DELETE", headers: getAuthHeaders() });
        loadStats();
    }
};

const statForm = document.getElementById("statsForm");
if(statForm) {
    setupImagePreview("statIcon", "statIconBase64", null, null);
    statForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            value: document.getElementById("statValue").value,
            label: document.getElementById("statLabel").value,
            icon: document.getElementById("statIconBase64").value
        };
        await fetch(`${API_BASE}/admin/stats`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload) });
        window.showToast("Stat Added");
        statForm.reset();
        loadStats();
    });
}


// --- 6. HERO SECTION -------------------------------------
window.loadHero = async function() {
    try {
        const res = await fetch(`${API_BASE}/public/hero`);
        const data = await res.json();
        const hero = Array.isArray(data) ? data[0] : data;
        if(!hero) return;

        document.getElementById("hGreeting").value = hero.greeting || "";
        document.getElementById("hName").value = hero.name || "";
        document.getElementById("hSubtitle").value = hero.subtitle || "";
        document.getElementById("hResume").value = hero.resumeLink || "";
        document.getElementById("hDesc").value = hero.description || "";
        
        if(hero.socialLinks) {
            document.getElementById("hLinkedin").value = hero.socialLinks.linkedin || "";
            document.getElementById("hGithub").value = hero.socialLinks.github || "";
        }
        if(hero.image) {
            document.getElementById("hImageBase64").value = hero.image;
            document.getElementById("hPreviewImg").src = hero.image;
            document.getElementById("heroImgPreview").classList.remove("hidden");
        }
    } catch(e) { console.error("Hero load error", e); }
};

const heroForm = document.getElementById("heroForm");
if(heroForm) {
    setupImagePreview("hImageInput", "hImageBase64", "hPreviewImg", "heroImgPreview");
    heroForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            greeting: document.getElementById("hGreeting").value,
            name: document.getElementById("hName").value,
            subtitle: document.getElementById("hSubtitle").value,
            description: document.getElementById("hDesc").value,
            resumeLink: document.getElementById("hResume").value,
            image: document.getElementById("hImageBase64").value,
            socialLinks: {
                linkedin: document.getElementById("hLinkedin").value,
                github: document.getElementById("hGithub").value
            }
        };
        await fetch(`${API_BASE}/admin/hero`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload) });
        window.showToast("Hero Updated!", "success");
    });
}


// --- 7. SKILLS SECTION -----------------------------------
window.loadSkills = async function() {
    const list = document.getElementById("skillsList");
    const res = await fetch(`${API_BASE}/public/skills`);
    const data = await res.json();
    const items = data.data || data;
    list.innerHTML = items.map(s => `
        <div class="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
                <img src="${s.icon || ''}" style="width:30px; height:30px;">
                <span class="fw-bold">${s.title}</span>
            </div>
            <button onclick="deleteSkill('${s._id}')" class="btn btn-sm btn-danger">&times;</button>
        </div>`).join("");
};

window.deleteSkill = async function(id) {
    if(confirm("Delete Skill?")) {
        await fetch(`${API_BASE}/admin/skills/${id}`, { method: "DELETE", headers: getAuthHeaders() });
        loadSkills();
    }
};

const skillForm = document.getElementById("skillForm");
if(skillForm) {
    setupImagePreview("skIconInput", "skIconBase64", null, null);
    skillForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById("skTitle").value,
            description: document.getElementById("skDesc").value,
            icon: document.getElementById("skIconBase64").value
        };
        await fetch(`${API_BASE}/admin/skills`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload) });
        window.showToast("Skill Added");
        skillForm.reset();
        loadSkills();
    });
}


// --- 8. VIDEOS SECTION -----------------------------------
window.loadVideos = async function() {
    const list = document.getElementById("videosList");
    const res = await fetch(`${API_BASE}/public/videos`);
    const data = await res.json();
    list.innerHTML = (Array.isArray(data) ? data : []).map(v => `
        <div class="card p-2 mb-2 d-flex flex-row justify-content-between">
            <span>${v.title}</span>
            <button onclick="deleteVideo('${v._id}')" class="btn btn-sm btn-danger">Del</button>
        </div>`).join("");
};

window.saveVideo = async function() {
    const payload = {
        title: document.getElementById("vidTitle").value,
        url: document.getElementById("vidUrl").value,
        description: document.getElementById("vidDesc").value
    };
    await fetch(`${API_BASE}/admin/videos`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload) });
    window.showToast("Video Saved");
    document.getElementById("vidTitle").value = "";
    document.getElementById("vidUrl").value = "";
    loadVideos();
};

window.deleteVideo = async function(id) {
    if(confirm("Delete Video?")) {
        await fetch(`${API_BASE}/admin/videos/${id}`, { method: "DELETE", headers: getAuthHeaders() });
        loadVideos();
    }
};


// --- 9. GALLERY SECTION ----------------------------------
window.loadGallery = async function() {
    const list = document.getElementById("galleryList");
    const res = await fetch(`${API_BASE}/public/gallery`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : [];
    
    list.innerHTML = items.map(g => `
        <div style="display:inline-block; margin:5px; text-align:center;">
            <img src="${g.imageUrl}" style="width:100px; height:80px; object-fit:cover; border-radius:5px;">
            <br>
            <button onclick="deleteGalleryImage('${g._id}')" class="btn btn-sm btn-link text-danger p-0">Delete</button>
        </div>
    `).join("");
};

window.saveGalleryImage = async function() {
    // Note: The file input calls previewGalleryImage(event) in HTML which isn't defined here yet.
    // Let's rely on the image preview helper we made.
    const title = document.getElementById("imgTitle").value;
    const imgData = document.getElementById("galleryPreview").src; // Get from preview
    
    if(!title || !imgData) return window.showToast("Missing title or image", "warning");

    await fetch(`${API_BASE}/admin/gallery`, { 
        method: "POST", 
        headers: getAuthHeaders(), 
        body: JSON.stringify({ title, imageUrl: imgData }) 
    });
    window.showToast("Image Uploaded");
    document.getElementById("imgTitle").value = "";
    document.getElementById("galleryPreviewContainer").classList.add("d-none");
    loadGallery();
};

window.previewGalleryImage = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('galleryPreview').src = e.target.result;
            document.getElementById('galleryPreviewContainer').classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    }
};

window.deleteGalleryImage = async function(id) {
    if(confirm("Delete Image?")) {
        await fetch(`${API_BASE}/admin/gallery/${id}`, { method: "DELETE", headers: getAuthHeaders() });
        loadGallery();
    }
};