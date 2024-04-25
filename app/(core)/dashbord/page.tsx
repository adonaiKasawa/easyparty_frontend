"use server";

import { FindAllReservationApi } from "@/app/lib/actions/reservation/reservation.req";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { IReservation } from "@/app/types/interfaces";
import { redirect } from "next/navigation";
import { auth } from "../auth/[...nextauth]";
import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/")
  }
  const { user } = session;

  let findReservation: IReservation[] = await FindAllReservationApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);
  let initData: IReservation[] = []
  if (findReservation?.hasOwnProperty('StatusCode') && findReservation?.hasOwnProperty('message')) {
    findReservation = []
  } else {
    initData = findReservation.filter((item) => item.status === ReservationStatusEnum.P)
  }

  return (
    <main className="container mx-auto px-24 py-8">
      <p className="text-4xl">Tableau de bord</p>


    </main>
  )
}


