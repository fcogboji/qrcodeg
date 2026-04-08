import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { widgetDataAttributes } from "@/config/widget";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QR code generator — QR Brand Studio",
    template: "%s · QR Brand Studio",
  },
  description:
    "Free QR code generator: links, Wi‑Fi, contacts, SMS, email, and custom colours. Save brand palettes per customer, export PNG/SVG, copy to clipboard, and use the REST API.",
  openGraph: {
    title: "QR Brand Studio — QR code generator",
    description:
      "Create scannable QR codes for URLs, Wi‑Fi, vCard contacts, and more. Brand colours, print-ready sizes, and an API for your product.",
    type: "website",
  },
};

/** Same-origin proxy only — never point this at the third-party `/embed/widget-js` URL. */
const widgetScriptSrc =
  process.env.NEXT_PUBLIC_WIDGET_EMBED_PATH?.trim() || "/embed/widget-js";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <AuthSessionProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </AuthSessionProvider>
      
      </body>
    </html>
  );
}
