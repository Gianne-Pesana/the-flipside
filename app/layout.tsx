import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GridBackground from "./components/GridBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Flipside",
  description:
    "A space repition tool to improve memory because I have none of that",
  icons: {
    icon: "/icon.png", // Leading slash is important
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.className} bg-[#09090b] text-[#fafafa] min-h-screen antialiased selection:bg-zinc-800 selection:text-white`}
      >
        <GridBackground />
        <div className="relative z-0">{children}</div>
      </body>
    </html>
  );
}
