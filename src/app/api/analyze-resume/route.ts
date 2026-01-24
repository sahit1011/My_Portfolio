import { NextRequest, NextResponse } from 'next/server';

// Increase timeout for Vercel (Pro plan allows up to 60s, Hobby is 10s)
export const maxDuration = 60; // 60 seconds for Pro plan, 10s for Hobby
export const runtime = 'nodejs';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'deepseek/deepseek-chat';
const FETCH_TIMEOUT = 55000; // 55 seconds (leave buffer for Vercel)

// Helper function to add timeout to fetch
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout: OpenRouter API took too long to respond');
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      console.error('OpenRouter API key not found in environment variables');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY in environment variables' },
        { status: 500 }
      );
    }

    console.log('Using OpenRouter API key (first 10 chars):', openRouterApiKey.substring(0, 10) + '...');

    // Reduce max_tokens to speed up response (3000 should be enough for most analyses)
    const response = await fetchWithTimeout(
      OPENROUTER_API_URL,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Resume Parser Service'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000 // Reduced from 4000 to speed up response
        })
      },
      FETCH_TIMEOUT
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content;

    if (!text) {
      return NextResponse.json(
        { error: 'No response content from OpenRouter API' },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error('Error in analyze-resume API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    // Check if it's a timeout error
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return NextResponse.json(
        { 
          error: 'Request timeout: The analysis took too long. This may be due to Vercel\'s 10-second timeout limit on the Hobby plan. Consider upgrading to Pro plan or reducing the job description length.',
          timeout: true
        },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

