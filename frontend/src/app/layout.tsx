import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AWS Route53 Clone",
  description: "A functional clone of AWS Route53",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body className={inter.className} style={{ background: "#f2f3f3", color: "#16191f" }}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
