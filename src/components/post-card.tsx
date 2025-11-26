"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink } from "lucide-react";
import { useSavedPosts, SavedPost } from "@/hooks/use-saved-posts";
import { cn } from "@/lib/utils";
import { RedGifsPlayer } from "./redgifs-player";

interface PostCardProps {
    post: SavedPost;
}

export function PostCard({ post }: PostCardProps) {
    const { isSaved, savePost, removePost } = useSavedPosts();
    const saved = isSaved(post.id);

    const toggleSave = () => {
        if (saved) {
            removePost(post.id);
        } else {
            savePost(post);
        }
    };

    // Calculate aspect ratio style to prevent layout shift
    const aspectRatio = post.width && post.height ? post.height / post.width : 1;

    return (
        <div className="mb-4 break-inside-avoid relative group">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0 relative">
                    <div className="relative">
                        {post.iframeUrl ? (
                            <RedGifsPlayer
                                iframeUrl={post.iframeUrl}
                                thumbnail={post.thumbnail}
                                width={post.width}
                                height={post.height}
                            />
                        ) : post.isVideo && post.videoUrl ? (
                            <video
                                controls
                                className="w-full h-auto object-cover"
                                src={post.videoUrl}
                                poster={post.thumbnail}
                                style={{ aspectRatio: `${post.width}/${post.height}` }}
                            />
                        ) : (
                            <img
                                src={post.url}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                                style={{ aspectRatio: `${post.width}/${post.height}` }}
                            />
                        )}

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <Button
                                size="icon"
                                variant="secondary"
                                className={cn("h-8 w-8 rounded-full shadow-md", saved && "text-red-500 bg-white")}
                                onClick={toggleSave}
                            >
                                <Heart className={cn("h-4 w-4", saved && "fill-current")} />
                            </Button>
                            <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    </div>

                    <div className="p-3">
                        <h2 className="text-sm font-medium line-clamp-2 leading-snug">
                            {post.title}
                        </h2>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
