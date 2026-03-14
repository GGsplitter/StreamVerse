export default async function handler(req, res) {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI; 
  const scopes = [
    "user:read:email",
    "user:read:follows"
  ].join(" ");

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scopes)}`;

  // Redirect user to Twitch login
  res.redirect(twitchAuthUrl);
}
