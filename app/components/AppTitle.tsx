"use client";
import React from "react";
import { SparklesCore } from "./ui/sparkles";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { useTheme } from "next-themes";
import { ImagesSlider } from "./ui/images-slider";
import { motion } from "framer-motion";
import { AppNameUI } from "./appname";



export function AppTitleUI() {
  const { theme } = useTheme()
  const images = [
    "https://d31uetu06bkcms.cloudfront.net/photo/easyparty/rooms/2.jpg",
    "https://d31uetu06bkcms.cloudfront.net/photo/easyparty/rooms/3.jpg",
    "https://d31uetu06bkcms.cloudfront.net/photo/easyparty/rooms/4.avif",

  ];
  const words = `Fini le stress de la planification de fête ! Avec EasyParty,
 trouvez la salle parfaite pour votre prochain événement en quelques clics.`

  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <div className="h-[40rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
          <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-white text-center relative z-20">
            <AppNameUI />
          </h1>

          <div className="w-[40rem] h-40 relative">
            {/* Gradients */}
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor={ "#FFFFFF"}
            />

            <div className="w-full text-center">
              <TextGenerateEffect words={words} textColor="text-white"/>
            </div>
            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full  [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
      </motion.div>

    </ImagesSlider>
  );
}
