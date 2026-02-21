// =========================================================
//  MASTER CMS CONTROLLER
//  Target: window.portfolioConfig.API_BASE
// =========================================================

const API_BASE = (window.portfolioConfig && window.portfolioConfig.API_BASE)
  ? window.portfolioConfig.API_BASE
  : (window.CONFIG ? window.CONFIG.API_BASE : ''); const TOKEN_KEY = "token"; // Unified token key

// --- 1. GLOBAL HELPERS -----------------------------------

// Authorization Header
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
});

// Generic Toast Notification
window.showToast = function (msg, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
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
        if (containerId)
          document
            .getElementById(containerId)
            .classList.remove("hidden", "d-none");
      };
      reader.readAsDataURL(file);
    }
  });
}

// --- 2. AUTHENTICATION -----------------------------------
(function checkAuth() {
  if (window.location.pathname.includes("login")) return;
  if (!localStorage.getItem(TOKEN_KEY)) window.location.href = "./login.html";
})();

window.logout = function () {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "login.html";
};
// --- 3. HIGHLIGHTS SECTION -------------------------------
let galleryFilesArray = [];

// Helper to render gallery previews with delete buttons
window.renderGalleryPreviews = function () {
  const container = document.getElementById("gallery-preview-container");
  if (!container) return;

  container.innerHTML = "";

  galleryFilesArray.forEach((imgSrc, index) => {
    const wrapper = document.createElement("div");
    wrapper.style =
      "position: relative; display: inline-block; margin-right: 10px; margin-bottom: 10px;";

    wrapper.innerHTML = `
      <img src="${imgSrc}" style="width:60px; height:60px; object-fit:cover; border-radius:4px; border: 1px solid #ddd;">
      <button type="button" onclick="removeGalleryImage(${index})" 
        style="position: absolute; top: -5px; right: -5px; background: #ff4d4d; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
        &times;
      </button>
    `;
    container.appendChild(wrapper);
  });

  if (galleryFilesArray.length > 0) {
    container.classList.remove("hidden");
  } else {
    container.classList.add("hidden");
  }
};

// Remove single image from local state
window.removeGalleryImage = function (index) {
  galleryFilesArray.splice(index, 1);
  renderGalleryPreviews();
};

// Quick tag helper
window.addTag = function (tag) {
  const input = document.getElementById("hlTags");
  let current = input.value.trim();
  if (current === "") {
    input.value = tag;
  } else {
    const tags = current.split(",").map((t) => t.trim());
    if (!tags.includes(tag)) {
      input.value = current + ", " + tag;
    }
  }
};

window.loadHighlights = async function () {
  const list = document.getElementById("highlights-list");
  if (!list) return;
  list.innerHTML = `<p class="placeholder-text">Searching for highlights...</p>`;

  try {
    const res = await fetch(`${API_BASE}/public/highlights`);
    const result = await res.json();
    const items = Array.isArray(result)
      ? result
      : result.data || result.highlights || [];

    if (items.length === 0) {
      list.innerHTML = `<p class="placeholder-text">No highlights found in database.</p>`;
      return;
    }

    list.innerHTML = items
      .map(
        (h) => `
        <div class="card p-3 mb-2 shadow-sm border-0">
            <div class="d-flex justify-content-between">
                <h5 class="fw-bold m-0">${h.title}</h5>
                <span class="badge bg-primary">${h.category || "Highlight"}</span>
            </div>
            <div class="text-muted small mt-1">${h.gallery ? h.gallery.length : 0} gallery images</div>
            <div class="d-flex gap-2 mt-2">
                <button onclick="editHighlight('${h._id}')" class="btn btn-sm btn-warning text-white">Edit</button>
                <button onclick="deleteHighlight('${h._id}')" class="btn btn-sm btn-outline-danger">Delete</button>
            </div>
        </div>`,
      )
      .join("");
  } catch (e) {
    console.error("Fetch Error:", e);
    list.innerHTML = `<p class="text-danger">Cannot connect to Server</p>`;
  }
};

window.editHighlight = async function (id) {
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
    document.getElementById("hlTags").value = item.tags
      ? Array.isArray(item.tags)
        ? item.tags.join(",")
        : item.tags
      : "";
    document.getElementById("highlight-link-input").value = item.link || "";
    if (item.eventDate)
      document.getElementById("hlDate").value = new Date(item.eventDate)
        .toISOString()
        .split("T")[0];

    if (item.image) {
      document.getElementById("poster-hidden-value").value = item.image;
      document.getElementById("poster-preview-img").src = item.image;
      document
        .getElementById("poster-preview-container")
        .classList.remove("hidden");
    }

    // Load existing gallery into state and render
    galleryFilesArray =
      item.gallery && Array.isArray(item.gallery) ? [...item.gallery] : [];
    renderGalleryPreviews();

    document
      .getElementById("highlightForm")
      .scrollIntoView({ behavior: "smooth" });
    window.showToast("Loaded entry details", "info");
  } catch (e) {
    window.showToast("Error loading entry", "danger");
  }
};

