import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sub: string }> }
) {
  const { sub } = await params;
  
  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after");
  const sort = searchParams.get("sort") || "hot";
  const t = searchParams.get("t");
  
  if (!sub) {
    return NextResponse.json({ error: "Subreddit is required" }, { status: 400 });
  }

  try {
    // Reddit API: /r/[sub]/[sort].json
    const url = new URL(`https://www.reddit.com/r/${sub}/${sort}.json`);
    
    if (after) {
      url.searchParams.set("after", after);
    }
    if (t && (sort === "top" || sort === "controversial")) {
      url.searchParams.set("t", t);
    }

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "web:redreader:v1.0.0 (by /u/redreader_dev)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch subreddit: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching subreddit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
