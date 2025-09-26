import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('[DIAG] Starting diagnostic endpoint...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 25) + '...',
    vercelRegion: process.env.VERCEL_REGION,
    vercelUrl: process.env.VERCEL_URL,
    envKeys: Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || 
      key.includes('NEON') || 
      key.includes('POSTGRES')
    )
  };

  console.log('[DIAG] Diagnostics:', diagnostics);
  
  return NextResponse.json({ 
    status: 'success',
    message: 'Diagnostic endpoint working',
    diagnostics
  });
}