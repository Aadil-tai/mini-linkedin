import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  title: "Mini LinkedIn - Professional Networking",
  description: "Connect with professionals and grow your network",
  metadataBase: new URL("https://mini-linkedin.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body
        className={`${poppins.variable} font-sans antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
