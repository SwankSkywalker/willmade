"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MainNav() {
    const pathName = usePathname();
    return (
        <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold italic">{siteConfig.name}</span>
            </Link>
            <Link href="/words" className={cn(
                "text-sm font-semibold italic transition-colors hover:text-primary hidden sm:inline-block",
                pathName === "/words" ? "text-foreground" : "text-foreground/60"
                )}>
                    Words
            </Link>
            <Link href="/moments" className={cn(
                "text-sm font-semibold italic transition-colors hover:text-primary hidden sm:inline-block",
                pathName === "/words" ? "text-foreground" : "text-foreground/60"
                )}>
                    Moments
            </Link>
            <Link href="/Radio" className={cn(
                "text-sm font-semibold italic transition-colors hover:text-primary hidden sm:inline-block",
                pathName === "/words" ? "text-foreground" : "text-foreground/60"
                )}>
                    Radio
            </Link>
        </nav>
    );
}
