"use client";

import { useEffect, useState, use } from "react";
import Masonry from "react-masonry-css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "@/components/post-card";
import { SavedPost } from "@/hooks/use-saved-posts";
import { useRouter, useSearchParams } from "next/navigation";

// Helper to transform Reddit raw data to our SavedPost shape
function transformPost(child: any): SavedPost | null {
    const { data } = child;
    const { post_hint, is_video, url, id, title, permalink, media, preview } = data;

    const isImage = post_hint === "image" || url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".gif");
    const isVideo = is_video || post_hint === "hosted:video" || post_hint === "rich:video";

    if (!isImage && !isVideo) return null;

    const width = preview?.images?.[0]?.source?.width;
    const height = preview?.images?.[0]?.source?.height;
    const thumbnail = preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&");

    let videoUrl = media?.reddit_video?.fallback_url;
    if (!videoUrl && preview?.reddit_video_preview?.fallback_url) {
        videoUrl = preview.reddit_video_preview.fallback_url;
    }

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
    const router = useRouter();
    const searchParams = useSearchParams();

    const sort = searchParams.get("sort") || "hot";
    const timeRange = searchParams.get("t") || "day";

    const [posts, setPosts] = useState<SavedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [after, setAfter] = useState<string | null>(null);

    const { ref, inView } = useInView();

    const fetchPosts = async (nextPage?: string) => {
        try {
            let url = `/api/r/${sub}?sort=${sort}`;
            if (sort === "top" || sort === "controversial") {
                url += `&t=${timeRange}`;
            }
            if (nextPage) {
                url += `&after=${nextPage}`;
            }

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

    // Reset and fetch when sub, sort, or timeRange changes
    useEffect(() => {
        setPosts([]);
        setAfter(null);
        setLoading(true);
        fetchPosts();
    }, [sub, sort, timeRange]);

    // Infinite scroll
    useEffect(() => {
        if (inView && after && !loading) {
            fetchPosts(after);
        }
    }, [inView, after, loading]);

    const handleSortChange = (newSort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", newSort);
        if (newSort !== "top" && newSort !== "controversial") {
            params.delete("t");
        }
        router.push(`/r/${sub}?${params.toString()}`);
    };

    const handleTimeChange = (newTime: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("t", newTime);
        router.push(`/r/${sub}?${params.toString()}`);
    };

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
            <header className="mb-6 sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold capitalize truncate">/r/{sub}</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <Select value={sort} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hot">Hot</SelectItem>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="top">Top</SelectItem>
                                <SelectItem value="controversial">Controversial</SelectItem>
                                <SelectItem value="best">Best</SelectItem>
                            </SelectContent>
                        </Select>

                        {(sort === "top" || sort === "controversial") && (
                            <Select value={timeRange} onValueChange={handleTimeChange}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hour">Now</SelectItem>
                                    <SelectItem value="day">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                    <SelectItem value="all">All Time</SelectItem>
                                </SelectContent>
                            </Select>
                        )}

                        <Link href="/saved" className="ml-auto sm:ml-0">
                            <Button variant="outline">View Saved</Button>
                        </Link>
                    </div>
                </div>
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
