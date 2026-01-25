document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("blog-container");
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/public/blogs`);
        const blogs = await res.json();

        if (blogs.length > 0) {
            container.innerHTML = blogs.slice(0, 3).map(b => `
                <div class="col-md-4 d-flex ftco-animate">
                    <div class="blog-entry shadow-sm w-100 p-3 bg-white rounded">
                        <div class="block-20 rounded" style="background-image: url('${b.image}'); height: 200px; background-size: cover;"></div>
                        <div class="text mt-3">
                            <h3 class="heading" style="font-weight: 800;"><a href="#" style="color: #000;">${b.title}</a></h3>
                            <p class="small text-muted">${b.description.substring(0, 100)}...</p>
                        </div>
                    </div>
                </div>`).join("");
            
            // Critical: Re-trigger animations after content loads
            if (window.refreshAnimations) window.refreshAnimations();
        }
    } catch (e) { container.innerHTML = "<p>Blog currently offline.</p>"; }
});