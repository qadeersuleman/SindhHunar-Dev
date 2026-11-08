import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const bebasNeue = localFont({
  src: "../public/fonts/BebasNeue-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sindh Hunar | Authentic Sindhi Heritage Crafts & Artisans",
  description: "Explore and buy authentic handcrafted Sindhi Ajraks, Royal Topis, Ralli Quilts, and Mirror Work directly from indigenous artisans.",
  keywords: ["Sindh Hunar", "Sindhi Ajrak", "Sindhi Topi", "Ralli Quilt", "Sindhi Crafts", "Handicrafts Pakistan"],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${bebasNeue.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#1A1A1A] selection:bg-[#800000] selection:text-white font-sans">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
