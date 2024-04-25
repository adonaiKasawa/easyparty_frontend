"use client"

import React from "react"
import { IRooms } from "@/app/types/interfaces"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/app/components/ui/card"
import Image from "next/image"
import { api_url, local_file_url } from "@/app/lib/actions/action"
import { UsersIcon } from "lucide-react"
import { useRouter } from "next/navigation"


export function CardRoomUI({ room }: { room: IRooms }) {
  const router = useRouter()

  const goToRooms = () => router.push(`/rooms/details/${room.id}`)


  return <Card className="border-0 cursor-pointer shadow" onClick={goToRooms}>
    <CardContent className="p-0">
      <Image
        src={`${local_file_url}${room.visuals[0]}`}
        width={2000}
        height={2000}
        alt={`${api_url}rooms/${room.visuals[0]}`}
        className="w-full max-h-60 rounded-lg object-cover"
        style={{
          height: 200
        }}
      />
    </CardContent>
    <CardFooter className="flex flex-col justify-start items-start gap-2 mt-2">
      <CardTitle>
        {room.name}
      </CardTitle>
      <CardDescription className="capitalize">
        {room.city}, {room.country}
        {room.adress} <br />
      </CardDescription>
      <CardDescription className="flex gap-2 capitalize">
        {room.capacity} <UsersIcon size={20} />
      </CardDescription>
    </CardFooter>
  </Card>
}