window.deleteHighlight = async function (id) {
  if (!confirm("Delete this highlight?")) return;
  await fetch(`${API_BASE}/admin/highlights/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  loadHighlights();
};

const hlForm = document.getElementById("highlightForm");
if (hlForm) {
  setupImagePreview(
    "poster-upload-input",
    "poster-hidden-value",
    "poster-preview-img",
    "poster-preview-container",
  );

  document
    .getElementById("gallery-upload-input")
    .addEventListener("change", (e) => {
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          galleryFilesArray.push(evt.target.result);
          renderGalleryPreviews();
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
      gallery: galleryFilesArray,
    };

    const url = id
      ? `${API_BASE}/admin/highlights/${id}`
      : `${API_BASE}/admin/highlights`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        window.showToast("Highlight Saved", "success");
        hlForm.reset();
        galleryFilesArray = [];
        document.getElementById("gallery-preview-container").innerHTML = "";
        document
          .getElementById("poster-preview-container")
          .classList.add("hidden");
        document.getElementById("hlId").value = "";
        loadHighlights();
      } else {
        window.showToast("Save Failed", "danger");
      }
    } catch (err) {
      window.showToast("Network Error", "danger");
    }
  });
}

// ==========================================
// 4. PROJECTS SECTION
// ==========================================
window.loadProjects = async function () {
  const list = document.getElementById("projectsList");
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/public/projects`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];

    list.innerHTML = items
      .map(
        (p) => `
            <div class="card p-3 mb-3 shadow-sm border-0">
                <div class="d-flex align-items-center gap-3">
                    <img src="${p.image || p.thumbnail || ""}" style="width:60px; height:60px; object-fit:cover; border-radius:5px; background:#eee;">
                    <div class="flex-grow-1">
                        <h5 class="m-0 fw-bold">${p.title}</h5>
                        <small class="text-muted">${p.category}</small>
                    </div>
                    <div>
                         <button onclick="editProject('${p._id}')" class="btn btn-sm btn-warning text-white">Edit</button>
                         <button onclick="deleteProject('${p._id}')" class="btn btn-sm btn-outline-danger">Del</button>
                    </div>
                </div>
            </div>`,
      )
      .join("");
  } catch (e) {
    list.innerHTML = `<p class="text-danger">Error loading projects</p>`;
  }
};

window.editProject = async function (id) {
  try {
    const res = await fetch(`${API_BASE}/public/projects/${id}`);
    const data = await res.json();
    const item = data.data || data;

    document.getElementById("pId").value = item._id;
    document.getElementById("pTitle").value = item.title || "";
    document.getElementById("pSummary").value = item.summary || "";
    document.getElementById("pDescription").value = item.description || "";
    document.getElementById("pLink").value = item.link || "";
    document.getElementById("pImage").value = item.image || "";

    // Sync character counter after loading data
    const projectInput = document.getElementById("pDescription");
    if (projectInput) {
      projectInput.dispatchEvent(new Event("input"));
    }

    const catSelect = document.getElementById("pCategory");
    if (catSelect && item.category) {
      const match = [...catSelect.options].find(
        (opt) => opt.value.toLowerCase() === item.category.toLowerCase(),
      );
      if (match) catSelect.value = match.value;
    }

    document.getElementById("pTech").value = Array.isArray(item.technologies)
      ? item.technologies.join(", ")
      : item.technologies || "";

    const submitBtn = document.querySelector(
      "#projectForm button[type='submit']",
    );
    if (submitBtn) {
      submitBtn.innerHTML = `<i class="fas fa-edit me-2"></i> Update Project`;
      submitBtn.classList.replace("btn-primary", "btn-warning");
    }

    document
      .getElementById("projectForm")
      .scrollIntoView({ behavior: "smooth" });
    window.showToast("Project details loaded", "info");
  } catch (error) {
    window.showToast("Failed to load project details", "danger");
  }
};

window.deleteProject = async function (id) {
  if (!confirm("Permanently delete this project?")) return;

  try {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (res.ok) {
      window.showToast("Project deleted", "warning");
      loadProjects();
    }
  } catch (error) {
    window.showToast("Error during deletion", "danger");
  }
};

