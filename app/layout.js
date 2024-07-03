"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

// export const metadata = {
//   title: "DeRaffle",
//   description: "Decentralized raffle platform",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <body className={inter.className}>{children}</body>
        </ThirdwebProvider>
      </QueryClientProvider>
    </html>
  );
}
