import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async () => {
  const clientId = Deno.env.get("TWITCH_CLIENT_ID");
  const clientSecret = Deno.env.get("TWITCH_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ error: "Missing Twitch credentials" }),
      { status: 500 },
    );
  }

  // 1) Hae app access token
  const tokenRes = await fetch(
    `https://id.twitch.tv/oauth2/token` +
      `?client_id=${clientId}` +
      `&client_secret=${clientSecret}` +
      `&grant_type=client_credentials`,
    { method: "POST" },
  );

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response(
      JSON.stringify({ error: "Failed to get access token", raw: tokenData }),
      { status: 500 },
    );
  }

  // 2) Hae G3splitter‑kanavan stream‑tiedot
  const streamRes = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=G3splitter`,
    {
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
      },
    },
  );

  const streamData = await streamRes.json();

  return new Response(JSON.stringify(streamData), {
    headers: { "Content-Type": "application/json" },
  });
});
