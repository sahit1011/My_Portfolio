import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  const logsDir = path.join(process.cwd(), 'logs');

  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
    } catch {
      return NextResponse.json({ error: 'Failed to create logs directory' }, { status: 500 });
    }
  }

  if (action === 'create') {
    const date = new Date();
    const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
    const filename = `analysis_${timestamp}.log`;

    // Create the file with a header
    const logFilePath = path.join(logsDir, filename);
    const header = `=== AI RESUME MATCH ANALYSIS LOG - ${date.toLocaleString()} ===\n\n`;
    fs.writeFileSync(logFilePath, header);

    return NextResponse.json({ filename });
  } else if (action === 'list') {
    // List all log files
    try {
      const files = fs.readdirSync(logsDir)
        .filter(file => file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: `/api/logs?file=${file}`,
          created: fs.statSync(path.join(logsDir, file)).birthtime
        }))
        .sort((a, b) => b.created.getTime() - a.created.getTime());

      return NextResponse.json({ files });
    } catch {
      return NextResponse.json({ error: 'Failed to list log files' }, { status: 500 });
    }
  } else if (searchParams.has('file')) {
    // Get content of a specific log file
    const filename = searchParams.get('file');

    // Validate filename to prevent directory traversal attacks
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filePath = path.join(logsDir, filename);

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }

      // Read file content
      const content = fs.readFileSync(filePath, 'utf-8');

      // Return file content as text
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `inline; filename="${filename}"`,
        },
      });
    } catch {
      return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const { message, filename } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const logsDir = path.join(process.cwd(), 'logs');

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      try {
        fs.mkdirSync(logsDir, { recursive: true });
      } catch {
        return NextResponse.json({ error: 'Failed to create logs directory' }, { status: 500 });
      }
    }

    const date = new Date();
    const defaultFilename = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`;
    const logFilePath = path.join(logsDir, filename || defaultFilename);

    // Create timestamp for the log entry
    const timestamp = `[${date.toISOString()}]`;
    const logEntry = `${timestamp} ${message}\n`;

    // Append to the log file
    fs.appendFileSync(logFilePath, logEntry);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to log message' }, { status: 500 });
  }
}
