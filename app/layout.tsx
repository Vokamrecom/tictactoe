import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}