const projForm = document.getElementById("projectForm");
if (projForm) {
  setupImagePreview("pThumbnail", "pImage", null, null);

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
      image: document.getElementById("pImage").value,
    };

    const url = id
      ? `${API_BASE}/admin/projects/${id}`
      : `${API_BASE}/admin/projects`;
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      window.showToast("Project Saved", "success");
      projForm.reset();
      document.getElementById("pId").value = "";

      // Reset counter text
      const projectCharCounter = document.getElementById("project-char-count");
      if (projectCharCounter) projectCharCounter.textContent = "0 / 5000";

      loadProjects();
    }
  });
}
// ==========================================
// 5. STATS SECTION (Clean & Polished)
// ==========================================

window.toggleCustomStatInput = function () {
  const dropdown = document.getElementById("statLabelDropdown");
  const customGroup = document.getElementById("customStatGroup");
  if (dropdown && customGroup) {
    if (dropdown.value === "CUSTOM") {
      customGroup.classList.remove("hidden");
    } else {
      customGroup.classList.add("hidden");
      document.getElementById("statLabelCustom").value = "";
    }
  }
};

window.loadStats = async function () {
  const list = document.getElementById("statsList");
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/public/stats`);
    const data = await res.json();
    let items = Array.isArray(data) ? data : data.data || [];

    // Deduplication logic using lowercased keys to prevent repetition
    const uniqueMap = {};
    items.forEach((s) => {
      // Trim and lowercase the label to catch duplicates like "PROJECTS" and "projects"
      const normalizedLabel = s.label.trim().toLowerCase();
      uniqueMap[normalizedLabel] = s;
    });

    // Convert map back to array and reverse to show most recent at the top
    const finalItems = Object.values(uniqueMap).reverse();

    list.innerHTML = finalItems
      .map(
        (s) => `
            <div class="card p-3 mb-2 shadow-sm border-0 d-flex flex-row align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                     <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style="width:35px; height:35px; flex-shrink:0;">
                       <i class="fa ${s.icon || 'fa-bar-chart'}" style="color:#fff; font-size:14px;"></i>
                     </div>
                     <div>
                         <h5 class="mb-0 text-primary fw-bold">${s.value}</h5>
                         <small class="text-uppercase text-muted fw-bold" style="font-size: 0.7rem;">${s.label}</small>
                     </div>
                </div>
                <div class="d-flex gap-2">
                    <button onclick="editStat('${s._id}')" class="btn btn-sm btn-outline-warning" title="Edit"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteStat('${s._id}')" class="btn btn-sm btn-outline-danger" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `,
      )
      .join("");
  } catch (e) {
    list.innerHTML = `<p class="text-danger">Error loading stats.</p>`;
  }
};

