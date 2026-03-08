import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minimal Flashcards",
  description: "A simple spaced repetition study tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Add suppressHydrationWarning right here! */}
      <body
        suppressHydrationWarning
        className={`${inter.className} bg-zinc-50 text-zinc-900 min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
