import { supabase } from "./supabase.js";

async function loadOverviewProfile() {

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const userId = userData.user.id;

    // Hae profiilitiedot
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (!profile) return;

    // ⭐ Aseta banneri
    if (profile.banner_url) {
        document.getElementById("overview-banner-area").style.backgroundImage =
            `url(${profile.banner_url})`;
    }

    // ⭐ Aseta avatar
    if (profile.avatar_url) {
        document.getElementById("overview-avatar-preview").style.backgroundImage =
            `url(${profile.avatar_url})`;
    }

    // ⭐ Aseta nimimerkki
    if (profile.username) {
        document.getElementById("overview-username-display").textContent =
            profile.username;
    }
}

loadOverviewProfile();