window.editStat = async function (id) {
  try {
    const res = await fetch(`${API_BASE}/public/stats`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];
    const item = items.find((s) => s._id === id);

    if (!item) throw new Error("Stat not found");

    document.getElementById("statId").value = item._id;
    document.getElementById("statValue").value = item.value || "";

    const dropdown = document.getElementById("statLabelDropdown");
    const customInput = document.getElementById("statLabelCustom");
    const customGroup = document.getElementById("customStatGroup");

    const isStandard = Array.from(dropdown.options).some(
      (opt) => opt.value === item.label,
    );

    if (isStandard) {
      dropdown.value = item.label;
      customGroup.classList.add("hidden");
    } else {
      dropdown.value = "CUSTOM";
      customInput.value = item.label;
      customGroup.classList.remove("hidden");
    }

    const previewImg = document.getElementById("statPreviewImg");
    const previewContainer = document.getElementById("statImgPreview");
    const iconValueField = document.getElementById("statIconValue");

    if (item.icon) {
      iconValueField.value = item.icon;
      previewImg.src = item.icon;
      previewContainer.classList.remove("hidden");
    } else {
      iconValueField.value = "";
      previewImg.src = "";
      previewContainer.classList.add("hidden");
    }

    document.getElementById("statIconInput").value = "";

    const btn = document.getElementById("statSubmitBtn");
    if (btn) {
      btn.innerText = "Update Stat";
      btn.classList.replace("btn-primary", "btn-warning");
    }

    document.getElementById("statsForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    window.showToast("Error loading stat details", "danger");
  }
};

window.deleteStat = async function (id) {
  if (!confirm("Permanently delete this stat?")) return;
  try {
    const res = await fetch(`${API_BASE}/admin/stats/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      window.showToast("Stat Deleted", "warning");
      loadStats();
    }
  } catch (e) {
    window.showToast("Error during deletion", "danger");
  }
};

const statForm = document.getElementById("statsForm");
if (statForm) {
  // Sync Icon Input with Hidden Value and Preview
  document.getElementById("statIconInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        document.getElementById("statIconValue").value = evt.target.result;
        document.getElementById("statPreviewImg").src = evt.target.result;
        document.getElementById("statImgPreview").classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  });

  statForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("statId").value;
    const dropdownValue = document.getElementById("statLabelDropdown").value;
    const finalLabel =
      dropdownValue === "CUSTOM"
        ? document.getElementById("statLabelCustom").value
        : dropdownValue;

    const payload = {
      value: document.getElementById("statValue").value,
      label: finalLabel,
      icon: document.getElementById("statIconValue").value,
    };

    const url = id
      ? `${API_BASE}/admin/stats/${id}`
      : `${API_BASE}/admin/stats`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.showToast(id ? "Stat Updated" : "Stat Added", "success");
        statForm.reset();
        document.getElementById("statId").value = "";
        document.getElementById("statIconValue").value = "";
        document.getElementById("customStatGroup").classList.add("hidden");
        document.getElementById("statImgPreview").classList.add("hidden");

        const btn = document.getElementById("statSubmitBtn");
        if (btn) {
          btn.innerText = "Add Stat";
          btn.classList.replace("btn-warning", "btn-primary");
        }
        loadStats();
      }
    } catch (e) {
      window.showToast("Network Error", "danger");
    }
  });
}

// --- Hero Section Logic ---
window.loadHero = async function () {
  try {
    const res = await fetch(`${API_BASE}/public/hero`);
    if (!res.ok) return;

    const data = await res.json();
    const hero = Array.isArray(data) ? data[0] : data;
    if (!hero) return;

    document.getElementById("hGreeting").value = hero.greeting || "";
    document.getElementById("hName").value = hero.name || "";
    document.getElementById("hSubtitle").value = hero.subtitle || "";
    document.getElementById("hResume").value = hero.resumeLink || "";
    document.getElementById("hDesc").value = hero.description || "";

    if (hero.socialLinks) {
      document.getElementById("hLinkedin").value =
        hero.socialLinks.linkedin || "";
      document.getElementById("hGithub").value = hero.socialLinks.github || "";
    }

    if (hero.image) {
      document.getElementById("hImageBase64").value = hero.image;
      const preview = document.getElementById("hPreviewImg");
      const previewContainer = document.getElementById("heroImgPreview");
      if (preview && previewContainer) {
        preview.src = hero.image;
        previewContainer.classList.remove("hidden");
      }
    }

    // Manually trigger counter update after loading data
    const bioInput = document.getElementById("hDesc");
    if (bioInput) bioInput.dispatchEvent(new Event("input"));
  } catch (e) {
    console.error("Hero Load Error:", e);
  }
};

// Form Submission and Preview Initialization
const heroForm = document.getElementById("heroForm");
if (heroForm) {
  setupImagePreview(
    "hImageInput",
    "hImageBase64",
    "hPreviewImg",
    "heroImgPreview",
  );

  // Character counter for Professional Bio
  const bioInput = document.getElementById("hDesc");
  const bioCounter = document.getElementById("hero-bio-count");
  if (bioInput && bioCounter) {
    bioInput.addEventListener("input", () => {
      const len = bioInput.value.length;
      bioCounter.textContent = `${len} / 1000`;
      bioCounter.className =
        len > 900
          ? "badge bg-danger text-white"
          : "badge bg-light text-muted border";
    });
  }

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
        github: document.getElementById("hGithub").value,
      },
    };

    try {
      const res = await fetch(`${API_BASE}/admin/hero`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.showToast("Profile Identity Published", "success");
        loadHero();
      } else {
        window.showToast("Failed to save profile", "danger");
      }
    } catch (e) {
      window.showToast("Server Connection Error", "danger");
    }
  });
}

// ==========================================
// 7. SKILLS SECTION (Add, Edit, Delete)
// ==========================================

// 1. Load Skills List
window.loadSkills = async function () {
  const list = document.getElementById("skillsList");
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/public/skills`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];

    // Render list with EDIT and DELETE buttons
    list.innerHTML = items
      .map(
        (s) => `
        <div class="col-md-6">
            <div class="card p-3 shadow-sm border-0 h-100">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-3">
                        ${s.icon
            ? `<img src="${s.icon.startsWith('http') || s.icon.startsWith('data:') ? s.icon : '../' + s.icon}" style="width:40px; height:40px; object-fit:contain;">`
            : '<div class="bg-light rounded p-2"><i class="fas fa-code"></i></div>'
          }
                        <div>
                            <h6 class="fw-bold mb-0 text-dark">${s.title}</h6>
                            <small class="text-muted">${s.description}</small>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button onclick="editSkill('${s._id
          }')" class="btn btn-sm btn-outline-warning"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteSkill('${s._id
          }')" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `,
      )
      .join("");
  } catch (e) {
    console.error(e);
    list.innerHTML = `<p class="text-danger">Failed to load skills.</p>`;
  }
};

// 2. Edit Skill (Populate Form)
window.editSkill = async function (id) {
  try {
    const res = await fetch(`${API_BASE}/public/skills`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];
    const item = items.find((s) => s._id === id);

    if (!item) return;

    // Fill Inputs
    document.getElementById("skillId").value = item._id;
    document.getElementById("skTitle").value = item.title || "";
    document.getElementById("skDesc").value = item.description || "";

    // Handle Images
    document.getElementById("originalSkIconBase64").value = item.icon || "";

    if (item.icon) {
      const iconSrc = item.icon.startsWith('http') || item.icon.startsWith('data:') ? item.icon : '../' + item.icon;
      document.getElementById("skPreviewImg").src = iconSrc;
      document.getElementById("skImgPreview").classList.remove("hidden");
    } else {
      document.getElementById("skImgPreview").classList.add("hidden");
    }

    // Update Button UI
    const btn = document.getElementById("skillSubmitBtn");
    btn.innerHTML = `<i class="fas fa-save me-1"></i> Update Skill`;
    btn.classList.replace("btn-primary", "btn-warning");

    document.getElementById("skillForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    window.showToast("Error loading skill", "danger");
  }
};

// 3. Delete Skill
window.deleteSkill = async function (id) {
  if (confirm("Are you sure you want to delete this skill?")) {
    try {
      await fetch(`${API_BASE}/admin/skills/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      window.showToast("Skill deleted", "warning");
      loadSkills();
    } catch (e) {
      window.showToast("Delete failed", "danger");
    }
  }
};

// 4. Form Submission (Create or Update)
const skillForm = document.getElementById("skillForm");
if (skillForm) {
  // Initialize Image Preview
  setupImagePreview(
    "skIconInput",
    "skIconBase64",
    "skPreviewImg",
    "skImgPreview",
  );

  skillForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("skillId").value;
    const isEdit = !!id;

    // Image Logic: New Upload > Original > None
    const newIcon = document.getElementById("skIconBase64").value;
    const originalIcon = document.getElementById("originalSkIconBase64").value;
    const finalIcon = newIcon || originalIcon;

    const payload = {
      title: document.getElementById("skTitle").value,
      description: document.getElementById("skDesc").value,
      icon: finalIcon,
    };

    const url = isEdit
      ? `${API_BASE}/admin/skills/${id}`
      : `${API_BASE}/admin/skills`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.showToast(isEdit ? "Skill Updated!" : "Skill Added!", "success");
        skillForm.reset();

        // Reset State
        document.getElementById("skillId").value = "";
        document.getElementById("originalSkIconBase64").value = "";
        document.getElementById("skIconBase64").value = "";
        document.getElementById("skImgPreview").classList.add("hidden");

        // Reset Button
        const btn = document.getElementById("skillSubmitBtn");
        btn.innerHTML = `<i class="fas fa-plus-circle me-1"></i> Add Skill`;
        btn.classList.replace("btn-warning", "btn-primary");

        loadSkills();
      }
    } catch (e) {
      window.showToast("Operation failed", "danger");
    }
  });
}

// ==========================================
// 8. VIDEOS SECTION (Robust & Crash-Proof)
// ==========================================

// 1. Load Videos (Safely)
window.loadVideos = async function () {
  const list = document.getElementById("videosList");
  if (!list) return;

  try {
    list.innerHTML = '<p class="text-muted">Refreshing list...</p>'; // User feedback

    const res = await fetch(`${API_BASE}/public/videos`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];

    if (items.length === 0) {
      list.innerHTML =
        '<p class="text-muted">No videos found. Add one above!</p>';
      return;
    }

    list.innerHTML = items
      .map((v) => {
        // --- SAFE THUMBNAIL LOGIC ---
        let thumbUrl = "https://via.placeholder.com/120x90?text=No+Video";
        try {
          if (v.url) {
            let videoId = null;
            // Method A: Standard URL (youtube.com/watch?v=XYZ)
            if (v.url.includes("v=")) {
              videoId = v.url.split("v=")[1].split("&")[0];
            }
            // Method B: Short URL (youtu.be/XYZ)
            else if (v.url.includes("youtu.be/")) {
              videoId = v.url.split("youtu.be/")[1].split("?")[0];
            }
            // Method C: Embed URL (youtube.com/embed/XYZ)
            else if (v.url.includes("/embed/")) {
              videoId = v.url.split("/embed/")[1].split("?")[0];
            }

            if (videoId && videoId.length === 11) {
              thumbUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            }
          }
        } catch (err) {
          console.warn("Could not generate thumbnail for:", v.title);
        }

        return `
        <div class="card p-3 shadow-sm border-0 mb-2">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                    <div class="position-relative rounded overflow-hidden bg-light" style="width: 120px; height: 68px; flex-shrink: 0;">
                        <img src="${thumbUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/120x90?text=Error'">
                    </div>
                    
                    <div style="min-width: 0;"> <h6 class="fw-bold mb-1 text-dark text-truncate">${v.title || "Untitled Video"}</h6>
                        <small class="text-muted d-block text-truncate">${v.url || "No URL"}</small>
                    </div>
                </div>
                
                <div class="d-flex gap-2 ms-2">
                    <button onclick="editVideo('${v._id}')" class="btn btn-sm btn-outline-warning" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteVideo('${v._id}')" class="btn btn-sm btn-outline-danger" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
      })
      .join("");
  } catch (e) {
    console.error("Critical Render Error:", e);
    list.innerHTML = `<p class="text-danger">Error loading videos. Check console.</p>`;
  }
};

// 2. Edit Video (Prepares the form)
window.editVideo = async function (id) {
  try {
    const res = await fetch(`${API_BASE}/public/videos`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];
    const item = items.find((v) => v._id === id);

    if (!item) return;

    // Fill Form
    document.getElementById("videoId").value = item._id;
    document.getElementById("vidTitle").value = item.title || "";
    document.getElementById("vidUrl").value = item.url || "";
    document.getElementById("vidDesc").value = item.description || "";

    // Switch Button to Update Mode
    const btn = document.getElementById("videoSubmitBtn");
    if (btn) {
      btn.innerHTML = `<i class="fas fa-save me-2"></i> Update Video`;
      btn.classList.replace("btn-primary", "btn-warning");
    }

    document.getElementById("videoForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    window.showToast("Error loading video details", "danger");
  }
};

// 3. Delete Video
window.deleteVideo = async function (id) {
  if (confirm("Delete this video?")) {
    try {
      await fetch(`${API_BASE}/admin/videos/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      window.showToast("Video Deleted", "warning");
      loadVideos();
    } catch (e) {
      window.showToast("Delete failed", "danger");
    }
  }
};

// admin.js
const videoForm = document.getElementById("videoForm");
if (videoForm) {
  const newForm = videoForm.cloneNode(true);
  videoForm.parentNode.replaceChild(newForm, videoForm);

  newForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("videoId").value;
    const isEdit = !!id;

    const payload = {
      title: document.getElementById("vidTitle").value,
      url: document.getElementById("vidUrl").value,
      description: document.getElementById("vidDesc").value,
    };

    // Construct the correct URL and Method
    const url = isEdit
      ? `${API_BASE}/admin/videos/${id}`
      : `${API_BASE}/admin/videos`;
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.showToast(isEdit ? "Video Updated!" : "Video Added!", "success");
        newForm.reset();
        document.getElementById("videoId").value = "";

        // Reset Button to "Add" state
        const btn = document.getElementById("videoSubmitBtn");
        if (btn) {
          btn.innerHTML = `<i class="fas fa-video me-2"></i> Add Video`;
          btn.classList.replace("btn-warning", "btn-primary");
        }
        loadVideos();
      } else {
        const errorData = await res.json();
        window.showToast(
          `Error: ${errorData.message || "Server Error"}`,
          "danger",
        );
      }
    } catch (e) {
      console.error("Network Error Details:", e);
      window.showToast("Network Error: Check if Backend is running", "danger");
    }
  });
}

/// ==========================================
// 9. GALLERY SECTION (Robust Grid & Batch)
// ==========================================

// 1. DATA LOADING (READ)
window.loadGallery = async function () {
  const list = document.getElementById("galleryList");
  if (!list) return;

  list.innerHTML = '<div class="text-center w-100 py-5"><div class="spinner-border text-primary"></div></div>';

  try {
    const res = await fetch(`${API_BASE}/public/gallery?t=${new Date().getTime()}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];

    if (items.length === 0) {
      list.innerHTML = '<p class="text-center w-100 text-muted py-5">No images found.</p>';
      return;
    }

    // Generate the cards directly as children of the grid container
    list.innerHTML = items.map((g) => `
        <div class="gallery-card shadow-sm">
            <div style="height: 180px; overflow: hidden; background: #f8f9fa;">
                <img src="${g.image}" alt="${g.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="card-body p-3 d-flex flex-column" style="flex: 1;">
                <h6 class="text-truncate mb-3 fw-bold" title="${g.title || ''}">${g.title || "Untitled"}</h6>
                <div class="d-flex gap-2 mt-auto">
                    <button onclick="window.prepareEditGallery('${g._id}')" class="btn btn-sm btn-warning flex-grow-1 text-white">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="window.deleteGalleryImage('${g._id}')" class="btn btn-sm btn-danger flex-grow-1">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>`).join("");

  } catch (e) {
    console.error("Gallery Sync Error:", e);
    list.innerHTML = '<div class="text-center w-100 text-danger py-5">Failed to load images.</div>';
  }
};
// 2. EDIT MODE PREP
window.prepareEditGallery = async function (id) {
  try {
    const res = await fetch(
      `${API_BASE}/public/gallery?t=${new Date().getTime()}`,
    );
    const items = await res.json();
    const item = items.find((g) => g._id === id);

    if (!item) return;

    document.getElementById("galId").value = item._id;
    document.getElementById("galCaption").value = item.title || "";
    document.getElementById("galImageBase64").value = item.image;

    const previewContainer = document.getElementById("galImgPreview");
    previewContainer.innerHTML = `
      <div class="d-inline-block position-relative m-2">
        <img src="${item.image}" style="height: 120px; width: 120px; object-fit: cover; border-radius: 8px; border: 2px solid #b1b493;">
        <span class="badge bg-warning text-dark position-absolute top-0 start-100 translate-middle shadow-sm">Editing</span>
      </div>`;
    previewContainer.classList.remove("hidden");

    const btn = document.getElementById("gallerySubmitBtn");
    btn.innerHTML = `<i class="fas fa-save me-2"></i> Update Image`;
    btn.classList.replace("btn-primary", "btn-warning");

    document
      .getElementById("galleryForm")
      .scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    window.showToast("Error preparing edit", "danger");
  }
};

// 3. DELETE LOGIC
window.deleteGalleryImage = async function (id) {
  if (!confirm("Are you sure you want to delete this image?")) return;
  try {
    const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      window.showToast("Image deleted", "success");
      await window.loadGallery();
    }
  } catch (e) {
    window.showToast("Network Error", "danger");
  }
};

// 4. FILE SELECTION PREVIEW (Batch Support)
function handleGalleryImageChange(e) {
  const files = Array.from(e.target.files);
  const previewContainer = document.getElementById("galImgPreview");

  previewContainer.innerHTML = "";
  previewContainer.classList.remove("hidden");
  window.galleryBatchBase64 = [];

  if (files.length === 0) {
    previewContainer.classList.add("hidden");
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      window.galleryBatchBase64.push(event.target.result);
      const div = document.createElement("div");
      div.className = "d-inline-block position-relative m-1";
      div.innerHTML = `
        <img src="${event.target.result}" 
             style="height: 80px; width: 80px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #ddd;">`;
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// 5. SUBMIT HANDLER
async function handleGallerySubmit(e) {
  e.preventDefault();

  const btn = document.getElementById("gallerySubmitBtn");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Processing...`;

  const id = document.getElementById("galId").value;
  const isEdit = !!id;

  const payload = {
    title: document.getElementById("galCaption").value,
    images: !isEdit ? window.galleryBatchBase64 : null,
    image: isEdit
      ? window.galleryBatchBase64?.[0] ||
      document.getElementById("galImageBase64").value
      : null,
  };

  if (!isEdit && (!payload.images || payload.images.length === 0)) {
    window.showToast("Please select at least one image.", "warning");
    btn.disabled = false;
    btn.innerHTML = originalText;
    return;
  }

  const url = isEdit
    ? `${API_BASE}/admin/gallery/${id}`
    : `${API_BASE}/admin/gallery`;
  const method = isEdit ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      window.showToast(
        isEdit ? "Updated Successfully!" : "Uploaded Successfully!",
        "success",
      );

      document.getElementById("galleryForm").reset();
      document.getElementById("galId").value = "";
      document.getElementById("galImgPreview").innerHTML = "";
      document.getElementById("galImgPreview").classList.add("hidden");
      window.galleryBatchBase64 = [];

      btn.innerHTML = `<i class="fas fa-cloud-upload-alt me-2"></i> Confirm Upload to Gallery`;
      btn.classList.replace("btn-warning", "btn-primary");

      await window.loadGallery();
    }
  } catch (e) {
    window.showToast("Network Error", "danger");
  } finally {
    btn.disabled = false;
    if (btn.innerHTML.includes("Processing")) btn.innerHTML = originalText;
  }
}

// Attach Listeners
const gForm = document.getElementById("galleryForm");
if (gForm) gForm.onsubmit = handleGallerySubmit;

const gInput = document.getElementById("galImageInput");
if (gInput) gInput.onchange = handleGalleryImageChange;
// ==========================================
// 10. BLOG SECTION (Admin Logic)
// ==========================================

window.loadBlogs = async function () {
  const list = document.getElementById("blogsList");
  if (!list) return;

  list.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

  try {
    const res = await fetch(`${API_BASE}/public/blogs?t=${new Date().getTime()}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];

    if (items.length === 0) {
      list.innerHTML = '<p class="text-center py-5 text-muted">No blog posts found.</p>';
      return;
    }

    list.innerHTML = `<div class="row g-3">` + items.map(b => `
      <div class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100 border-0 shadow-sm">
          <img src="${b.image}" class="card-img-top" style="height: 150px; object-fit: cover;">
          <div class="card-body p-3">
            <h6 class="fw-bold text-truncate">${b.title}</h6>
            <p class="small text-muted mb-3">${b.category || 'Uncategorized'}</p>
            <div class="d-flex gap-2">
              <button onclick="window.prepareEditBlog('${b._id}')" class="btn btn-sm btn-warning flex-grow-1 text-white">
                <i class="fas fa-edit"></i>
              </button>
              <button onclick="window.deleteBlog('${b._id}')" class="btn btn-sm btn-danger flex-grow-1">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`).join("") + `</div>`;
  } catch (e) {
    list.innerHTML = '<p class="text-danger">Failed to sync blogs.</p>';
  }
};

// Handle Blog Image Preview
const blogInput = document.getElementById("blogImageInput");
if (blogInput) {
  blogInput.onchange = function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById("blogImageBase64").value = event.target.result;
      const preview = document.getElementById("blogImgPreview");
      preview.innerHTML = `<img src="${event.target.result}" class="img-fluid rounded" style="max-height: 150px;">`;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  };
}

// Submit Logic
const bForm = document.getElementById("blogForm");
if (bForm) {
  bForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("blogId").value;
    const isEdit = !!id;

    const payload = {
      title: document.getElementById("blogTitle").value,
      category: document.getElementById("blogCategory").value,
      description: document.getElementById("blogDesc").value,
      image: document.getElementById("blogImageBase64").value
    };

    const url = isEdit ? `${API_BASE}/admin/blogs/${id}` : `${API_BASE}/admin/blogs`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        window.showToast("Blog synced!", "success");
        bForm.reset();
        document.getElementById("blogImgPreview").classList.add("hidden");
        window.loadBlogs();
      }
    } catch (e) { window.showToast("Sync failed", "danger"); }
  };
}


