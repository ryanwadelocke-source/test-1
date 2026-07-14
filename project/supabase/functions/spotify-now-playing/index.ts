import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token refresh failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
  const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");
  const refreshToken = Deno.env.get("SPOTIFY_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    return json({ error: "Spotify credentials not configured", configured: false }, 503);
  }

  try {
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    const nowRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 204 = nothing currently playing
    if (nowRes.status === 204) {
      return json({ playing: false });
    }

    if (!nowRes.ok) {
      throw new Error(`Spotify API error: ${nowRes.status}`);
    }

    const data = await nowRes.json();

    // Handle episode / non-track items gracefully
    if (!data || !data.item) {
      return json({ playing: false });
    }

    const item = data.item;
    const isTrack = item.type === "track";

    const track = {
      playing: data.is_playing as boolean,
      id: item.id as string,
      name: item.name as string,
      uri: item.uri as string,
      type: item.type as string,
      artists: isTrack
        ? (item.artists as { name: string }[]).map((a) => a.name)
        : [item.show?.name ?? "Podcast"],
      albumName: isTrack ? (item.album?.name as string) : undefined,
      albumArt: isTrack
        ? ((item.album?.images as { url: string; width: number }[])?.[0]?.url ?? null)
        : ((item.images as { url: string }[])?.[0]?.url ?? null),
      durationMs: item.duration_ms as number,
      progressMs: data.progress_ms as number,
    };

    return json({ playing: true, track });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
});
