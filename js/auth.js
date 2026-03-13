import { supabase } from "./supabase.js";

/* REGISTER */
window.registerUser = async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // 1. Luo käyttäjä
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;

  // 2. Luo automaattinen käyttäjänimi (uniikki)
  const baseName = email.split("@")[0];
  let autoUsername = baseName + "_" + Math.floor(Math.random() * 9999);

  // Tarkista ettei nimi ole jo käytössä
  let isUnique = false;

  while (!isUnique) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", autoUsername);

    if (!existing || existing.length === 0) {
      isUnique = true;
    } else {
      autoUsername = baseName + "_" + Math.floor(Math.random() * 9999);
    }
  }

  // 3. Oletuskuvat bucketista
  const defaultAvatar = "https://zqlduhwnipidtweqqnyj.supabase.co/storage/v1/object/public/profile_media/CHH_LOGO.png";
  const defaultBanner = "https://zqlduhwnipidtweqqnyj.supabase.co/storage/v1/object/public/profile_media/HERO_IMAGE.png";

  // 4. Luo profiilirivi
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    username: autoUsername,
    avatar_url: defaultAvatar,
    banner_url: defaultBanner,
    bio: "",
    socials: {},        // tulevia ominaisuuksia varten
    custom_links: []    // tulevia ominaisuuksia varten
  });

  if (profileError) {
    alert("Profiilin luonti epäonnistui: " + profileError.message);
    return;
  }

  // 5. Ohjaa dashboardiin
  window.location.href = "overview.html";
};

/* LOGIN */
window.loginUser = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "overview.html";
};

/* LOGOUT */
window.logoutUser = async () => {
  await supabase.auth.signOut();
  window.location.href = "member.html";
};
