"use server";

import React from "react";
import { auth } from "../auth/[...nextauth]";
import { FindAllRoomsApi } from "../../lib/actions/rooms/rooms.req";
import RoomsListePage from "./page.client";
import { IRooms } from "../../types/interfaces";


export default async function RoomsPage() {
  const session = await auth();

  let findRooms: IRooms[] = await FindAllRoomsApi();
  if (findRooms?.hasOwnProperty('StatusCode') && findRooms?.hasOwnProperty('message')) {
    findRooms = []
  }
  
  return <main className="container mx-auto px-24 py-8">
    <p className="font-bold text-7xl">Rooms</p>
    <RoomsListePage session={session} initData={findRooms} />
  </main>

}