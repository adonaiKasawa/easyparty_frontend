"use client"

import { LabelInputContainer } from "@/app/components/auth/signin/signin.ui"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"
import { CreateRoomsApi } from "@/app/lib/actions/rooms/rooms.req"
import { ReloadIcon } from "@radix-ui/react-icons"
import { ImagePlus } from "lucide-react"
import { useState } from "react"

export default function CreateRooms() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [visualsRoom, setVisualsRoom] = useState<FileList>()
  const [pending, setPending] = useState<boolean>(false);

  const { toast } = useToast()

  const handleOnChange = async (event: React.ChangeEvent) => {
    const { files } = event.target as HTMLInputElement;
    console.log("files", files?.length);
    if (files && files.length !== 0) {
      if (files.length <= 15) {
        setVisualsRoom(files);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "La limite est de 15 images par salle"
        })
      }
    }
  };

  const handelCreateRooms = async () => {
    if (name !== "" && capacity !== 0 && price !== 0) {
      if (visualsRoom && visualsRoom?.length !== 0) {
        setPending(true);
        const formdata = new FormData()
        formdata.append("name", name);
        formdata.append("description", description);
        formdata.append("capacity", capacity.toString());
        for (let i = 0; i < visualsRoom.length; i++) {
          const element = visualsRoom[i];
          formdata.append("files", element)
        }
        const create = await CreateRoomsApi(formdata, price)
        setPending(false)
        if (!create?.hasOwnProperty('StatusCode') && !create?.hasOwnProperty('message')) {
          toast({
            title: "Enregistement réussi",
            description: "L'enregistrement de la salle a été effectuée avec succès."
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
            title: "Erreur",
            description: message
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Enregistre aumoin une image pour cette salle."
        })
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom, la capacité et le prix de la salle sont obligatoire!"
      })
    }
  }

  return <main className="container mx-auto px-24 py-8">
    <Card>
      <CardHeader>
        <CardTitle>
          <p>Enregistre une nouvelle salle de fête</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full grid gap-4 py-4">
          <div className="flex gap-4">
            <LabelInputContainer>
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Nom de la salle" type="text" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="tel">Description</Label>
              <Input id="description" value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder="Description" type="text" />
            </LabelInputContainer>
          </div>
          <div className="flex gap-4">
            <LabelInputContainer className="">
              <Label htmlFor="tel">Capacité</Label>
              <Input id="capacite" value={capacity} onChange={(e) => { setCapacity(parseInt(e.target.value)) }} placeholder="nombre max de personne" type="number" />
            </LabelInputContainer>
            <LabelInputContainer className="">
              <Label htmlFor="tel">Prix</Label>
              <Input id="prix" value={price} onChange={(e) => { setPrice(parseInt(e.target.value)) }} placeholder="Prix" type="number" />
            </LabelInputContainer>
          </div>
          {/* <div className="flex gap-4">
              <LabelInputContainer>
                <Label htmlFor="tel">Adresse</Label>
                <Input id="adresse" placeholder="no" type="text" />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="tel">Ville</Label>
                <Input id="capacite" placeholder="no" type="number" />
              </LabelInputContainer>
            </div> */}
          {/* <div className="flex gap-4">
              <LabelInputContainer>
                <Label htmlFor="tel">Pays</Label>
                <Input id="capacite" placeholder="no" type="number" />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="tel">Equipement</Label>
                <Label className="text-neutral-500">separele les Equipement pas un point virgule (;)</Label>
                <Input id="capacite" placeholder="no" type="number" />
              </LabelInputContainer>
            </div> */}
          <div className="grid grid-cols-3 flex gap-8 items-center justify-center ">
            <LabelInputContainer>
              <Label htmlFor="file" className="flex flex-col gap-4 border w-96 h-44 text-center items-center justify-center rounded-lg" >
                <ImagePlus />
                <p>
                  AJOUTER DES IMAGES
                </p>
                <p>Selelctionner les images de la salle </p>
                <span className="hidden">
                  <Input id="file" multiple accept="image/*" onChange={handleOnChange} type="file" className="hidden" />
                </span>
              </Label>
            </LabelInputContainer>
            {(visualsRoom && visualsRoom.length > 0) &&
              <div className="flex w-full h-10 items-center justify-center border rounded-md border-blue-500 bg-foreground">
                <p className="text-background">Vous avez sélectionner {visualsRoom.length}</p>
              </div>
            }
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          className="p-6"
          disabled={pending}
          onClick={(e) => {
            e.preventDefault();
            handelCreateRooms();
          }}
        >
          {pending ? <ReloadIcon className="animate-spin" /> : " Enregistrez la salle"}
        </Button>
      </CardFooter>
    </Card>
  </main>
}