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

        // Use innerHTML so the newly scraped rich content renders natively
        document.getElementById('display-content').innerHTML = project.content || project.description || "No description available.";

        // 2. Inject Background Image (With Fallback)
        const heroBg = document.getElementById('hero-bg');
        if (project.thumbnail && project.thumbnail.trim() !== "") {
            heroBg.style.backgroundImage = `url('${project.thumbnail}')`;
        } else if (project.image && project.image.trim() !== "") {
            heroBg.style.backgroundImage = `url('${project.image}')`;
        } else if (project.images && project.images.length > 0 && project.images[0].trim() !== "") {
            heroBg.style.backgroundImage = `url('${project.images[0]}')`;
        } else {
            heroBg.style.backgroundImage = `url('images/bg_1.jpg')`;
        }

        // 3. Inject Links from project.links
        const linksBox = document.getElementById('display-links');
        let buttons = '';

        if (project.links) {
            const { live, github, paper, video } = project.links;

            if (live && live.trim() !== "" && !live.includes('atuldubey.in/portfolio')) {
                buttons += `<a href="${live}" target="_blank" class="btn btn-primary btn-block py-3 font-weight-bold text-white shadow-sm mb-2" style="background: #b1b493; border: none;"><i class="fas fa-external-link-alt mr-2"></i>Live Demo</a>`;
            }
            if (github && github.trim() !== "") {
                buttons += `<a href="${github}" target="_blank" class="btn btn-dark btn-block py-3 font-weight-bold shadow-sm mb-2"><i class="fab fa-github mr-2"></i>Source Code</a>`;
            }
            if (paper && paper.trim() !== "") {
                buttons += `<a href="${paper}" target="_blank" class="btn btn-info btn-block py-3 font-weight-bold shadow-sm mb-2"><i class="fas fa-file-pdf mr-2"></i>Read Paper</a>`;
            }
            if (video && video.trim() !== "") {
                buttons += `<a href="${video}" target="_blank" class="btn btn-danger btn-block py-3 font-weight-bold shadow-sm mb-2"><i class="fab fa-youtube mr-2"></i>Watch Video</a>`;
            }
        }

        if (buttons !== '') {
            linksBox.innerHTML = buttons;
        } else {
            linksBox.innerHTML = `<button class="btn btn-light btn-block py-3 text-muted" disabled>No External Links</button>`;
        }

    } catch (err) {
        console.error("Load Error:", err);
        document.getElementById('display-title').innerText = "Error Loading";
    }
});