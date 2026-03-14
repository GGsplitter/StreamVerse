export default async function handler(req,res){

try{

const response = await fetch(
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
});

const data = await response.json();

res.status(200).json(data);

}catch(err){
res.status(500).json({error:err.message});
}

}
