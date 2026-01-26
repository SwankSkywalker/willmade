import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const userId = process.env.SOUNDCLOUD_USER_ID;

  if (!clientId || !userId) {
    return NextResponse.json(
      { error: "Soundcloud credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.soundcloud.com/users/${userId}/tracks?client_id=${clientId}&limit=10`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      throw new Error("Failed to fetch from Soundcloud");
    }

    const tracks =  await res.json();
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Soundcloud API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Soundcloud tracks"},
      { status: 500 }
    );
  }
}
