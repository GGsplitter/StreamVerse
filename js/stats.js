import { supabase } from "./supabase.js";

/* ============================
   PALVELULISTA – lisää tänne uusia palveluita
============================ */
const SERVICES = {
    tiktok: loadTikTok,
    youtube: loadYouTube,
    twitch: loadTwitch,
    // instagram: loadInstagram,  <-- voit lisätä tämän myöhemmin
    // facebook: loadFacebook,
    // kick: loadKick,
};

/* ============================
   AUTOMAATTINEN LATAUS COLLAPSIBLESSA
============================ */
function autoLoad(id) {
    if (SERVICES[id]) {
        SERVICES[id](); // kutsuu oikeaa funktiota automaattisesti
    }
}

/* ============================
   PLACEHOLDER-FUNKTIOT
   (myöhemmin API-kutsut)
============================ */
function loadTikTok() {
    updateBox("tiktok", "Haetaan TikTok dataa...");
    setTimeout(() => updateBox("tiktok", "TikTok data ladattu (placeholder)"), 500);
}

function loadYouTube() {
    updateBox("youtube", "Haetaan YouTube dataa...");
    setTimeout(() => updateBox("youtube", "YouTube data ladattu (placeholder)"), 500);
}

function loadTwitch() {
    updateBox("twitch", "Haetaan Twitch dataa...");
    setTimeout(() => updateBox("twitch", "Twitch data ladattu (placeholder)"), 500);
}

/* ============================
   YLEINEN JSON-BOXIN PÄIVITYS
============================ */
function updateBox(id, text) {
    document.getElementById(`${id}-json`).textContent = text;
}

/* ============================
   ADMIN-TARKISTUS + ALUSTUS
============================ */
window.onload = async () => {

    // Tarkista kirjautuminen
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        window.location.href = "index.html";
        return;
    }

    // Tarkista rooli
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        window.location.href = "overview.html";
        return;
    }

    // Aseta alkuarvot kaikille palveluille
    Object.keys(SERVICES).forEach(service => {
        updateBox(service, "Ei dataa vielä");
    });
};
