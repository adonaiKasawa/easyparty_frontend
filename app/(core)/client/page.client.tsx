"use client";

import ClientSsrTableUI from "@/app/components/table/client/client.ssr.table";
import { IUser } from "@/app/types/interfaces";
import { Session } from "next-auth/types";
import React, { useState } from "react";


export default  function ClientPage({session, initData}: {session: Session, initData: IUser[] }) {
  const [clients, setClient] = useState<IUser[]>(initData)


  return <main className="contain px-24 py-8">
    <p className="font-bold text-7xl">Clients</p>
    <div className="mt-4">
      <ClientSsrTableUI session={session} initData={clients} />
    </div>
  </main>
}