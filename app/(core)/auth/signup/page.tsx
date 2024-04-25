"use server";

import React from "react";
import { AuthSignupFormUI } from "@/app/components/auth/signup/signup.ui";
import { Spotlight } from "@/app/components/ui/Spotlight";

export default async function SignUpPage() {

  return <main className="container mx-auto px-24 py-4">
    <div className="w-full flex md:items-center md:justify-center antialiased relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col justify-center relative z-10 items-center">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-primary to-neutral-400 bg-opacity-50">
            Propriétaire <br /> de <br /> salle des fêtes
          </h1>
          <p className="mt-4 font-normal text-base max-w-lg text-center mx-auto">
            Augmentez vos réservations et boostez votre activité avec EasyParty ! <br />
            Vous êtes propriétaire d'une salle de fête et vous souhaitez attirer plus de clients ? <br />
            EasyParty est la solution qu'il vous faut !
          </p>
        </div>
        <div>
          <AuthSignupFormUI />
        </div>

      </div>
    </div>
  </main>
}