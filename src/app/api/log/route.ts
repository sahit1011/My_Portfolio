import { NextRequest, NextResponse } from 'next/server';
import { appendLog, createAnalysisLogFile } from '@/utils/serverLogger';

export async function POST(request: NextRequest) {
  try {
    const { message, filename } = await request.json();

    if (typeof message !== 'string' || message.length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (filename !== undefined && typeof filename !== 'string') {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Rejects anything that is not a plain *.log basename.
    if (!appendLog(message, filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging to file:', error);
    return NextResponse.json({ error: 'Failed to log message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (request.nextUrl.searchParams.get('action') === 'create') {
      return NextResponse.json({ filename: await createAnalysisLogFile() });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling log request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
