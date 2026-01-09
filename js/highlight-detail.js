window.addEventListener("load", async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    const res = await fetch("./data/highlights.json");
    if (!res.ok) throw new Error("Failed to load highlights.json");

    const data = await res.json();

    const h = data.find((item) => item.id === id);
    const galleryEl = document.getElementById("project-gallery");
   

    // Guard: block non-existent or unpublished highlights
    if (!h || h.status?.toLowerCase() !== "published") {
      document.body.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <h2>Highlight not found</h2>
          <p>This content is unavailable.</p>
        </div>
      `;
      return;
    }
     //demo gallary corousle
    if (galleryEl && Array.isArray(h.gallery)) {
      h.gallery.forEach((src) => {
        galleryEl.insertAdjacentHTML(
          "beforeend",
          `<img src="${src}" class="img-fluid mb-3" alt="Project image">`
        );
      });
    }
    // --------------------
    // RELATED HIGHLIGHTS
    // --------------------
    const relatedContainer = document.getElementById("related-highlights");

    if (relatedContainer) {
      const related = data
        .filter(
          (item) =>
            item.id !== h.id &&
            item.status?.toLowerCase() === "published" &&
            item.tags?.some((tag) =>
              h.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
            )
        )
        .slice(0, 3);

      if (related.length === 0) {
        relatedContainer.innerHTML = "<li>No related highlights yet.</li>";
      } else {
        related.forEach((item) => {
          relatedContainer.insertAdjacentHTML(
            "beforeend",
            `<li>
          <a href="highlight.html?id=${item.id}">
            ${item.title}
          </a>
        </li>`
          );
        });
      }
    }

    // DOM refs
    const titleEl = document.getElementById("highlight-title");
    const eventEl = document.getElementById("highlight-event");
    const statusEl = document.getElementById("highlight-status");
    const summaryEl = document.getElementById("highlight-summary");
    const tagsEl = document.getElementById("highlight-tags");
    const heroEl = document.getElementById("hero-section");
    const pageTitle = document.getElementById("page-title");

    if (!titleEl || !eventEl || !statusEl || !summaryEl || !tagsEl || !heroEl) {
      console.error("Missing DOM placeholders in highlight.html");
      return;
    }

    // Inject content
    titleEl.textContent = h.title;
    eventEl.textContent = h.event || "";
    statusEl.textContent = h.status;
    summaryEl.textContent = h.summary || "";
    pageTitle.textContent = h.title;

    heroEl.style.backgroundImage = `url('${h.image}')`;

    // Tags (clickable → homepage filtered)
    tagsEl.innerHTML = "";
    (h.tags || []).forEach((tag) => {
      const encoded = encodeURIComponent(tag);
      const a = document.createElement("a");
      a.href = `index.html?tag=${encoded}#highlights-section`;
      a.className = "tag-cloud-link";
      a.textContent = tag;
      tagsEl.appendChild(a);
    });
  } catch (err) {
    console.error("Highlight detail error:", err);
  }
});
