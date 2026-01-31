const API_BASE = window.portfolioConfig.API_BASE;

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("all-projects-container");

    try {
        const res = await fetch(`${API_BASE}/public/projects`);
        if (!res.ok) throw new Error("Connection failed");
        
        const projects = await res.json();

        if (projects.length > 0) {
            container.innerHTML = projects.map(p => `
                <div class="col-md-4 mb-5 ftco-animate fadeInUp ftco-animated">
                    <div class="project-card shadow-sm rounded bg-white h-100" style="border: 1px solid #eee; transition: 0.3s;">
                        <div style="height: 240px; background-image: url('${p.image || "images/default.webp"}'); background-size: cover; background-position: center; cursor: pointer;"
                             onclick="window.location.href='portfolio-detail.html?id=${p._id}'">
                        </div>
                        <div class="p-4 text-center">
                            <span style="color: #b1b493; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 2px;">${p.category}</span>
                            <h3 class="h5 font-weight-bold mt-2">
                                <a href="portfolio-detail.html?id=${p._id}" style="color: #000;">${p.title}</a>
                            </h3>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<div class="col-12 text-center py-5"><h3>No projects found in the archive.</h3></div>`;
        }
    } catch (err) {
        console.error("Archive Load Error:", err);
        container.innerHTML = `<div class="alert alert-danger mx-auto">Unable to reach the database. Check if your server is running.</div>`;
    }
});