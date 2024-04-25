"use client";

import DashboardSsrTableUI from "@/app/components/table/dashboard/dashbaord.ssr.table";
import { IReservation } from "@/app/types/interfaces";
import { Session } from "next-auth/types";

export default async function DashboardClient({ initData, session, }: { session: Session; initData: IReservation[] }) {

  return (
    <main className="container mx-auto px-24 py-8">
      <p className="text-4xl">Tableau de bord</p>
      <DashboardSsrTableUI session={session} initData={initData} />

    </main>
  )
}