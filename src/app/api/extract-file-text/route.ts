import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }
    
    // Get file extension
    const fileName = file.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    
    if (!fileExt || !['pdf', 'doc', 'docx', 'txt'].includes(fileExt)) {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a PDF, Word document, or text file.' },
        { status: 400 }
      );
    }
    
    // Create a temporary file path
    const tempFilePath = join('/tmp', `upload_${Date.now()}_${fileName}`);
    
    // Convert the file to a Buffer and write it to the temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempFilePath, buffer);
    
    let text = '';
    
    // Extract text based on file type
    try {
      if (fileExt === 'txt') {
        // For text files, read the content directly
        const { stdout } = await execAsync(`cat "${tempFilePath}"`);
        text = stdout;
      } else if (fileExt === 'pdf') {
        // For PDF files, use pdftotext (requires poppler-utils)
        // Note: In a production environment, you'd need to ensure poppler-utils is installed
        const { stdout } = await execAsync(`pdftotext "${tempFilePath}" -`);
        text = stdout;
      } else if (fileExt === 'doc' || fileExt === 'docx') {
        // For Word documents, use antiword or catdoc (requires these tools)
        // Note: In a production environment, you'd need to ensure these tools are installed
        const command = fileExt === 'doc' 
          ? `antiword "${tempFilePath}"` 
          : `docx2txt "${tempFilePath}" -`;
        
        const { stdout } = await execAsync(command);
        text = stdout;
      }
      
      // Clean up the temporary file
      await execAsync(`rm "${tempFilePath}"`);
      
      if (!text.trim()) {
        throw new Error('Failed to extract text from file');
      }
      
      return NextResponse.json({ text });
    } catch (error: unknown) {
      console.error('Error extracting text:', error);
      
      // Return an error response instead of error text as content
      // This prevents the error message from being used as job description
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's a missing tool error
      if (errorMessage.includes('command not found') || errorMessage.includes('pdftotext')) {
        return NextResponse.json(
          { 
            error: 'PDF extraction tool not available. Please install poppler-utils (pdftotext) or copy and paste the job description text directly.',
            suggestion: 'For best results, copy the text from the job description and paste it in the text input tab.'
          },
          { status: 500 }
        );
      }
      
      // For other errors, return a generic error
      return NextResponse.json(
        { 
          error: 'Failed to extract text from file. Please try copying and pasting the text directly.',
          suggestion: 'Copy the job description text and paste it in the text input tab for best results.'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
