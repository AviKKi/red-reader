"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const [subreddit, setSubreddit] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subreddit.trim()) {
      router.push(`/r/${subreddit.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">RedReader</CardTitle>
          <CardDescription>
            Enter a subreddit to view its images and videos in a masonry layout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="e.g. pics, aww, videos"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="text-lg"
            />
            <Button type="submit" className="w-full text-lg" disabled={!subreddit.trim()}>
              Go to /r/{subreddit.trim() || "..."}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <Link href="/saved">
              <Button variant="outline" className="w-full">
                View Saved Posts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
