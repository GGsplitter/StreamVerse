export default async function handler(req,res){

try{

const { logins } = req.query;

if(!logins){
return res.status(400).json({error:"Missing logins"});
}

const loginArray = logins.split(",");

/* GET TOKEN */
const tokenRes = await fetch(
"https://id.twitch.tv/oauth2/token",
{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded"
},
body:new URLSearchParams({
client_id: process.env.CLIENT_ID,
client_secret: process.env.CLIENT_SECRET,
grant_type:"client_credentials"
})
}
);

const tokenData = await tokenRes.json();

/* USERS */
const userRes = await fetch(
`https://api.twitch.tv/helix/users?${loginArray.map(l=>`login=${l}`).join("&")}`,
{
headers:{
Authorization:`Bearer ${tokenData.access_token}`,
"Client-Id":process.env.CLIENT_ID
}
}
);

const userData = await userRes.json();

/* STREAMS */
const streamRes = await fetch(
`https://api.twitch.tv/helix/streams?${loginArray.map(l=>`user_login=${l}`).join("&")}`,
{
headers:{
Authorization:`Bearer ${tokenData.access_token}`,
"Client-Id":process.env.CLIENT_ID
}
}
);

const streamData = await streamRes.json();

res.status(200).json({
users:userData.data,
streams:streamData.data
});

}catch(err){
res.status(500).json({error:err.message});
}

}
