import { supabase } from "./supabase.js"

/* LOGIN */
window.loginUser = async () => {

const email = document.getElementById("email").value
const password = document.getElementById("password").value

const { error } = await supabase.auth.signInWithPassword({
email,
password
})

if(error){
alert(error.message)
return
}

location.reload()

}

/* LOGOUT */
window.logoutUser = async () => {

await supabase.auth.signOut()
location.reload()

}

/* SESSION CHECK */
window.onload = async () => {

const { data } = await supabase.auth.getUser()

if(data.user){

document.getElementById("login-box").style.display="none"
document.getElementById("member-content").style.display="block"

document.getElementById("user-email").innerText =
data.user.email

}

}
