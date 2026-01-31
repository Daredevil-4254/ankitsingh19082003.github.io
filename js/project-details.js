const API_BASE = window.portfolioConfig.API_BASE;

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/public/projects`);
        const projects = await res.json();
        
        // Find the project
        const project = projects.find(p => String(p._id) === String(id));

        if (!project) {
            document.getElementById('display-title').innerText = "Project Not Found";
            document.getElementById('display-content').innerText = "We couldn't locate this project in the database.";
            return;
        }

        // 1. Inject Text
        document.getElementById('display-title').innerText = project.title;
        document.getElementById('display-category').innerText = project.category || "Portfolio";
        document.getElementById('meta-type').innerText = project.category;
        document.getElementById('display-content').innerText = project.content || project.description || "No description available.";

        // 2. Inject Background Image (With Fallback)
        const heroBg = document.getElementById('hero-bg');
        if (project.image && project.image !== "") {
            heroBg.style.backgroundImage = `url('${project.image}')`;
        } else {
            //  FORCE DEFAULT IMAGE IF MISSING
            heroBg.style.backgroundImage = `url('images/bg_1.jpg')`; 
        }

        // 3. Inject Links
        const linksBox = document.getElementById('display-links');
        if (project.link) {
            linksBox.innerHTML = `
                <a href="${project.link}" target="_blank" class="btn btn-primary btn-block py-3 font-weight-bold text-white shadow-sm" style="background: #b1b493; border: none;">
                    <i class="fas fa-external-link-alt mr-2"></i>View Live Project
                </a>`;
        } else {
            linksBox.innerHTML = `<button class="btn btn-light btn-block py-3 text-muted" disabled>No External Link</button>`;
        }

    } catch (err) {
        console.error("Load Error:", err);
        document.getElementById('display-title').innerText = "Error Loading";
    }
});