import type { Metadata } from "next";
import { Poppins, Bebas_Neue, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const nastaliq = Noto_Nastaliq_Urdu({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-sindhi",
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
    <html lang="en" className={`${poppins.variable} ${bebasNeue.variable} ${nastaliq.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#1A1A1A] selection:bg-[#800000] selection:text-white">
        {children}
      </body>
    </html>
  );
}
