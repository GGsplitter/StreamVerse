console.log("THIS IS THE REAL FILE");

import { supabase } from "./supabase.js";

// ⭐ GLOBAALI muuttuja
let links = [];

// ⭐ INPUTIT
const linkTitleInput = document.querySelector("#linkTitleInput");
const linkUrlInput = document.querySelector("#linkUrlInput");

// ⭐ EDITORIN LISTA
const linksList = document.querySelector("#linksList");

// ⭐ ESIKATSELU
const previewLinks = document.querySelector("#previewLinks");

// ⭐ LATAA KAIKKI KUN SIVU AVAUTUU
window.onload = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "index.html";
    return;
  }

  const user = data.user;

  // ⭐ HAE LINKIT SUPABASESTA
  const { data: linksRaw } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("order_index", { ascending: true });

  links = Array.isArray(linksRaw) ? linksRaw : [];

  // ⭐ RENDERÖI LISTA JA ESIKATSELU
  renderLinksList();
  renderPreview();

  // ⭐ LISÄÄ LINKKI
  document.querySelector("#addLinkBtn").onclick = async () => {
    const title = linkTitleInput.value.trim();
    const url = linkUrlInput.value.trim();

    if (!title || !url) return;

    const { data: inserted, error } = await supabase
      .from("links")
      .insert({
        user_id: user.id,
        title,
        url,
        order_index: links.length,
        style: {
          bg: "#111111",
          text: "#ffffff",
          border: "#ffe680",
          radius: 10,
          shadow: true,
          fontSize: 14
        }
      })
      .select("*");

    if (error) {
      alert("Linkin tallennus epäonnistui!");
      return;
    }

    // ⭐ Lisää uusi linkki paikalliseen listaan
    links.push(inserted[0]);

    linkTitleInput.value = "";
    linkUrlInput.value = "";

    renderLinksList();
    renderPreview();
  };
};

// ------------------------------
// ⭐ RENDERÖI EDITORIN LINKKILISTA
// ------------------------------
function renderLinksList() {
  linksList.innerHTML = "";

  links.forEach((link, index) => {
    const div = document.createElement("div");
    div.className = "link-item";
    div.draggable = true;                 // ⭐ DRAG
    div.dataset.index = index;            // ⭐ INDEX

    div.innerHTML = `
  <div class="drag-handle">⋮⋮</div>

  <div class="link-main">
    <div class="link-title">${link.title}</div>
    <div class="link-url">${link.url}</div>
  </div>

  <div class="link-actions">
    <button class="btn-danger" data-index="${index}">Poista</button>
  </div>
`;

    linksList.appendChild(div);
  });

  attachDeleteHandlers();
  attachDragHandlers();
}

// ------------------------------
// ⭐ POISTON KÄSITTELY
// ------------------------------
function attachDeleteHandlers() {
  document.querySelectorAll(".btn-danger").forEach(btn => {
    btn.addEventListener("click", async e => {
      const index = e.target.dataset.index;
      const link = links[index];

      await supabase.from("links").delete().eq("id", link.id);

      links.splice(index, 1);

      renderLinksList();
      renderPreview();
    });
  });
}

// ------------------------------
// ⭐ DRAG & DROP -JÄRJESTYS
// ------------------------------
let dragStartIndex = null;

function attachDragHandlers() {
  const items = document.querySelectorAll(".link-item");

  items.forEach(item => {
    item.addEventListener("dragstart", e => {
      dragStartIndex = Number(e.currentTarget.dataset.index);
      e.currentTarget.classList.add("dragging");
    });

    item.addEventListener("dragend", e => {
      e.currentTarget.classList.remove("dragging");
      saveOrderToSupabase();
    });

    item.addEventListener("dragover", e => {
      e.preventDefault();
      const overIndex = Number(e.currentTarget.dataset.index);
      if (overIndex === dragStartIndex) return;

      // ⭐ Vaihdetaan paikkoja paikallisesti
      const temp = links[dragStartIndex];
      links[dragStartIndex] = links[overIndex];
      links[overIndex] = temp;

      dragStartIndex = overIndex;

      renderLinksList();
      renderPreview();
    });
  });
}

// ⭐ TALLENNA JÄRJESTYS SUPABASEEN
async function saveOrderToSupabase() {
  const updates = links.map((link, index) => ({
    id: link.id,
    order_index: index
  }));

  await supabase.from("links").upsert(updates);
}

// ------------------------------
// ⭐ RENDERÖI ESIKATSELU (SUPABASE-LINKIT)
// ------------------------------
function renderPreview() {
  previewLinks.innerHTML = "";

  links.forEach(link => {
    const a = document.createElement("a");
    a.className = "preview-link-btn";
    a.href = link.url;
    a.textContent = link.title;

    // ⭐ TYYLIT (voit myöhemmin tallentaa nämä Supabaseen)
    a.style.backgroundColor = "#111111";
    a.style.color = "#ffffff";
    a.style.borderColor = "#ffe680";
    a.style.fontSize = "14px";
    a.style.borderRadius = "10px";
    a.style.boxShadow = "0 0 12px rgba(255,255,200,0.15)";

    previewLinks.appendChild(a);
  });
}
