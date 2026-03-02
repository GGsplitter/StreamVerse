export default async function handler(req,res){

try{

const { login, token } = req.query;

if(!login || !token){
return res.status(400).json({error:"Missing params"});
}

const userRes = await fetch(
`https://api.twitch.tv/helix/users?login=${login}`,
{
headers:{
"Authorization": `Bearer ${token}`,
"Client-Id": process.env.CLIENT_ID
}
}
);

const userData = await userRes.json();

const streamRes = await fetch(
`https://api.twitch.tv/helix/streams?user_login=${login}`,
{
headers:{
"Authorization": `Bearer ${token}`,
"Client-Id": process.env.CLIENT_ID
}
}
);

const streamData = await streamRes.json();

res.status(200).json({export default async function handler(req,res){

try{

const { token, ...logins } = req.query;

const loginParams = Object.values(logins)
.map(l => `login=${l}`)
.join("&");

const response = await fetch(
`https://api.twitch.tv/helix/users?${loginParams}`,
{
headers:{
Authorization:`Bearer ${token}`,
"Client-Id": process.env.CLIENT_ID
}
}
);

const data = await response.json();

res.status(200).json(data);

}catch(err){
res.status(500).json({error:err.message});
}

}
user:userData,
live:streamData
});

}catch(err){
res.status(500).json({error:err.message});
}

}
