import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import "../styles/globals.css";
import { ThemeProvider } from "@/app/components/theme-provider"
import { redirect } from "next/navigation";
import { siteConfig } from "@/app/config/site";
import { auth } from "./[...nextauth]";
import { cn } from "@/app/lib/utils";
import { Toaster } from "@/app/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
