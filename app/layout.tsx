import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thalos",
  description: "Thalos – Smart training for partner gyms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
