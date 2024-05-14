"use client";

import React, { use, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { capitalize } from "@/app/config/tools";
import { PowerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { authSignOutUser, authSignUpUser, updateUserApi } from "@/app/lib/actions/auth";
import { Button } from "../ui/button";
import { Session } from "next-auth/types";
import { useToast } from "../ui/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Pending } from "../pending";
import { CreateUserDto, IUser, PayloadUserInterface } from "@/app/types/interfaces";

export function DropdownMenuDemo({ session }: { session: Session }) {
  const [open, setOpen] = useState<boolean>(false);

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
    <>
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
            <DropdownMenuItem onClick={() => { setOpen(true) }}>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            {user.privilege_user === PrivilegesEnum.SAO &&
              <DropdownMenuItem onClick={() => { router.push('/user'); }}>
                Utilisateur
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
            }
          </DropdownMenuGroup>
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
      <UpdateUserDialog open={open} setOpen={setOpen} user={user} handleFindUser={async () => { }} />

    </>

  )
}


export function UpdateUserDialog({ user, handleFindUser, open, setOpen }: { user: PayloadUserInterface, handleFindUser: () => Promise<void>, setOpen: React.Dispatch<React.SetStateAction<boolean>>, open: boolean }) {
  const [pending, setPending] = useState<boolean>(false);

  const [nom, setNom] = useState<string>(user.name);
  const [prenom, setPrenom] = useState<string>(user.prenom);
  const [email, setEmail] = useState<string>(user.email);
  const [telephone, setTelephone] = useState<string>(user.telephone)

  const [oldPassword, setOldPasssword] = useState<string>()
  const [newPasssword, setNewPassword] = useState<string>()
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>()

  const { toast } = useToast();

  const handleUpdateUser = async () => {
    let updateDto: Partial<CreateUserDto> = {}
    updateDto = {
      nom,
      prenom,
      email,
      telephone,
    }
    if (oldPassword && newPasssword && confirmNewPassword) {
      if (newPasssword === confirmNewPassword) {
        updateDto.password = newPasssword
      } else {
        toast({
          variant: 'destructive',
          title: 'Mot de passe',
          description: 'Le nouveau mot de passe et la confirmation du nouveau mot de passe doivent être indetique.'
        })
        return 0;
      }
    }
    console.log(updateDto);
    setPending(true);
    const update = await updateUserApi(updateDto, user.sub);
    setPending(false);

    if (!update?.hasOwnProperty('StatusCode') && !update?.hasOwnProperty('message')) {
      await handleFindUser();
      toast({
        title: "Modification réussi",
        description: "La modification de l'utilisatuer se passe avec succès. \n Penser à vous deconnecter et vous reconneter pour synchroniser les changement apporter à votre compte.",
      })
    } else {
      let message = '';
      if (typeof update.message === "object") {
        update.message.map((item: string) => message += `${item} \n`)
      } else {
        message = update.message;
      }
      toast({
        variant: "destructive",
        title: "Modification échoue",
        description: message,
      })
    }
  }

  return <Dialog open={open} onOpenChange={(open) => { setOpen(open) }}>
    <DialogContent className="w-full">
      <DialogHeader>
        <DialogTitle>Modifier votre profie</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div>
          <Label>Nom</Label>
          <Input placeholder="Nom de  l'utilisateur" type="text" value={nom} onChange={(e) => { setNom(e.target.value) }} />
        </div>
        <div>
          <Label>Prénom</Label>
          <Input placeholder="Prénom de  l'utilisateur" type="text" value={prenom} onChange={(e) => { setPrenom(e.target.value) }} />
        </div>
        <div>
          <Label>Email</Label>
          <Input placeholder="Email de  l'utilisateur" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
        </div>
        <div>
          <Label>Téléphone</Label>
          <p className="text-xs text-neutral-500 mb-2">(comment par le code du pays: exemple (+243, +242))</p>
          <Input placeholder="Téléphone de  l'utilisateur" type="email" value={telephone} onChange={(e) => { setTelephone(e.target.value) }} />
        </div>
        <hr />
        <div>
          <Label>Ancient mot de passe</Label>
          <Input placeholder="Ancient mot de passe" type="password" value={oldPassword} onChange={(e) => { setOldPasssword(e.target.value) }} />
        </div>
        <div>
          <Label>Nouveau mot de passe</Label>
          <Input placeholder="Nouveau mot de passe" type="password" value={newPasssword} onChange={(e) => { setNewPassword(e.target.value) }} />
        </div>
        <div>
          <Label>Confirmer le nouveau mot de passe</Label>
          <Input placeholder="Confirmer le nouveau mot de passe" type="password" value={confirmNewPassword} onChange={(e) => { setConfirmNewPassword(e.target.value) }} />
        </div>

      </div>
      <DialogFooter>
        <Button
          disabled={pending}
          onClick={(e) => {
            e.preventDefault();
            handleUpdateUser();
          }}
          type="submit"
        >
          {pending ? <Pending /> : "Modifier"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}