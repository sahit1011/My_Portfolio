import { NextResponse } from 'next/server';
import { analyzeJobDescription } from '@/utils/geminiApi';

// Runs server-side only, so GEMINI_API_KEY / OPENROUTER key never ship to the client.
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text: unknown = body?.text;

    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'A job description is required.' },
        { status: 400 }
      );
    }

    // Cap input to keep prompt/token usage bounded.
    const result = await analyzeJobDescription(text.slice(0, 20000));
    return NextResponse.json(result);
  } catch (err) {
    console.error('resume-match analysis failed:', err);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
