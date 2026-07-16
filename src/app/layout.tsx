import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mwangiz Beauty Parlor Feedback",
  description: "Share your Mwangiz Beauty Parlor experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
