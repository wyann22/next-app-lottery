"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "DeRaffle",
//   description: "Decentralized raffle platform",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThirdwebProvider>
        <body className={inter.className}>{children}</body>
      </ThirdwebProvider>
    </html>
  );
}
