import { supabase } from "./supabase.js";

// Haetaan kirjautunut käyttäjä
async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Ladataan profiilin tiedot
async function loadProfile() {
    const user = await getUser();
    if (!user) return;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Profiilin lataus epäonnistui:", error);
        return;
    }

    // Asetetaan profiilikortin tiedot
    document.getElementById("username-display").textContent = data.username || "@username";

    // Asetetaan muokkauskenttien arvot
    document.getElementById("username-input").value = data.username || "";
    document.getElementById("bio-input").value = data.bio || "";

    // Asetetaan avatar
    if (data.avatar_url) {
        document.getElementById("avatar-preview").style.backgroundImage = `url(${data.avatar_url})`;
    }

    // Asetetaan banneri
    if (data.banner_url) {
        document.getElementById("banner-area").style.backgroundImage = `url(${data.banner_url})`;
    }
}

// Päivitä nimimerkki
async function updateUsername() {
    const user = await getUser();
    const newName = document.getElementById("username-input").value.trim();

    if (!newName) return;

    const { error } = await supabase
        .from("profiles")
        .update({ username: newName })
        .eq("id", user.id);

    if (error) {
        // UNIQUE constraint violation (username varattu)
        if (error.code === "23505") {
            alert("Tämä nimimerkki on jo käytössä.");
            return;
        }

        console.error("Nimimerkin tallennus epäonnistui:", error);
        return;
    }

    // Päivitä profiilikorttiin heti
    document.getElementById("username-display").textContent = newName;
}

// Päivitä bio
async function updateBio() {
    const user = await getUser();
    const newBio = document.getElementById("bio-input").value.trim();

    const { error } = await supabase
        .from("profiles")
        .update({ bio: newBio })
        .eq("id", user.id);

    if (error) {
        console.error("Bion tallennus epäonnistui:", error);
        return;
    }
}

// Lataa kuva Supabaseen
async function uploadImage(file, path) {
    const { error } = await supabase.storage
        .from("profile_media")
        .upload(path, file, { upsert: true });

    if (error) {
        console.error("Kuvan lataus epäonnistui:", error);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from("profile_media")
        .getPublicUrl(path);

    return urlData.publicUrl;
}

// Vaihda avatar
async function changeAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;

    const user = await getUser();
    const filePath = `avatars/${user.id}.png`;

    const url = await uploadImage(file, filePath);
    if (!url) return;

    // Päivitä tietokantaan
    await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user.id);

    // Päivitä UI
    document.getElementById("avatar-preview").style.backgroundImage = `url(${url})`;
}

// Vaihda banneri
async function changeBanner(event) {
    const file = event.target.files[0];
    if (!file) return;

    const user = await getUser();
    const filePath = `banners/${user.id}.png`;

    const url = await uploadImage(file, filePath);
    if (!url) return;

    // Päivitä tietokantaan
    await supabase
        .from("profiles")
        .update({ banner_url: url })
        .eq("id", user.id);

    // Päivitä UI
    document.getElementById("banner-area").style.backgroundImage = `url(${url})`;
}

// Event listenerit
document.getElementById("save-username-btn").addEventListener("click", updateUsername);
document.getElementById("save-bio-btn").addEventListener("click", updateBio);
document.getElementById("avatar-input").addEventListener("change", changeAvatar);
document.getElementById("banner-input").addEventListener("change", changeBanner);

// Lataa profiili sivun avautuessa
loadProfile();
