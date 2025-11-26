import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (verificationToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { isVerified: true },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Redirect to login or success page
    return NextResponse.redirect(new URL('/?verified=true', request.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
