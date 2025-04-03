# Personal Portfolio with Resume Match Analyzer

This is a personal portfolio website built with Next.js that includes a Resume Match Analyzer powered by Google's Gemini API. The analyzer helps recruiters see how well my profile matches their job requirements.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Setting Up the Gemini API

The Resume Match Analyzer uses Google's Gemini API to analyze job descriptions and compare them to the candidate's resume. To set up the API:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) and create an account if you don't have one.
2. Create a new API key.
3. Create a `.env.local` file in the root directory of the project.
4. Add your API key to the `.env.local` file:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

5. Restart the development server if it's already running.

If you don't set up the API key, the Resume Match Analyzer will fall back to a simulated response.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about the Gemini API, check out:

- [Google AI Studio](https://makersuite.google.com/) - create and experiment with prompts.
- [Gemini API Documentation](https://ai.google.dev/docs) - learn about the Gemini API.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
