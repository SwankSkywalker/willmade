"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Track {
    name: string;
    artist: { "#text": string };
    album: { "#text": string };
    iamge: { "#text": string; size: string }[];
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


    