import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });

export const metadata: Metadata = {
  title: "Smart Community Notification System | Bugesera District",
  description:
    "Prototype for preparing, approving, publishing and following up official community notices in Bugesera District.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${publicSans.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}