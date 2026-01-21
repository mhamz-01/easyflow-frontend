import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import TanstackClientProvider from "@/src/providers/TanstackClientProvider";
import { Toaster } from "../components/shadcn/sonner";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyFlow - Built for teams who want clarity",
  description:
    "Built for teams who want clarity, speed, and focus. Your projects, tasks, documents, and whiteboards, all in one place. Collaborate smarter and let AI help you move faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${redHatDisplay.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TanstackClientProvider>{children}</TanstackClientProvider>
          </ThemeProvider>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
