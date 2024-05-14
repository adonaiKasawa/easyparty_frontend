import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import "../styles/globals.css";
import { cn } from "../lib/utils";
import { ThemeProvider } from "@/app/components/theme-provider"
import { siteConfig } from "../config/site";
import SiteHeader from "../components/page-header";
import { Toaster } from "../components/ui/toaster"
import { auth } from "../auth/[...nextauth]";
import { redirect } from "next/navigation";
import { authSignOutUser, findUserByIdApi } from "../lib/actions/auth";

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
  if (!session) {
    redirect("/auth/signin");
  }
  const findUser = await findUserByIdApi(session.user.sub)
  if (!findUser.hasOwnProperty('StatusCode') && !findUser?.hasOwnProperty('message')) {
    if (!findUser.confirm) {
      redirect("/auth/signin");
    }
  }else {
    await authSignOutUser()
    redirect("/auth/signin");
  }

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
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
