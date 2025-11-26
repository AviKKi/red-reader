import { SavedPost } from "@/hooks/use-saved-posts";

// Helper to transform Reddit raw data to our SavedPost shape
export function transformPost(child: any): SavedPost | null {
    const { data } = child;
    const { post_hint, is_video, url, id, title, permalink, media, preview } = data;

    const isImage = post_hint === "image" || url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".gif");
    const isVideo = is_video || post_hint === "hosted:video" || post_hint === "rich:video" || url.includes("redgifs.com/watch/");

    if (!isImage && !isVideo) return null;

    const width = preview?.images?.[0]?.source?.width;
    const height = preview?.images?.[0]?.source?.height;
    const thumbnail = preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&");

    // Prefer HLS URL if available, otherwise fallback to fallback_url
    let videoUrl = media?.reddit_video?.hls_url || media?.reddit_video?.fallback_url;
    
    if (!videoUrl && preview?.reddit_video_preview) {
        videoUrl = preview.reddit_video_preview.hls_url || preview.reddit_video_preview.fallback_url;
    }

    // Handle RedGifs
    let iframeUrl: string | undefined;
    if (url.includes("redgifs.com/watch/")) {
        const match = url.match(/redgifs\.com\/watch\/([a-zA-Z0-9]+)/);
        if (match && match[1]) {
            iframeUrl = `https://redgifs.com/ifr/${match[1]}?sound=true&loop=true`;
            // Force isVideo to true for RedGifs so we can handle it in the UI
        }
        console.log(iframeUrl);
    }

    return {
        id,
        title,
        url: url.replace(/&amp;/g, "&"),
        permalink,
        thumbnail,
        isVideo: !!isVideo || !!(url.includes("redgifs.com/watch/") && iframeUrl),
        videoUrl,
        iframeUrl,
        width,
        height,
    };
}
