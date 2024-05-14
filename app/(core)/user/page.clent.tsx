"use client";

import { Label } from "@/app/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { IUser } from "@/app/types/interfaces";
import clsx from "clsx";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";
import { Pending } from "@/app/components/pending";
import { authSignUpUser, findUserByPrivilegeApi, updateUserApi } from "@/app/lib/actions/auth";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/components/ui/use-toast";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

export default function UserClientPage({ initData }: { initData: IUser[] }) {
  const [user, setUser] = useState(initData);

  const handleFindUser = async () => {
    let findUser: IUser[] = await findUserByPrivilegeApi(PrivilegesEnum.PSF);
    if (!findUser?.hasOwnProperty('StatusCode') && !findUser?.hasOwnProperty('message')) {
      setUser(findUser)
    }
  }

  return <main className="container px-24 py-8">
    <p className="text-7xl font-bold my-8">Utilisateurs</p>
    <div className="flex justify-end my-8">
      <CreateUserDialog handleFindUser={handleFindUser} />
    </div>
    <Table>
      <TableHeader className="">
        <TableRow>
          <TableHead className="w-[100px] border-r border-r-nutralle-500 text-black dark:text-white text-xl">#</TableHead>
          <TableHead className="border-r border-r-nutralle-500 text-black dark:text-white text-xl">Nom</TableHead>
          <TableHead className="border-r border-r-nutralle-500 text-black dark:text-white text-xl">Télephone</TableHead>
          <TableHead className="border-r border-r-nutralle-500 text-black dark:text-white text-xl">Email</TableHead>
          <TableHead className="border-r border-r-nutralle-500 text-black dark:text-white text-xl">Statut</TableHead>
          <TableHead className="text-black dark:text-white text-xl">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {user.map((item, index) =>
          <TableRow key={index} className={clsx("", {
            "bg-blue-200 dark:bg-gray-800": index % 2
          })}>
            <TableCell className="border-r border-r-nutralle-500 font-medium">{index + 1}</TableCell>
            <TableCell className="border-r border-r-nutralle-500">{item.nom} {item.prenom}</TableCell>
            <TableCell className="border-r border-r-nutralle-500">{item.telephone}</TableCell>
            <TableCell className="border-r border-r-nutralle-500">{item.email}</TableCell>
            <TableCell className="border-r border-r-nutralle-500">{item.confirm ? "actif" : "inactif"}</TableCell>
            <TableCell className="text-right">
              <Action user={item} handleFindUser={handleFindUser} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </main>
}


export function CreateUserDialog({ handleFindUser }: { handleFindUser: () => Promise<void> }) {
  const [pending, setPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("")

  const { toast } = useToast();

  const handleCreateUser = async () => {
    const create = await authSignUpUser({
      nom,
      prenom,
      email,
      telephone,
      privilege: PrivilegesEnum.PSF,
      password: `${nom}_${prenom}`
    });
    if (!create?.hasOwnProperty('StatusCode') && !create?.hasOwnProperty('message')) {
      await handleFindUser();
      toast({
        title: "Enregistrement réussi",
        description: "L'enregistrement de l'utilisatuer se passe avec succès.",
      })
    } else {
      let message = '';
      if (typeof create.message === "object") {
        create.message.map((item: string) => message += `${item} \n`)
      } else {
        message = create.message;
      }
      toast({
        variant: "destructive",
        title: "Enregistrement échoue",
        description: message,
      })
    }
  }

  return <Dialog open={open} onOpenChange={(open) => { setOpen(open) }}>
    <DialogTrigger asChild>
      <Button>Créer un Utilisateur</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Créer un utilisateur</DialogTitle>
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
        <div>
          <p>Mot de passe de l'utilisateur est: </p>
          <p className="font-bold" >{nom}_{prenom}</p>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={pending}
          onClick={(e) => {
            e.preventDefault();
            handleCreateUser();
          }}
          type="submit"
        >
          {pending ? <Pending /> : "Créez"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}

export function Action({ user, handleFindUser }: { user: IUser, handleFindUser: () => Promise<void> }) {
  const { toast } = useToast();

  const handleUpdateUser = async () => {
    const update = await updateUserApi({
      confirm: !user.confirm
    }, user.id);
    if (!update?.hasOwnProperty('StatusCode') && !update?.hasOwnProperty('message')) {
      await handleFindUser();
      toast({
        title: "Modification",
        description: 'La modification se bien passé'
      })
    } else {
      toast({
        variant: 'destructive',
        title: "Modification",
        description: 'La modification à échouée'
      })
    }
  }


  return <div className="flex justify-end">
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden sm:flex">
        <Button size="icon" variant="ghost">
          <DotsVerticalIcon className="text-default-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Table Columns">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => { handleUpdateUser() }}>
            {user.confirm ? "Bloquer" : "Débloquer"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { }}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
}