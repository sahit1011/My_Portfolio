import { redirect } from 'next/navigation';

// The resume tool moved to /resume-match (redesigned + server-side analysis).
// Keep this path working for any existing/shared links.
export default function ResumeParserRedirect() {
  redirect('/resume-match');
}
