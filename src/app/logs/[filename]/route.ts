import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;

  // Validate filename to prevent directory traversal attacks
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const logsDir = path.join(process.cwd(), 'logs');
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
  } catch (error) {
    console.error(`Error reading log file ${filename}:`, error);
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
