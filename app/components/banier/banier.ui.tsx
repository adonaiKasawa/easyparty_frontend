import * as React from "react"

import { Card, CardContent } from "@/app/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel"
import Image from "next/image"

export function BanierCarouselUI() {
  return (
    <Carousel className="w-full max-h-96">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Image
              src={"/rooms/5.jpg"}
              alt="rooms-5.png"
              width={500}
              height={0}
              className="w-full h-1/2 objecti-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
