document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE = 'http://localhost:5050/api'; //
    const urlParams = new URLSearchParams(window.location.search);
    const categoryType = urlParams.get('type');

    const titleMap = {
        'research': 'Research Publications',
        'ai_ml': 'AI, ML & Deep Learning',
        'iot': 'Internet of Things (IoT)',
        // ... add other keys if needed
    };

    document.getElementById('category-title').innerText = titleMap[categoryType] || 'Portfolio Archives';

    try {
        // Fetch from the SECURE public endpoint
        const res = await fetch(`${API_BASE}/public/projects?category=${categoryType}`);
        const projects = await res.json();
        const container = document.getElementById('filtered-projects-container');

        if (projects.length > 0) {
            container.innerHTML = projects.map(p => `
                <div class="col-md-4 mb-4">
                    <div class="project img d-flex justify-content-center align-items-center shadow rounded" 
                         style="background-image: url('${p.thumbnail || p.image}'); height: 350px; position: relative; background-color:#fff; background-size:contain; background-repeat:no-repeat; background-position:center;">
                        <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255, 255, 255, 0.88); z-index:1;"></div>
                        <div class="text text-center px-3" style="z-index: 5; opacity: 1 !important; visibility: visible !important;">
                            <h3 class="font-weight-bold" style="color:#000; font-size:22px;">${p.title}</h3>
                            <span style="color:#b1b493; font-weight:700; text-transform:uppercase; font-size:11px; letter-spacing:2px;">${p.category}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<div class="col-12 text-center p-5"><h3>No projects found in this category.</h3></div>`;
        }
    } catch (err) {
        console.error("Connection Error:", err);
    }
});