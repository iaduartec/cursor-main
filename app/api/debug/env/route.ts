import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    timestamp: new Date().toISOString()
  });
}