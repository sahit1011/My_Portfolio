import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log(`Created logs directory at ${logsDir}`);
  } catch (error) {
    console.error(`Failed to create logs directory: ${error}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, filename } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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
  } catch (error) {
    console.error('Error logging to file:', error);
    return NextResponse.json({ error: 'Failed to log message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    
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
      const files = fs.readdirSync(logsDir)
        .filter(file => file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: `/logs/${file}`,
          created: fs.statSync(path.join(logsDir, file)).birthtime
        }))
        .sort((a, b) => b.created.getTime() - a.created.getTime());
      
      return NextResponse.json({ files });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling log request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
