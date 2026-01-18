export const dynamic = 'force-static'

export async function GET() {
    const apikey = process.env.LASTFM_API_KEY;
    const uname = process.env.LASTFM_UNAME;

    const res = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${uname}&api_key=${apikey}&format=json&limit=1`);

    const data = await res.json();

    return Response.json(data);
}