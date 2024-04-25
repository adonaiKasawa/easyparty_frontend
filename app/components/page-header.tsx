"use server";

import Link from "next/link"

import { siteConfig } from "@/app/config/site"
import { Button, buttonVariants } from "@/app/components/ui/button"
import { Icons } from "@/app/components/icons"
import { MainNav } from "@/app/components/main-nav"
import { ModeToggle } from "@/app/components/theme-mode-toggle"
import { PowerIcon, UserIcon } from "lucide-react"
import { auth, signOut } from "../(core)/auth/[...nextauth]"
import { redirect } from "next/navigation"
import { DropdownMenuDemo } from "./profile/avatar.user.ui";

export default async function SiteHeader() {
  const session = await auth()

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {session ? <DropdownMenuDemo session={session} /> :
              <Link href={"/auth/signin"}>
                <Button className="font-bold" variant="outline">
                  <UserIcon className="mr-2 h-4 w-4" /> Se connecter
                </Button>
              </Link>}

            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}