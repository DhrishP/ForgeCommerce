import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecomm_Admin",
  description: "Admin page for supporting e-commerce pages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <ClerkProvider>
      <html lang="en" >
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider/>
          <ModalProvider />
          {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
