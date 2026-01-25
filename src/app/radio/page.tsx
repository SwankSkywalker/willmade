"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Car } from "lucide-react";

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
        </div>
    )
}
    