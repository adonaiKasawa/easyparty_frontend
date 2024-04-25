"use client"
import { auth, signOut } from "@/app/(core)/auth/[...nextauth]";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { capitalize } from "@/app/config/tools";
import { PowerIcon, icons } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { authSignOutUser } from "@/app/lib/actions/auth";
import { Button } from "../ui/button";
import { Session } from "next-auth/types";

export function DropdownMenuDemo({ session }: { session: Session }) {
  const router = useRouter();
  if (!session) {
    router.push('/auth/signin')
  }
  const { user } = session
  const avatar = [{
    id: user.sub,
    name: capitalize(`${user.prenom} ${user.name}`),
    designation: user.privilege_user === PrivilegesEnum.PSF ? "propriétaire de salles de fêtes" : "client",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  }]

  const handleLogOut = async () => {
    await authSignOutUser()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="cursor-pointer">
          <AnimatedTooltip className=" ml-4 relative" size="xs" items={avatar} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{capitalize(user.prenom)} {capitalize(user.name)}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Facturation
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form onSubmit={async (e) => {
            e.preventDefault();
            await handleLogOut();
            // router.push('/auth/signin');
            document.location = "/auth/signin";
          }}>
            <Button className="flex justify-center items-center gap-2" variant={"ghost"} type="submit">
              <PowerIcon size={20} />
              Log out
            </Button>
          </form>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
