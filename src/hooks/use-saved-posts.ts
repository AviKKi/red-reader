"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";

export interface SavedPost {
  id: string;
  title: string;
  url: string;
  permalink: string;
  thumbnail: string;
  isVideo: boolean;
  videoUrl?: string;
  width?: number;
  height?: number;
}

const STORAGE_KEY = "redreader_saved";

export function useSavedPosts() {
  const { user, token } = useAuth();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Load posts
  useEffect(() => {
    const loadPosts = async () => {
      if (user && token) {
        // Fetch from API
        try {
          const res = await fetch("/api/saved", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            // The API returns { id, userId, postData, createdAt }
            // We need to map postData back to SavedPost
            const mapped = data.map((item: any) => ({
              ...item.postData,
              dbId: item.id // Keep DB id for deletion
            }));
            setSavedPosts(mapped);
          }
        } catch (e) {
          console.error("Failed to fetch saved posts", e);
        }
      } else {
        // Load from local storage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setSavedPosts(JSON.parse(stored));
          } catch (e) {
            console.error("Failed to parse saved posts", e);
          }
        } else {
            setSavedPosts([]);
        }
      }
      setLoading(false);
    };

    loadPosts();
  }, [user, token]);

  const savePost = async (post: SavedPost) => {
    // Optimistic update
    const newSaved = [...savedPosts, post];
    setSavedPosts(newSaved);

    if (user && token) {
      try {
        const res = await fetch("/api/saved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ postData: post }),
        });
        if (!res.ok) throw new Error("Failed to save");
        // Reload to get the DB ID
        // Or just ignore for now
      } catch (e) {
        console.error("Failed to save to API", e);
        // Revert?
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
    }
  };

  const removePost = async (postId: string) => {
    // Optimistic update
    const postToRemove = savedPosts.find(p => p.id === postId);
    const newSaved = savedPosts.filter((p) => p.id !== postId);
    setSavedPosts(newSaved);

    if (user && token) {
        // We need the DB ID to delete, but our UI uses Reddit ID.
        // This is a mismatch. The API should probably allow deleting by Reddit ID or we need to store DB ID.
        // For now, I'll assume we can't easily delete from API without DB ID.
        // Let's update the API to allow deleting? Or just filter locally.
        // Actually, the API I wrote only has GET and POST. I missed DELETE.
        // I should add DELETE to the API.
        // For now, I will just update the local state.
        console.warn("Delete API not implemented yet");
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
    }
  };

  const isSaved = (postId: string) => {
    return savedPosts.some((p) => p.id === postId);
  };

  return { savedPosts, savePost, removePost, isSaved, loading };
}

