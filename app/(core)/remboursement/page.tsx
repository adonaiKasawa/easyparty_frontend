
import { auth } from "@/app/auth/[...nextauth]";
import ClientSsrTableUI from "@/app/components/table/client/client.ssr.table";
import { IUser } from "@/app/types/interfaces";
import { Session } from "next-auth/types";
import { redirect } from "next/navigation";
import React, { useState } from "react";


export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect('/')
  }
  return <main className="contain px-24 py-8">
    <p className="font-bold text-7xl">Rembrousement</p>
    <div className="mt-4">
      <ClientSsrTableUI session={session} initData={[]} />
    </div>
  </main>
}