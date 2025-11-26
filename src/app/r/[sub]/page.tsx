"use client";

import { useEffect, useState, use } from "react";
import Masonry from "react-masonry-css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "@/components/post-card";
import { SavedPost } from "@/hooks/use-saved-posts";

// Helper to transform Reddit raw data to our SavedPost shape
function transformPost(child: any): SavedPost | null {
    const { data } = child;
    const { post_hint, is_video, url, id, title, permalink, media, preview } = data;

    const isImage = post_hint === "image" || url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".gif");
    const isVideo = is_video || post_hint === "hosted:video";

    if (!isImage && !isVideo) return null;

    const width = preview?.images?.[0]?.source?.width;
    const height = preview?.images?.[0]?.source?.height;
    const thumbnail = preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&");
    const videoUrl = media?.reddit_video?.fallback_url;

    return {
        id,
        title,
        url: url.replace(/&amp;/g, "&"),
        permalink,
        thumbnail,
        isVideo: !!isVideo,
        videoUrl,
        width,
        height,
    };
}

export default function SubredditPage({ params }: { params: Promise<{ sub: string }> }) {
    const { sub } = use(params);
    const [posts, setPosts] = useState<SavedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [after, setAfter] = useState<string | null>(null);

    const { ref, inView } = useInView();

    const fetchPosts = async (nextPage?: string) => {
        try {
            const url = nextPage ? `/api/r/${sub}?after=${nextPage}` : `/api/r/${sub}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            const newPosts = data.data.children
                .map(transformPost)
                .filter((p: SavedPost | null) => p !== null) as SavedPost[];

            setPosts((prev) => (nextPage ? [...prev, ...newPosts] : newPosts));
            setAfter(data.data.after);
        } catch (err) {
            setError("Could not load subreddit.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPosts([]);
        setAfter(null);
        setLoading(true);
        fetchPosts();
    }, [sub]);

    useEffect(() => {
        if (inView && after && !loading) {
            fetchPosts(after);
        }
    }, [inView, after, loading]);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-500">{error}</h1>
                <Link href="/">
                    <Button>Go Back</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 bg-background">
            <header className="mb-6 flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold capitalize">/r/{sub}</h1>
                </div>
                <Link href="/saved">
                    <Button variant="outline">View Saved</Button>
                </Link>
            </header>

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-4"
                columnClassName="pl-4 bg-clip-padding"
            >
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </Masonry>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-xl" />
                    ))}
                </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={ref} className="h-10 w-full" />
        </div>
    );
}
