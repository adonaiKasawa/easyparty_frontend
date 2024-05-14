"use client"

import { LabelInputContainer } from "@/app/components/auth/signin/signin.ui"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"
import { authSignUpUser } from "@/app/lib/actions/auth"
import { CreateRoomsApi } from "@/app/lib/actions/rooms/rooms.req"
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum"
import { ReloadIcon } from "@radix-ui/react-icons"
import { ImagePlus } from "lucide-react"
import { useState } from "react"
import { set } from "zod"

export default function CreateRooms() {
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("")
  const [ville, setVille] = useState<string>("")
  const [adresse, setAdresse] = useState<string>("")
  const [pays, setPays] = useState<string>("RDC")

  const [pending, setPending] = useState<boolean>(false);

  const { toast } = useToast()



  const handleSubmit = async () => {
    setPending(true);
    const signUpUser = await authSignUpUser({
      nom,
      prenom,
      telephone,
      email,
      password: `${nom}_123456`,
      privilege: PrivilegesEnum.CLT,
      ville,
      adresse,
    });
    setPending(false);
    console.log(signUpUser);

    if (!signUpUser.hasOwnProperty('StatusCode') && !signUpUser.hasOwnProperty('message')) {
      toast({
        title: "Enregistrement réussi",
        description: "L'enregistrement du client se passe avec succès.",
      });
    } else {
      let message = '';
      if (typeof signUpUser.message === "object") {
        signUpUser.message.map((item: string) => message += `${item} \n`)
      } else {
        message = signUpUser.message;
      }
      toast({
        variant: "destructive",
        title: "Enregistrement échoue",
        description: message,
      })
    }
  };


  return <main className="container mx-auto px-24 py-8">
    <Card>
      <CardHeader>
        <CardTitle>
          <p>Enregistre un nouveaux client</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full grid gap-4 py-4">
          <div className="flex gap-4">
            <LabelInputContainer>
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={nom} onChange={(e) => { setNom(e.target.value) }} placeholder="Nom du client" type="text" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" value={prenom} onChange={(e) => { setPrenom(e.target.value) }} placeholder="Prénom" type="text" />
            </LabelInputContainer>
          </div>
          <div className="flex gap-4">
            <LabelInputContainer>
              <Label htmlFor="tel">téléphone</Label>
              <Input id="tel"value={telephone} onChange={(e) => { setTelephone(e.target.value) }}  placeholder="tel" type="tel" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="email" type="email" />
            </LabelInputContainer>
          </div>
          <div className="flex gap-4">
            <LabelInputContainer className="">
              <Label htmlFor="tel">Adresse</Label>
              <Input id="capacite" value={adresse} onChange={(e) => { setAdresse(e.target.value) }} placeholder="Adresse" type="text" />
            </LabelInputContainer>
            <LabelInputContainer className="">
              <Label htmlFor="ville">Ville</Label>
              <Input id="ville" value={ville} onChange={(e) => { setVille(e.target.value) }} placeholder="Ville" type="text" />
            </LabelInputContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          className="p-6"
          disabled={pending}
          onClick={handleSubmit}
        >
          {pending ? <ReloadIcon className="animate-spin" /> : " Enregistrez le client"}
        </Button>
      </CardFooter>
    </Card>
  </main>
}