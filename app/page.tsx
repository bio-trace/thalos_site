import Link from 'next/link';

export default function RootRedirect() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <html lang="de">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${base}/de/`} />
        <link rel="canonical" href={`${base}/de/`} />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="text-body text-steel mb-4">Redirecting…</p>
          <div className="flex gap-4 justify-center">
            <Link href="/de/" className="text-cyan underline">Deutsch</Link>
            <Link href="/en/" className="text-cyan underline">English</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
