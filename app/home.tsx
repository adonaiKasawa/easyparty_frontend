"use server";

import { AppTitleUI } from "./components/AppTitle";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { LayoutImageGridUI } from "./components/grid/images.grid.ui";
import { Spotlight } from "./components/ui/Spotlight";
import { AuthSignupFormUI } from "./components/auth/signup/signup.ui";
import { AppNameUI } from "./components/appname";
import Image from "next/image";
import { Button } from "./components/ui/button";
import { RocketIcon } from '@radix-ui/react-icons'
import Link from "next/link";

export default async function Home() {

  return (
    <div className="">
    <div className="flex justify-center items-center">
      <AppTitleUI />
    </div>
    <main className="h-full w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center pb-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="container mx-auto px-24">
        <p className="text-center text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Pourquoi choisir <AppNameUI /> ?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Simplicité et rapidité</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Trouvez et réservez votre salle de fête en quelques minutes, sans tracas.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gain de temps et d'argent</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Dites adieu aux appels téléphoniques interminables et aux recherches fastidieuses.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sécurité et fiabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Paiement en ligne sécurisé et service client réactif.</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
          <div />
          <Card>
            <CardHeader>
              <CardTitle>Large choix</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Des salles polyvalentes aux espaces luxueux, nous avons la salle idéale pour votre fête.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transparence totale</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Photos, descriptions détaillées et avis des utilisateurs pour vous aider à faire votre choix.</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-center text-xl sm:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 mx-32 mt-16">
          Que vous organisiez un anniversaire, un mariage, une réunion d'entreprise ou tout autre événement, EasyParty est votre solution idéale.
        </p>
        <LayoutImageGridUI />
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
      </div>
    </main>

    <main className="container mx-auto px-24 py-8">
      <div className="">
        <p className="text-center text-xl sm:text-5xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Obtenez le guide vidéo gratuit
        </p>
        <iframe
          className="w-full h-[40rem] rounded-lg "
          src="https://www.youtube.com/embed/MNdOgKgV14M?si=iHrlPzE4LQXfCfOi"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-8">
        <div>
          <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
            Createur de  <br />
            <AppNameUI />
          </p>
          <p className="font-bold text-xl mt-2">Adonai Mbula, Développeur Fullstack</p>
          <p className="my-12">
            Même si nous aimons les hasards, ce n’était pas le cas. En tant que YouTuber,
            retour sur 2023 avec son manager partenaire : Benjamin s'est rendu compte que près de la moitié de ses vidéos
            hebdomadaires n'avaient aucun sponsor – il restait trop d'argent sur la table.
            Et lorsque l’on considère toutes les options pour être proactif dans la recherche de sponsoring :
            elles ont toutes été douloureuses, lentes et peu efficaces.
          </p>
          <p className="my-12">
            Ainsi, en tant qu'ingénieur logiciel possédant une tonne d'expérience dans la création d'outils incroyables
            (par exemple, Qovery Software Engineer), Benjamin a fait ce qu'il savait faire de mieux. Premièrement,
            il pensait à l’utilisateur final. Mais réalisant que tant d’autres se trouvaient exactement
            dans le même dilemme que lui, il a réalisé le potentiel d’en faire un SaaS complet.
          </p>

          <p>
            Beaucoup de lignes de code, de prototypage et de tests utilisateurs plus tard,
            <span className="font-bold"><AppNameUI /></span> est né – pour offrir à chaque personne une expérience
            incroyable en découvrant des salle de fete.
          </p>
        </div>

        <div className="flex flex-col itms-center justify-center">
          <Image
            src="/adonaimbula.png"
            width={300}
            height={100}
            className="w-full h-9/12 rounded-xl"
            alt="x-account"
          />
        </div>
      </div>
    </main>

    <main className="container mx-auto px-24 py-8">
      <Card className="flex flex-col justify-center items-center p-24">
        <p className="text-center text-xl sm:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Vous voulez <span className="text-blue-700">les meilleurs salles </span> pour vos fêtes ?
        </p>
        <Link href={"/auth"}>
          <Button className="font-bold">
            <RocketIcon className="mr-2 h-4 w-4" /> Rejoignez <AppNameUI />
          </Button>
        </Link>
      </Card>
    </main>

    <main className="container mx-auto px-24 py-8">
      <div className="flex items-center justify-center">
        <Image
          src={"/icon.png"}
          width={30}
          height={30}
          alt="logo_easyparty"
          className="mr-2"
        />
        <p className="font-bold"><AppNameUI /></p>
      </div>
      <div className="flex  gap-4 items-center justify-center">
        <Link href={'#'}>
          Terms
        </Link>
        <Link href={"#"}>
          Privacy
        </Link>
        <Link href={"#"}>
          Legal
        </Link>
      </div>
    </main>

  </div>
    
  )
}


