"use client";

import { useState, useEffect } from "react";

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
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedPosts(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved posts", e);
      }
    }
  }, []);

  const savePost = (post: SavedPost) => {
    const newSaved = [...savedPosts, post];
    setSavedPosts(newSaved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
  };

  const removePost = (postId: string) => {
    const newSaved = savedPosts.filter((p) => p.id !== postId);
    setSavedPosts(newSaved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
  };

  const isSaved = (postId: string) => {
    return savedPosts.some((p) => p.id === postId);
  };

  return { savedPosts, savePost, removePost, isSaved };
}
