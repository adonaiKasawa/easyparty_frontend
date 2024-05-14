"use client";
import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "@/app/lib/utils";
import { authSigninUser, authenticate } from "@/app/lib/actions/auth";
import { Button } from "../../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/app/components/ui/use-toast"
import { useRouter } from 'next/navigation'

export function AuthSignInFormUI() {
  const [telephone, setTelephone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [pending, setPending] = useState<boolean>(false);

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (telephone && password) {
      const formData = new FormData();
      formData.append("telephone", telephone);
      formData.append("password", password);
      setPending(true);
      const signin = await authSigninUser({ telephone, password });
      console.log(signin);
      if (!signin.hasOwnProperty('StatusCode') && !signin?.hasOwnProperty('message')) {
        const loginResponse = await authenticate(undefined, formData);
        setPending(false);
        console.log(loginResponse);
        if (loginResponse === "Invalid credentials." || loginResponse === "Something went wrong.") {
          toast({
            variant: "destructive",
            title: "Connexion échoue",
            description: "Indetifiant incorrect.",
          })
        } else {
          document.location = "/rooms";
        }
      } else {
        let message = '';
        if (typeof signin.message === "object") {
          signin.message.map((item: string) => message += `${item} \n`)
        } else {
          message = signin.message;
        }
        toast({
          variant: "destructive",
          title: "Inscription échoue",
          description: message,
        })
      }
      setPending(false);
    } else {
      toast({
        variant: "destructive",
        title: "Connexion échoue",
        description: "Champs obligatoires.",
      })
    }

  };

  return (
    <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-background">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Bienvenue à EasyParty
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="tel">Numéro de téléphone</Label>
          <Input id="tel" value={telephone} onChange={(e) => { setTelephone(e.target.value) }} placeholder="+243990434084" type="tel" />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <Button
          disabled={pending}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          <div className="flex justify-center items-center">
            {pending ? <ReloadIcon className="animate-spin" /> : <p>Se connecter  &rarr;</p>}
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

export const LabelInputContainer = ({
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
