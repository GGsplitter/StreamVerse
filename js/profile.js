// profile.js — Showcase Dashboard profiiliosio
import { supabase } from "./supabase.js";

// Storage bucket
const bucketName = "profile_media";

// HTML-elementit
const bannerPreview = document.getElementById("banner-preview");
const avatarPreview = document.getElementById("avatar-preview");
const bannerInput = document.getElementById("banner-input");
const avatarInput = document.getElementById("avatar-input");
const usernameInput = document.getElementById("username-input");
const saveBtn = document.getElementById("save-profile-btn");
const statusEl = document.getElementById("profile-status");

// Muuttujat
let currentUser = null;
let profile = null;
let newBannerFile = null;
let newAvatarFile = null;

// 1. Ladataan kirjautunut käyttäjä + profiili
async function loadProfile() {
  statusEl.textContent = "Ladataan profiilia...";

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    statusEl.textContent = "Et ole kirjautunut.";
    return;
  }

  currentUser = userData.user;

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if (error) {
    statusEl.textContent = "Profiilin lataus epäonnistui.";
    return;
  }

  profile = profileData;

  usernameInput.value = profile.username || "";
  avatarPreview.src = profile.avatar_url;
  bannerPreview.src = profile.banner_url;

  statusEl.textContent = "Profiili ladattu.";
}

// 2. Esikatselu kun käyttäjä valitsee uuden kuvan
bannerInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  newBannerFile = file;
  bannerPreview.src = URL.createObjectURL(file);
});

avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  newAvatarFile = file;
  avatarPreview.src = URL.createObjectURL(file);
});

// 3. Upload helper — palauttaa public URL:n
async function uploadToStorage(path, file) {
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error(error);
    throw error;
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}

// 4. Tallennetaan profiili
saveBtn.addEventListener("click", async () => {
  statusEl.textContent = "Tallennetaan...";
  saveBtn.disabled = true;

  let avatarUrl = profile.avatar_url;
  let bannerUrl = profile.banner_url;

  try {
    if (newAvatarFile) {
      const avatarPath = `avatars/${currentUser.id}-${Date.now()}.png`;
      avatarUrl = await uploadToStorage(avatarPath, newAvatarFile);
    }

    if (newBannerFile) {
      const bannerPath = `banners/${currentUser.id}-${Date.now()}.png`;
      bannerUrl = await uploadToStorage(bannerPath, newBannerFile);
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username: usernameInput.value || null,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
      })
      .eq("id", currentUser.id);

    if (error) {
      statusEl.textContent = "Tallennus epäonnistui.";
      console.error(error);
    } else {
      statusEl.textContent = "Profiili tallennettu.";
    }
  } catch (err) {
    statusEl.textContent = "Virhe tallennuksessa.";
  }

  saveBtn.disabled = false;
});

// 5. Käynnistetään profiilin lataus
loadProfile();
