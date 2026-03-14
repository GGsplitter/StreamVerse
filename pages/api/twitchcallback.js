export default async function handler(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.status(400).json(tokenData);
    }

    // Tässä kohtaa voit tallentaa tokenit Supabaseen jos haluat
    // tokenData.access_token
    // tokenData.refresh_token
    // tokenData.expires_in

    // Palauta käyttäjä takaisin sivulle
    res.redirect(`/dashboard?connected=twitch`);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
