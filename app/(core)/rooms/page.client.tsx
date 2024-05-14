"use client";

import React, { useState } from "react";
import { Session } from "next-auth/types";
import { IRooms } from "../../types/interfaces";
import { CardRoomUI } from "../../components/rooms/rooms.ui";
import { SheetIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { PrivilegesEnum } from "../../types/enums/privilege.enum";

import Link from "next/link";


export default function RoomsListePage({ session, initData }: { session: Session | null, initData: IRooms[] }) {
  const [rooms, setRooms] = useState<IRooms[]>(initData);
  const [city, setCity] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const user = session ? session?.user : null

  return <main>
    <div className="flex items-center justify-end gap-2">
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
    <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4">
      {rooms.map((item) => <CardRoomUI key={`${item.createdAt}`} room={item} />)}
    </div>
  </main>

}