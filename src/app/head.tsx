import Script from 'next/script';

export default function Head() {
  return (
    <>
      <title>Anil Sahith - Portfolio</title>
      <meta name="description" content="Personal portfolio of Anil Sahith, a Software Engineer, AI/ML Engineer, and Data Scientist." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <Script src="/init.js" strategy="beforeInteractive" />
    </>
  );
}
