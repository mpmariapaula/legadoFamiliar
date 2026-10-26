import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legado Familiar | Nossa História",
  description:
    "Preserve a história, as memórias e as gerações da sua família em um só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
