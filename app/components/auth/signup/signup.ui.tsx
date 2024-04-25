"use client";
import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "@/app/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { authSignUpUser, authenticate } from "@/app/lib/actions/auth";
import { Button } from "../../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/app/components/ui/use-toast"
import { useRouter } from 'next/navigation'

export function AuthSignupFormUI() {
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("")
  const [privilege, setPrivilege] = useState<string>(PrivilegesEnum.CLT);
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastTitle, setToastTitle] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    const signUpUser = await authSignUpUser({ nom, prenom, telephone, email, password, privilege });
    setPending(false);
    console.log(signUpUser);

    if (!signUpUser.hasOwnProperty('StatusCode') && !signUpUser.hasOwnProperty('message')) {
      const formData = new FormData();
      formData.append("telephone", telephone);
      formData.append("password", password);
      setPending(true);
      const loginResponse = await authenticate(undefined, formData);
      setPending(false);
      if (loginResponse === "Invalid credentials." || loginResponse === "Something went wrong.") {
        router.push('/auth/signin')
      } else {
        document.location = "/rooms";
      }
    } else {
      let message = '';
      if (typeof signUpUser.message === "object") {
        signUpUser.message.map((item: string) => message += `${item} \n`)
      } else {
        message = signUpUser.message;
      }
      toast({
        variant: "destructive",
        title: "Inscription échoue",
        description: message,
      })
    }

    // formData.append("telephone", )
    // authenticate(undefined, formData)

  };

  return (
    <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-background">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Bienvenue à EasyParty
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Prénom</Label>
            <Input id="firstname" value={prenom} onChange={(e) => { setPrenom(e.target.value) }} placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Nom</Label>
            <Input id="lastname" value={nom} onChange={(e) => { setNom(e.target.value) }} placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Addresse Email</Label>
          <Input id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="tel">Numéro de téléphone</Label>
          <Input id="tel" value={telephone} onChange={(e) => { setTelephone(e.target.value) }} placeholder="+243990434084" type="tel" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="typecompte">Type de compte</Label>
          <Select value={privilege} onValueChange={(e) => { setPrivilege(e) }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type de compte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PrivilegesEnum.PSF}>Proprietaire de salle de fête</SelectItem>
              <SelectItem value={PrivilegesEnum.CLT}>Gestionnaire d'événements [mariages, anniversaires, conférences, réunions d'affaires]</SelectItem>
            </SelectContent>
          </Select>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="••••••••" type="password" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmPassword">Confirmation du mot de passe</Label>
          <Input id="confirmPassword" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <Button
          disabled={pending}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          <div className="flex justify-center items-center">
            {pending ? <ReloadIcon className="animate-spin" /> : <p>S'inscrire  &rarr;</p>}
          </div>
          <BottomGradient />
        </Button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
