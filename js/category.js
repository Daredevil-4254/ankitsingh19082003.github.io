// js/category.js
const API_BASE = window.portfolioConfig.API_BASE;

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("type");

    const titles = {
        'research': 'Research Publications',
        'ai_ml': 'Deep Tech (AI/ML)',
        'iot': 'IoT & Hardware',
        'training': 'Workshops & Trainings',
        'consulting': 'Consulting Services',
        'misc': 'Other Projects'
    };

    const titleEl = document.getElementById('category-title');
    if (titleEl) titleEl.innerText = titles[slug] || 'Portfolio Archives';

    const container = document.getElementById("filtered-projects-container");

    try {
        const [projRes, highRes] = await Promise.all([
            fetch(`${API_BASE}/public/projects`),
            fetch(`${API_BASE}/public/highlights`)
        ]);

        const allProjects = await projRes.json();
        const allHighlights = await highRes.json();

        const filterBySlug = (item) => {
            if (!item.category) return false;
            const cat = item.category.toLowerCase();

            if (slug === 'research') return cat.includes('research') || cat.includes('paper');
            if (slug === 'ai_ml') return cat.includes('ai') || cat.includes('ml') || cat.includes('deep') || cat.includes('tech');
            if (slug === 'iot') return cat.includes('iot') || cat.includes('hardware') || cat.includes('arduino');
            if (slug === 'training') return cat.includes('workshop') || cat.includes('training');
            if (slug === 'consulting') return cat.includes('consulting');
            return true;
        };

        const filteredProjects = allProjects.filter(filterBySlug);
        const filteredHighlights = allHighlights.filter(filterBySlug);

        let htmlContent = "";

        // HELPER: Safe Image Function
        const getSafeImage = (img) => {
            return (img && img.trim() !== "") ? img : "images/bg_1.jpg"; // Default fallback
        };

        // 1. RENDER PROJECTS
        htmlContent += filteredProjects.map(p => `
            <div class="col-md-4 mb-4 ftco-animate fadeInUp ftco-animated">
               <div class="project-card shadow-sm rounded bg-white h-100 p-0" onclick="window.location.href='portfolio-detail.html?id=${p._id}'" style="cursor: pointer; overflow: hidden; border: 1px solid #eee;">
                   
                   <div style="height: 220px; overflow: hidden; position: relative; background-color: #f8f9fa;">
                       <div class="img-bg" style="height: 100%; width: 100%; background: url('${getSafeImage(p.image)}') center/cover no-repeat; transition: transform 0.3s;"></div>
                   </div>
                   
                   <div class="p-4 text-center">
                        <span class="d-block text-uppercase font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 2px; color: #b1b493;">
                            ${p.category || "Project"}
                        </span>
                        <h5 class="font-weight-bold text-dark mb-0" style="font-size: 18px;">
                            ${p.title}
                        </h5>
                   </div>
               </div>
           </div>
        `).join('');

        // 2. RENDER HIGHLIGHTS
        if (filteredHighlights.length > 0) {
            htmlContent += filteredHighlights.map(h => `
                 <div class="col-md-4 mb-4 ftco-animate fadeInUp ftco-animated">
                    <div class="project-card shadow-sm rounded bg-white h-100 p-0" onclick="window.location.href='highlight-details.html?id=${h._id}'" style="cursor: pointer; border-bottom: 4px solid #b1b493;">
                        <div style="height: 220px; overflow: hidden; position: relative;">
                            <div class="img-bg" style="height: 100%; width: 100%; background: url('${getSafeImage(h.image)}') center/cover;"></div>
                            <div style="position: absolute; top: 10px; right: 10px; background: #b1b493; color: #fff; padding: 2px 8px; font-size: 10px; font-weight: 700; border-radius: 4px;">EVENT</div>
                        </div>
                        
                        <div class="p-4 text-center">
                             <span class="d-block text-uppercase font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 2px; color: #666;">Highlight</span>
                             <h5 class="font-weight-bold text-dark mb-0" style="font-size: 18px;">${h.title}</h5>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (htmlContent === "") {
            container.innerHTML = `<div class="col-12 text-center py-5"><h4 class="text-muted font-weight-light">No items found.</h4></div>`;
        } else {
            container.innerHTML = htmlContent;
        }

    } catch (err) {
        console.error("Error:", err);
    }
});