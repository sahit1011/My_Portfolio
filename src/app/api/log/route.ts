import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
// Note: On Vercel/serverless, file system is read-only except /tmp
// Logging will fall back to console.log in production
const isVercel = process.env.VERCEL === '1';
const logsDir = isVercel ? '/tmp/logs' : path.join(process.cwd(), 'logs');

if (!isVercel) {
  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
      console.log(`Created logs directory at ${logsDir}`);
    } catch (error) {
      console.error(`Failed to create logs directory: ${error}`);
    }
  }
} else {
  // On Vercel, try to create /tmp/logs if possible
  try {
    if (!fs.existsSync('/tmp/logs')) {
      fs.mkdirSync('/tmp/logs', { recursive: true });
    }
  } catch {
    // Silently fail - logging will use console.log instead
    console.log('File logging not available on Vercel, using console.log');
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
    
    try {
      // Try to append to log file
      fs.appendFileSync(logFilePath, logEntry);
    } catch {
      // On Vercel or if file system fails, use console.log instead
      console.log(`[LOG:${filename || 'default'}] ${message}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Even if file logging fails, log to console
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`[LOG ERROR] Failed to log message: ${errorMessage}`);
    return NextResponse.json({ success: true }); // Return success to not break the flow
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
      
      try {
        fs.writeFileSync(logFilePath, header);
      } catch {
        // On Vercel, file logging might not work, but we still return filename
        // The logging will use console.log instead
        console.log(`[LOG CREATE] ${filename} - File logging not available, using console`);
      }
      
      return NextResponse.json({ filename });
    } else if (action === 'list') {
      // List all log files
      try {
        if (!fs.existsSync(logsDir)) {
          return NextResponse.json({ files: [] }); // Return empty if directory doesn't exist
        }
        
        const files = fs.readdirSync(logsDir)
          .filter(file => file.endsWith('.log'))
          .map(file => ({
            name: file,
            path: `/logs/${file}`,
            created: fs.statSync(path.join(logsDir, file)).birthtime
          }))
          .sort((a, b) => b.created.getTime() - a.created.getTime());
        
        return NextResponse.json({ files });
      } catch {
        // On Vercel, file listing might not work
        console.log('File listing not available on Vercel');
        return NextResponse.json({ files: [] });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling log request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