// ==========================================
// 11. NAVIGATION & INITIALIZATION
// ==========================================

window.showPage = function (pageId, btn) {
  // 1. Hide all sections
  document
    .querySelectorAll(".page-section")
    .forEach((el) => el.classList.add("hidden"));

  // 2. Show target section (Handles 'id' or 'idPage' naming)
  const target =
    document.getElementById(pageId) || document.getElementById(pageId + "Page");
  if (target) target.classList.remove("hidden");

  // 3. Update Sidebar Active State
  document
    .querySelectorAll(".nav-btn")
    .forEach((el) => el.classList.remove("active"));
  if (btn) btn.classList.add("active");

  // 4. Load Data based on the pageId
  // Added 'blog' check to trigger the blog list sync
  const pid = pageId.toLowerCase();
  if (pid.includes("highlights")) loadHighlights();
  if (pid.includes("projects")) loadProjects();
  if (pid.includes("stats")) loadStats();
  if (pid.includes("hero")) loadHero();
  if (pid.includes("skills")) loadSkills();
  if (pid.includes("videos")) loadVideos();
  if (pid.includes("gallery")) loadGallery();
  if (pid.includes("blog")) loadBlogs(); // New Trigger
};

/// --- INITIALIZE ON STARTUP ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("CMS Powerhouse Initialized...");

  // Auto-select the first tab
  const firstTab = document.querySelector(".nav-btn");
  if (firstTab) showPage("highlightsPage", firstTab);

  // Helper function to handle character counters
  const setupCounter = (inputId, counterId, max) => {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    if (!input || !counter) return;

    input.addEventListener("input", () => {
      const len = input.value.length;
      counter.textContent = `${len} / ${max}`;

      // Color coding logic
      if (len >= max * 0.95) counter.className = "badge bg-danger text-white";
      else if (len >= max * 0.75) counter.className = "badge bg-warning text-dark";
      else counter.className = "badge bg-light text-muted border";
    });
  };

  // 1. Highlights (2000 chars)
  setupCounter("hlDesc", "char-count", 2000);

  // 2. Projects (5000 chars)
  setupCounter("pDescription", "project-char-count", 5000);

  // 3. Project Short Summary (300 chars)
  setupCounter("pSummary", "short-summary-count", 300);

  // 4. Blog Summary (Optional - if you added a counter for it)
  setupCounter("blogDesc", "blog-char-count", 1000);
});
// --- LOGOUT FUNCTIONALITY ---
window.handleLogout = function () {
  if (confirm("Are you sure you want to logout from Atul's CMS?")) {
    // 1. Clear the Auth Token
    localStorage.removeItem("token");

    // 2. Show a quick confirmation toast if your system uses them
    if (window.showToast) window.showToast("Logged out successfully", "info");

    // 3. Redirect to login page
    setTimeout(() => {
      window.location.href = "login.html"; // Ensure this matches your login filename
    }, 500);
  }
};