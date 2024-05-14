"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth/[...nextauth]";
import DashboardClient from "./dashbord/page.client";
import { FindAllReservationApi } from "../lib/actions/reservation/reservation.req";
import { PrivilegesEnum } from "../types/enums/privilege.enum";
import { IReservation } from "../types/interfaces";
import { ReservationStatusEnum } from "../types/enums/reservation.enum";
import Dashboard from "./dashbord/page";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/")
  }
  const { user } = session;


  return <Dashboard />

}


