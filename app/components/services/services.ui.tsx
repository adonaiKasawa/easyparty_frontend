"use client"

import React, { useState } from "react"
import { IServices } from "@/app/types/interfaces"
import {
  Card,
  CardContent,
  CardDescription,
} from "@/app/components/ui/card"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Button } from "../ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useToast } from "../ui/use-toast"
import { CreateServicesApi } from "@/app/lib/actions/services/services.req"
import { Checkbox } from "../ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"

export function CardServicesUI({ service }: { service: IServices }) {
  const router = useRouter()

  const goToRooms = () => router.push(`/rooms/details/${service.id}`)


  return <Card className="border-0 cursor-pointer shadow" onClick={goToRooms}>
    <CardContent className="p-0">
      <p>{service.name}</p>
      <CardDescription className="flex gap-2 capitalize">
        {service.description}
      </CardDescription>
    </CardContent>
  </Card>
}

export function AddServicesUI({handleFindServices}: {handleFindServices: () => Promise<void>}) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [pending, setPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [person, setPerson ] = useState<CheckedState>(false)
  const { toast } = useToast();

  const handleCreateServices = async () => {
    if (name !== "" && price !== 0 && person !== undefined) {
      setPending(true);
      const create = await CreateServicesApi({
        name, description, price, person
      })
      setPending(false);
      if (!create?.hasOwnProperty('StatusCode') && !create?.hasOwnProperty('message')) {
        toast({
          title: "Enregistré",
          description: "Le service est enregistre correctement."
        });
        setOpen(false);
        setName("")
        setDescription("")
        setPrice(0)
        setPerson(false)
        await handleFindServices()
      } else {
        let message = '';
        if (typeof create.message === "object") {
          create.message.map((item: string) => message += `${item} \n`)
        } else {
          message = create.message;
        }
        toast({
          variant: "destructive",
          title: "Erreur",
          description: message
        })
      }

    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom et le prix du service sont obligatoire!"
      })
    }

  }

  return <Dialog open={open} onOpenChange={(open) => { setOpen(open) }}>
    <DialogTrigger asChild>
      <Button>Ajouter un services</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Ajouter un services</DialogTitle>
        <DialogDescription>
          Ajouter des services à votre compte ici. Cliquez sur Enregistrer lorsque vous avez terminé.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nom du services
          </Label>
          <Input id="name" value={name} onChange={(e) => { setName(e.target.value) }} className="col-span-3" />
        </div>
        <div className="items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description du services
          </Label>
          <Input id="description" value={description} onChange={(e) => { setDescription(e.target.value) }} className="col-span-3" />
        </div>
        <div className="items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Prix du services
          </Label>
          <Input id="price" value={price} onChange={(e) => { setPrice(parseInt(e.target.value)) }} className="col-span-3" type="number" />
        </div>
        <div className="flex items-top flex space-x-2">
          <Checkbox 
           checked={person}
           onCheckedChange={(c) => {setPerson(c)}}
          id="terms1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Par personne
            </label>
            <p className="text-sm text-muted-foreground">
              Le prix du service sera multiplier par le nombre de personne des l'événement.
            </p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={pending}
          onClick={(e) => {
            e.preventDefault();
            handleCreateServices();
          }}
          type="submit"
        >
          {pending ? <ReloadIcon className="animate-spin" /> : "Enregistrer"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}