import '../app/globals.css';

export const metadata = {
  title: 'Thalos — AI Performance Coach',
  description: 'AI performance coach for serious athletes. Built in Vienna.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-navy text-white">{children}</body>
    </html>
  );
}
