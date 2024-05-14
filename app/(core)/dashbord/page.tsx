"use server";

import { FindAllReservationApi } from "@/app/lib/actions/reservation/reservation.req";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { IPayementCurrent, IReservation } from "@/app/types/interfaces";
import { redirect } from "next/navigation";
import { auth } from "../../auth/[...nextauth]";
import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";
import DashboardClient from "./page.client";
import { FindAllPaymentApi } from "@/app/lib/actions/payement/payement.req";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/")
  }
  const { user } = session;
  let initData: {reservation : IReservation[], paeiment: IPayementCurrent[]} = {reservation: [], paeiment: []}

  let findReservation: IReservation[] = await FindAllReservationApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);
  if (findReservation?.hasOwnProperty('StatusCode') && findReservation?.hasOwnProperty('message')) {
    findReservation = []
  } else {
    initData.reservation = findReservation
  }
  let findPayement: IPayementCurrent[] = await FindAllPaymentApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);
  if (findPayement?.hasOwnProperty('StatusCode') && findPayement?.hasOwnProperty('message')) {
    findPayement = []
  }else {
    initData.paeiment = findPayement;
  }
  console.log(initData.reservation.length, initData.paeiment.length);
  
  return (
    <main className="container mx-auto px-24 py-8">
      <DashboardClient session={session} initData={initData} />
    </main>
  )
}


