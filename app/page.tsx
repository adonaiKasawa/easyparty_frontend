"use server";

import { redirect } from "next/navigation";
import { auth } from "./(core)/auth/[...nextauth]";
import DashboardClient from "./(core)/dashbord/page.client";
import { FindAllReservationApi } from "./lib/actions/reservation/reservation.req";
import { PrivilegesEnum } from "./types/enums/privilege.enum";
import { IReservation } from "./types/interfaces";
import { ReservationStatusEnum } from "./types/enums/reservation.enum";

export default async function Home() {
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
   <div>
    <DashboardClient session={session} initData={initData} />
   </div>
  )
}


