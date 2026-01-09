// --------------------
// STATE
// --------------------
let highlights = [];
let editingId = null;

// --------------------
// DOM REFERENCES
// --------------------
const tableBody = document.getElementById("highlightTableBody");
const emptyState = document.getElementById("emptyState");

const form = document.getElementById("highlightForm");
const formTitle = document.getElementById("formTitle");

const idInput = document.getElementById("idInput");
const titleInput = document.getElementById("titleInput");
const shortDescInput = document.getElementById("shortDescInput");
const contentInput = document.getElementById("contentInput");
const tagsInput = document.getElementById("tagsInput");
const statusInput = document.getElementById("statusInput");

const cancelEditBtn = document.getElementById("cancelEditBtn");
const exportBtn = document.getElementById("exportBtn");

// --------------------
// LOAD DATA
// --------------------
fetch("../data/highlights.json")
  .then(res => res.json())
  .then(data => {
    highlights = Array.isArray(data) ? data : [];
    renderTable();
  })
  .catch(() => {
    highlights = [];
    renderTable();
  });

// --------------------
// RENDER TABLE
// --------------------
function renderTable() {
  tableBody.innerHTML = "";

  if (highlights.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  highlights.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${Array.isArray(item.tags) ? item.tags.join(", ") : ""}</td>
      <td>${item.status || "draft"}</td>
      <td>
        <button type="button" data-edit="${item.id}">Edit</button>
        <button type="button" data-delete="${item.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// --------------------
// TABLE ACTIONS
// --------------------
tableBody.addEventListener("click", (e) => {
  const editId = e.target.dataset.edit;
  const deleteId = e.target.dataset.delete;

  if (editId) startEdit(editId);
  if (deleteId) deleteHighlight(deleteId);
});

// --------------------
// START EDIT
// --------------------
function startEdit(id) {
  const item = highlights.find(h => h.id === id);
  if (!item) return;

  editingId = id;

  idInput.value = item.id;
  titleInput.value = item.title;
  shortDescInput.value = item.shortDescription;
  contentInput.value = item.content;
  tagsInput.value = (item.tags || []).join(", ");
  statusInput.value = item.status || "draft";

  idInput.disabled = true;

  formTitle.textContent = "Edit Highlight";
  cancelEditBtn.classList.remove("hidden");
}

// --------------------
// DELETE
// --------------------
function deleteHighlight(id) {
  if (!confirm("Delete this highlight?")) return;

  highlights = highlights.filter(h => h.id !== id);
  renderTable();
  resetForm();
}

// --------------------
// SAVE (ADD / EDIT)
// --------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const shortDescription = shortDescInput.value.trim();
  const content = contentInput.value.trim();
  const tags = tagsInput.value
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  const status = statusInput.value;

  if (!title || !shortDescription || !content) {
    alert("All required fields must be filled.");
    return;
  }

  if (editingId) {
    // EDIT EXISTING
    const index = highlights.findIndex(h => h.id === editingId);
    if (index === -1) return;

    highlights[index] = {
      ...highlights[index],
      title,
      shortDescription,
      content,
      tags,
      status
    };
  } else {
    // ADD NEW
    const id = generateId(title);

    highlights.push({
      id,
      title,
      shortDescription,
      content,
      tags,
      status,
      createdAt: new Date().toISOString().split("T")[0]
    });
  }

  resetForm();
  renderTable();
});

// --------------------
// CANCEL EDIT
// --------------------
cancelEditBtn.addEventListener("click", () => {
  resetForm();
});

// --------------------
// RESET FORM
// --------------------
function resetForm() {
  form.reset();
  editingId = null;

  idInput.disabled = true;
  formTitle.textContent = "Add New Highlight";
  cancelEditBtn.classList.add("hidden");
}

// --------------------
// ID GENERATOR
// --------------------
function generateId(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let id = base;
  let counter = 1;

  while (highlights.some(h => h.id === id)) {
    id = `${base}-${counter++}`;
  }

  return id;
}

// --------------------
// EXPORT JSON
// --------------------
exportBtn.addEventListener("click", () => {
  const blob = new Blob(
    [JSON.stringify(highlights, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "highlights.json";
  a.click();
  URL.revokeObjectURL(url);
});
