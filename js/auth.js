import { supabase } from "./supabase.js"

/* LOGIN */
window.loginUser = async () => {

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert(error.message)
    return
  }

  // 🔥 OHJAUS DASHBOARDIIN
  window.location.href = "memberdashboard.html"
}


/* LOGOUT */
window.logoutUser = async () => {

  await supabase.auth.signOut()

  // 🔥 OHJAUS LOGIN-SIVULLE
  window.location.href = "member.html"
}


/* SESSION CHECK */
window.onload = async () => {

  const { data } = await supabase.auth.getUser()

  if (data.user) {

    // 🔥 JOS KÄYTTÄJÄ ON JO SISÄLLÄ → DASHBOARDIIN
    window.location.href = "memberdashboard.html"
  }
}
