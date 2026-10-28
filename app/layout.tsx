import type { Metadata, Viewport } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";

// Overpass is drawn from Highway Gothic, the lettering on US road signs.
const overpass = Overpass({ subsets: ["latin"], variable: "--font-overpass", display: "swap" });

const description =
  "Predicted battery range for the Tesla Model 3, Rivian R1T and Chevy Bolt at any outside temperature, based on EPA ratings and Recurrent's cold-weather fleet data.";

export const metadata: Metadata = {
  title: "Range by Weather",
  description,
  openGraph: { title: "Range by Weather", description, type: "website" },
  twitter: { card: "summary", title: "Range by Weather", description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#15181b" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={overpass.variable}>
      <body>{children}</body>
    </html>
  );
}
