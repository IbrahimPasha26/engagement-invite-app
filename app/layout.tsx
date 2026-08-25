import type { Metadata } from "next";
import { Playfair_Display, Great_Vibes, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Ibrahim 🤍 Jaweriya",
  description: "Engagement Ceremony Invitation for Ibrahim Pasha J & Jaweriya Mohammadi",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${greatVibes.variable} ${montserrat.variable} antialiased bg-[#030e0a] text-gray-100 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}