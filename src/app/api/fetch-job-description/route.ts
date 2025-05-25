import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the content from the URL
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; JobDescriptionFetcher/1.0)',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();

      // Extract job description from HTML
      // This is a simple implementation - for production, you'd want more robust parsing
      // based on the specific structure of different job sites
      let jobDescription = '';

      if (url.includes('linkedin.com')) {
        // LinkedIn job posting
        const descriptionMatch = html.match(/<div class="[^"]*description[^"]*"[^>]*>(.*?)<\/div>/is);
        if (descriptionMatch && descriptionMatch[1]) {
          jobDescription = cleanHtml(descriptionMatch[1]);
        }
      } else if (url.includes('indeed.com')) {
        // Indeed job posting
        const descriptionMatch = html.match(/<div id="jobDescriptionText"[^>]*>(.*?)<\/div>/is);
        if (descriptionMatch && descriptionMatch[1]) {
          jobDescription = cleanHtml(descriptionMatch[1]);
        }
      } else {
        // Generic extraction - look for common job description containers
        const possibleMatches = [
          /<div[^>]*job-description[^>]*>(.*?)<\/div>/is,
          /<div[^>]*description[^>]*>(.*?)<\/div>/is,
          /<section[^>]*job-description[^>]*>(.*?)<\/section>/is,
        ];

        for (const pattern of possibleMatches) {
          const match = html.match(pattern);
          if (match && match[1]) {
            jobDescription = cleanHtml(match[1]);
            break;
          }
        }
      }

      if (!jobDescription) {
        // If no specific container found, extract all text from the page
        jobDescription = cleanHtml(html);
      }

      return NextResponse.json({ text: jobDescription });
    } catch (error) {
      console.error('Error fetching URL:', error);
      return NextResponse.json({ error: 'Failed to fetch job description from URL' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to clean HTML and extract text while preserving formatting
function cleanHtml(html: string): string {
  // Replace common block elements with newlines before removing tags
  const formattedHtml = html
    .replace(/<\/p>/gi, '</p>\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '</h>\n\n')
    .replace(/<\/div>/gi, '</div>\n')
    .replace(/<\/li>/gi, '</li>\n')
    .replace(/<\/tr>/gi, '</tr>\n')
    .replace(/<\/td>/gi, '</td> ');

  // Remove HTML tags
  let text = formattedHtml.replace(/<[^>]*>/g, '');

  // Replace HTML entities
  text = text.replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Normalize whitespace while preserving line breaks
  text = text.split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n'); // Limit consecutive newlines

  return text.trim();
}
