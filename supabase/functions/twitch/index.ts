/// <reference lib="deno.ns" />
// deno-lint-ignore-file no-explicit-any

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { usernames } = await req.json();

    if (!Array.isArray(usernames) || usernames.length === 0) {
      return new Response(JSON.stringify({ error: "usernames must be an array" }), {
        status: 400,
      });
    }

    const clientId = Deno.env.get("TWITCH_CLIENT_ID");
    const clientSecret = Deno.env.get("TWITCH_CLIENT_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // OAuth token
    const tokenRes = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: "POST" }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Build login query
    const loginQuery = usernames.map((u) => `login=${u}`).join("&");

    // Fetch users
    const usersRes = await fetch(
      `https://api.twitch.tv/helix/users?${loginQuery}`,
      {
        headers: {
          "Client-ID": clientId!,
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );
    const usersData = await usersRes.json();
    const users = usersData.data;

    // Fetch streams
    const idQuery = users.map((u) => `user_id=${u.id}`).join("&");

    const streamsRes = await fetch(
      `https://api.twitch.tv/helix/streams?${idQuery}`,
      {
        headers: {
          "Client-ID": clientId!,
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );
    const streamsData = await streamsRes.json();
    const streams = streamsData.data;

    // Save to Supabase
    for (const user of users) {
      const stream = streams.find((s) => s.user_id === user.id) || null;

      // Save user
      await supabase.from("streamers").upsert({
        twitch_id: user.id,
        username: user.login,
        display_name: user.display_name,
        profile_image_url: user.profile_image_url,
        offline_image_url: user.offline_image_url,
        description: user.description,
      });

      // Save stream
      await supabase.from("streams").upsert({
        twitch_user_id: user.id,
        is_live: stream !== null,
        title: stream?.title ?? null,
        game_name: stream?.game_name ?? null,
        viewer_count: stream?.viewer_count ?? null,
        thumbnail_url: stream?.thumbnail_url ?? null,
        started_at: stream?.started_at ?? null,
      });
    }

    return new Response(JSON.stringify({ status: "saved" }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
