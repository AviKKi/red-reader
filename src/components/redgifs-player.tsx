"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface RedGifsPlayerProps {
    iframeUrl: string;
    thumbnail: string;
    width?: number;
    height?: number;
}

export function RedGifsPlayer({ iframeUrl, thumbnail, width, height }: RedGifsPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const aspectRatio = width && height ? `${width}/${height}` : "16/9";

    if (isPlaying) {
        return (
            <iframe
                src={iframeUrl}
                frameBorder="0"
                allow="fullscreen"
                scrolling="no"
                className="w-full h-auto object-cover"
                style={{ aspectRatio }}
            />
        );
    }

    return (
        <div
            className="relative w-full h-auto cursor-pointer group"
            style={{ aspectRatio }}
            onClick={() => setIsPlaying(true)}
        >
            <img
                src={thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
                loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="bg-white/90 rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-black fill-current" />
                </div>
            </div>
        </div>
    );
}
