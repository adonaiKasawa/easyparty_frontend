"use server";

import React from "react";
import { auth } from "../auth/[...nextauth]";
import { IReservation} from "../../types/interfaces";
import { redirect } from "next/navigation";
import { PrivilegesEnum } from "../../types/enums/privilege.enum";
import { FindAllReservationApi } from "../../lib/actions/reservation/reservation.req";
import ReservationSsrTableUI from "../../components/table/reservation/reservation.ssr.table";


export default async function ReservationPage() {
  const session = await auth();
  if (!session) {
    redirect("/")
  }
  const { user } = session;

  let findReservation: IReservation[] = await FindAllReservationApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

  if (findReservation?.hasOwnProperty('StatusCode') && findReservation?.hasOwnProperty('message')) {
    findReservation = []
  }

  return <main className="container mx-auto px-24 py-8">
    <p className="font-bold text-7xl">Réservations</p>
    <ReservationSsrTableUI session={session} initData={findReservation} />
  </main>

}