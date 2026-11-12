import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFC TapTrack | Lost & Found",
  description: "Keep campus belongings connected to their owners with NFC TapTrack.",
  icons: { icon: "/taptrack-icon.svg", shortcut: "/taptrack-icon.svg", apple: "/taptrack-icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
