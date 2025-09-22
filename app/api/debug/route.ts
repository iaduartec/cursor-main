import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    SKIP_CONTENTLAYER: process.env.SKIP_CONTENTLAYER || 'NOT SET',
    VERCEL: process.env.VERCEL || 'NOT SET',
  };

  return NextResponse.json({
    message: 'Environment variables status',
    envVars,
    timestamp: new Date().toISOString(),
  });
}
