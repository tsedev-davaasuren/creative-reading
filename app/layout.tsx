import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Бүтээлч уншлага-2 | PISA Mentor",
  description: "PISA шалгалтын жишиг даалгавар боловсруулах веб систем",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}