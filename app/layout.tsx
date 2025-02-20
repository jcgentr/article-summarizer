import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: `Gistr${process.env.NODE_ENV === "development" ? " | Dev" : ""}`,
  description:
    "Transform lengthy web articles into clear, concise summaries with AI. Save time and stay informed with Gistr's Chrome extension and web app.",
  keywords: [
    "article summarizer",
    "AI summary",
    "web article",
    "chrome extension",
    "reading assistant",
  ],
  openGraph: {
    title: "Gistr - Get the gist of any web article",
    description:
      "Transform lengthy web articles into clear, concise summaries with AI",
    type: "website",
    url: "https://app.getgistr.com/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gistr",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gistr - Get the gist of any web article",
    description:
      "Transform lengthy web articles into clear, concise summaries with AI",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
