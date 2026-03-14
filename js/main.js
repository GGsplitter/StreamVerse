import { supabase } from "./supabase.js";

async function initSidebarAdmin() {
  // Tarkista kirjautunut käyttäjä
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  // Hae profiili ja rooli
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    return;
  }

  // Näytä Stats-linkki vain adminille
  if (profile?.role === "admin") {
    const statsLink = document.getElementById("stats-link");
    if (statsLink) statsLink.style.display = "block";
  }
}

initSidebarAdmin();
