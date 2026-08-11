import { NextRequest, NextResponse } from 'next/server';
import { appendLog, createAnalysisLogFile, listLogFiles, readLogFile } from '@/utils/serverLogger';

// Analysis logs contain the full prompt — the site owner's resume and contact
// details, plus whatever job description a visitor pasted. Reading and listing
// them is a local debugging aid, not something to serve publicly, and the /logs
// page's password prompt is client-side only so it gates nothing on its own.
const logsReadable = process.env.NODE_ENV !== 'production';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  try {
    if (action === 'create') {
      return NextResponse.json({ filename: await createAnalysisLogFile() });
    }

    if (action === 'list') {
      if (!logsReadable) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ files: listLogFiles() });
    }

    if (searchParams.has('file')) {
      if (!logsReadable) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      const filename = searchParams.get('file') as string;
      const content = readLogFile(filename);

      if (content === null) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }

      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling logs request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, filename } = await request.json();

    if (typeof message !== 'string' || message.length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (filename !== undefined && typeof filename !== 'string') {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    if (!appendLog(message, filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging to file:', error);
    return NextResponse.json({ error: 'Failed to log message' }, { status: 500 });
  }
}
