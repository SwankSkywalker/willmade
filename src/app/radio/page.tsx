"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


interface Track {
    name: string;
    artist: { "#text": string };
    album: { "#text": string };
    image: { "#text": string; size: string }[];
    "@attr"?: { nowplayingz: string };
}

interface SoundCloudTrack {
    id: number;
    title: string;
    artwork_url: string | null;
    permalink_url: string;
    duration: number;
    created_at: string;
}

function NowPlayingSkeleton() {
    return (
        <Card>
            <CardContent className="flex items-center gap-6 p-6">
                <Skeleton className="w-24 h-24 rounded-md" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </CardContent>
        </Card>
    );
}

function RecentTrackSkeleton() {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-3">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </CardContent>
        </Card>
    );
}

function SoundCloudSkeleton() {
    return (
        <Card>
            <CardContent className="p-0">
                <Skeleton className="w-full h-[166px] rounded-lg" />
            </CardContent>
        </Card>
    );
}

export default function RadioPage() {
    const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
    const [recentTracks, setRecentTracks] = useState<Track[]>([]);
    const [soundCloudTracks, setSoundCloudTracks] = useState<SoundCloudTrack[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingLastFm, setLoadingLastFm] = useState(true);
    const [loadingSoundCloud, setLoadingSoundCloud] = useState(true);

    useEffect(() => {
        async function fetchNowPlaying() {
            try {
                const res = await fetch("/api/now-playing");
                const data = await res.json();
                const tracks = data.recenttracks?.track || [];

                if (tracks.length > 0) {
                    const current = tracks[0];
                    setIsPlaying(current["@attr"]?.nowPlaying === "true");
                    setNowPlaying(current);
                    setRecentTracks(tracks.slice(1, 6));
                }
            } catch (error) {
                console.error("Failed to fetch now playing:", error);
            } finally {
                setLoadingLastFm(false);
            }
        }

        async function fetchSoundCloud() {
            try {
                const res = await fetch("api/soundcloud");
                const data = await res.json();
                setSoundCloudTracks(data.tracks || []);
            } catch (error) {
                console.error("Failed to fetch SoundCloud tracks:", error);
            } finally {
                setLoadingSoundCloud(false);
            }
        }

        fetchNowPlaying();
        fetchSoundCloud();

        // Poll for now playing updates every 30 secs
        const interval = setInterval(fetchNowPlaying, 30000);
        return () => clearInterval(interval);
    }, []);

    const getImageUrl = (track: Track) => {
        const largeImage = track.image?.find((img) => img.size === "large");
        return largeImage?.["#text"] || "/placeholder-album.png";
    };

    return (
        <div className="container max-w-4xl py-6 lg:py-10">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-y-4">
                    <h1 className="inline-block font-black italic text-4xl lg:text-5xl">
                        Radio
                    </h1>
                    <p className="text-xl text-muted-foreground font-bold">
                        What I&apos;m listening to...
                    </p>
                </div>
            </div>

            <hr className="mt-8" />

            {/* Now playing section*/}
            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    {isPlaying && (
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                        </span>
                    )}
                    {loadingLastFm ? "Loading..." : isPlaying ? "Now Playing" : "Last Played"}
                </h2>

                {loadingLastFm ? (
                    <NowPlayingSkeleton />
                ): nowPlaying ? (
                    <Card>
                        <CardContent className="flex items-center gap-6  p-6">
                            <img
                             src={getImageUrl(nowPlaying)}
                             alt={`${nowPlaying.album["#text"]} album art`}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-xl font-bold truncate">{nowPlaying.name}</p>
                                <p className="text-muted-foreground truncate">
                                    {nowPlaying.album["#text"]}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">Nothing playing right now.</p>
                        </CardContent>
                    </Card>
                )}
            </section>

            {/*Recently played section*/}
            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Recently Played</h2>

                {loadingLastFm ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <RecentTrackSkeleton key={i} />
                        ))}
                    </div>
                ): recentTracks.length > 0 ? (
                    <ul className="space-y-3">
                        {recentTracks.map((track, index) => (
                            <li key={`${track.name}-${index}`}>
                                <Card className="hover:bg-accent transition-colors">
                                    <CardContent className="flex item-center gap-4 p-3">
                                        <img
                                         src={getImageUrl(track)}
                                         alt={`${track.album["#text"]} alnum art`}
                                         className="w-12 h12 rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{track.name}</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {track.artist["#text"]}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">No Recent Tracks</p>
                        </CardContent>
                    </Card>
                )}
            </section>

            {/*Willmade Sound Radio Section*/}
            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-2">Willmade Sound Radio</h2>
                <p className="text-muted-foreground mb-6">
                    Episodes I&apos;ve uploaded to Soundcloud.
                </p>

                {loadingSoundCloud ? (
                    <div className="grid gap-4">
                        {[...Array(3)].map((_, i) => (
                            <SoundCloudSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    soundCloudTracks.length > 0 ? (
                        <div className="grid gap-4">
                            {soundCloudTracks.map((track) => (
                                <Card key={track.id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <iframe
                                         width="100%"
                                         height="166"
                                         allow="autoplay"
                                         src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                                            track.permalink_url
                                         )}
                                         &color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_repost=false&show_teaser=false`}
                                         title={track.title}
                                         className="rounded-lg"
                                         />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground"> No tracks uploaded yet</p>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </div>

    );
}
    