"use client";

import Masonry from "react-masonry-css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { useSavedPosts } from "@/hooks/use-saved-posts";

export default function SavedPage() {
    const { savedPosts, loading } = useSavedPosts();

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 bg-background flex items-center justify-center">
                <p>Loading saved posts...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 bg-background">
            <header className="mb-6 flex items-center gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4">
                <Link href="/">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Saved Posts</h1>
            </header>

            {savedPosts.length === 0 ? (
                <div className="text-center mt-20">
                    <h2 className="text-xl text-muted-foreground">No saved posts yet.</h2>
                    <p className="mt-2">Go explore some subreddits!</p>
                </div>
            ) : (
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto -ml-4"
                    columnClassName="pl-4 bg-clip-padding"
                >
                    {savedPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </Masonry>
            )}
        </div>
    );
}
