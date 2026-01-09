window.addEventListener("load", async () => {
  try {
    const res = await fetch("./data/highlights.json");
    if (!res.ok) throw new Error("Failed to load highlights.json");

    const data = await res.json();

    const container = document.getElementById("highlights-container");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const activeTag = params.get("tag");

    const published = data.filter(
      (h) => h.status && h.status.toLowerCase() === "published"
    );

    const items = activeTag
      ? published.filter((h) => (h.tags || []).includes(activeTag))
      : published;

    container.innerHTML = "";

    items.forEach((h) => {
      container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm h-100">
            <img src="${h.image}" class="card-img-top" alt="${h.title}">
            <div class="card-body d-flex flex-column">
              <span class="badge badge-secondary mb-2">${h.type}</span>

              <h5 class="card-title">${h.title}</h5>

              <p class="text-muted mb-1">
                <strong>${h.status}</strong> · ${h.event}
              </p>

              <a href="${h.link}" class="btn btn-primary btn-sm mt-auto">
                Read more
              </a>
            </div>
          </div>
        </div>
        `
      );
    });
  } catch (err) {
    console.error("Highlights error:", err);
  }
});
