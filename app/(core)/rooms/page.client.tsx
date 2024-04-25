"use client";

import React, { useState } from "react";
import { Session } from "next-auth/types";
import { IRooms } from "../../types/interfaces";
import { CardRoomUI } from "../../components/rooms/rooms.ui";
import { LabelInputContainer } from "../../components/auth/signin/signin.ui";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../components/ui/input";
import { DatePickerUI } from "../../components/ui/date-picker";
import { MapPinnedIcon, SheetIcon, UsersIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { PrivilegesEnum } from "../../types/enums/privilege.enum";

import Link from "next/link";


export default function RoomsListePage({ session, initData }: { session: Session | null, initData: IRooms[] }) {
  const [rooms, setRooms] = useState<IRooms[]>(initData);
  const [city, setCity] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const user = session ? session?.user : null

  return <main className="">
    <div className="grid grid-cols-2 gap-4">
      <div className="flex gap-4">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="city">Ville</Label>
          <Input startContent={<MapPinnedIcon />} className="bg-mid-gray" id="city" value={city} onChange={(e) => { setCity(e.target.value) }} placeholder="Kinshasa" type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="city">Capacité</Label>
          <Input startContent={<UsersIcon />} className="bg-mid-gray" id="capacite" value={capacity} onChange={(e) => { setCapacity(e.target.value) }} placeholder="250" type="number" />
        </LabelInputContainer>
      </div>
      <div className="flex items-center justify-end gap-2">
        <LabelInputContainer className="mb-4 w-56">
          <Label htmlFor="city">Disponibilité</Label>
          <DatePickerUI date={date} setDate={setDate} />
        </LabelInputContainer>
        {(user && user.privilege_user === PrivilegesEnum.PSF) &&
          <Button variant="ghost" size="icon">
            <SheetIcon />
          </Button>
        }
        <Link
        href={"/rooms/create"}
        >
          <Button>
            Ajouter une salle
          </Button>

        </Link>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4">
      {rooms.map((item) => <CardRoomUI key={`${item.createdAt}`} room={item} />)}
    </div>
  </main>

}