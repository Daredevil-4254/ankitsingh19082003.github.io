document.addEventListener("DOMContentLoaded", async () => {
    const API_BASE = window.portfolioConfig.API_BASE;
    const API_URL = `${API_BASE}/public/highlights`;
    const container = document.getElementById("highlights-container");
    // This targets the specific "Highlights" text block in your index.html
    const staticHeader = document.querySelector("#highlights-section .heading-section");

    if (!container) return;

    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        let projects = Array.isArray(json) ? json : (json.data || []);

        // URL Filter Check
        const urlParams = new URLSearchParams(window.location.search);
        const tagFilter = urlParams.get('tag');

        if (tagFilter) {
            // 1. Hide the Static Header "Highlights / Recent activities"
            if (staticHeader) staticHeader.style.display = 'none';

            // 2. Filter Projects
            projects = projects.filter(p =>
                p.tags && p.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase())
            );

            // 3. Insert Dynamic Header (Replaces Static one)
            const existingDynamicHeader = document.getElementById("dynamic-filter-header");
            if (!existingDynamicHeader) {
                const filterHeader = document.createElement("div");
                filterHeader.id = "dynamic-filter-header";
                filterHeader.className = "col-12 text-center mb-5";
                filterHeader.innerHTML = `
                    <h2 class="mb-3">Projects tagged: <span class="text-primary">#${tagFilter}</span></h2>
                    <a href="index.html#highlights-section" class="btn btn-outline-secondary btn-sm rounded-pill px-4">Clear Filter</a>
                `;
                container.parentNode.insertBefore(filterHeader, container);
            }

            setTimeout(() => {
                document.getElementById('highlights-section').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }

        // RENDER CARDS
        if (projects.length > 0) {
            container.innerHTML = projects.map(project => {
                const dateObj = new Date(project.eventDate);
                const day = dateObj.getDate();
                const month = dateObj.toLocaleString('default', { month: 'short' });
                const year = dateObj.getFullYear();
                const imgUrl = (project.image && project.image.trim() !== "") ? project.image : 'images/bg_1.jpg';
                const mainTag = (project.tags && project.tags.length > 0) ? project.tags[0] : 'Project';

                // Helper to safely strip HTML tags from scraped DB content
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = project.content || project.description || "";
                const plainText = tempDiv.textContent || tempDiv.innerText || "";
                const safeSnippet = plainText.length > 100 ? plainText.substring(0, 100) + "..." : plainText;

                return `
                <div class="col-md-4 d-flex ftco-animate fadeInUp">
                    <div class="blog-entry justify-content-end w-100 highlight-card" 
                         onclick="window.location.href='highlight-details.html?id=${project._id}'"
                         style="cursor: pointer;">
                        
                        <div class="block-20" style="background-image: url('${imgUrl}');">
                            <div class="meta-date">
                                <span class="day">${day}</span>
                                <span class="mos">${month}</span>
                                <span class="yr">${year}</span>
                            </div>
                        </div>
                        
                        <div class="text p-4 float-right d-block">
                            <div class="d-flex align-items-center mb-3 meta">
                                <p class="mb-0">
                                    <span class="mr-2" style="color: #b1b493; font-weight: 700; text-transform: uppercase;">${mainTag}</span>
                                </p>
                            </div>
                            <h3 class="heading mb-3">${project.title}</h3>
                            <p>${safeSnippet}</p>
                            
                            <div class="d-flex flex-wrap mt-3">
                                ${(project.tags || []).slice(0, 3).map(tag => `
                                    <button class="btn btn-light btn-sm mr-1 mb-1" 
                                            style="font-size: 11px; text-transform: uppercase; z-index: 2; position: relative;"
                                            onclick="event.stopPropagation(); window.location.href='index.html?tag=${encodeURIComponent(tag)}#highlights-section'">
                                        ${tag}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }).join("");

            // Re-trigger animations manually since content is dynamic
            if (window.jQuery && window.jQuery.fn.waypoint) {
                window.jQuery('.ftco-animate').waypoint(function (direction) {
                    if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
                        $(this.element).addClass('item-animate');
                        setTimeout(() => { $('body .ftco-animate.item-animate').each(function (k) { var el = $(this); setTimeout(function () { el.addClass('fadeInUp ftco-animated'); el.removeClass('item-animate'); }, k * 50, 'easeInOutExpo'); }); }, 100);
                    }
                }, { offset: '95%' });
            }

        } else {
            container.innerHTML = `<div class="col-12 text-center py-5"><h4 class="text-muted">No projects found.</h4><a href="index.html" class="btn btn-primary mt-3">View All</a></div>`;
        }

    } catch (err) {
        console.error("Error loading highlights:", err);
    }
});