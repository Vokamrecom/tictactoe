import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Крестики-нолики | Играй и выигрывай промокоды!",
  description: "Играй в крестики-нолики и выигрывай промокоды на скидку!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}

