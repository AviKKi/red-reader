import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-secret';

async function getUser(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  const userId = await getUser(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(savedPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = await getUser(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { postData } = await request.json();
    if (!postData) {
      return NextResponse.json({ error: 'Post data is required' }, { status: 400 });
    }

    const savedPost = await prisma.savedPost.create({
      data: {
        userId,
        postData,
      },
    });

    return NextResponse.json(savedPost);
  } catch (error) {
    console.error('Save post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
