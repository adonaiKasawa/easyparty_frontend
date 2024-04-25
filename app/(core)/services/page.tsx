"use server";

import { AddServicesUI } from "@/app/components/services/services.ui";
import React from "react";
import { auth } from "../auth/[...nextauth]";
import { redirect } from "next/navigation";
import { FindServicesApi } from "@/app/lib/actions/services/services.req";
import { IServices } from "@/app/types/interfaces";
import { Card, CardContent } from "@/app/components/ui/card";
import ServicesClientPage from "./page.client";


export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  let FindServices: IServices[] = await FindServicesApi();
  console.log(FindServices);

  if (FindServices?.hasOwnProperty('StatusCode') && FindServices?.hasOwnProperty('message')) {
    FindServices = []
  }
  return <div>
    <ServicesClientPage session={session} initData={FindServices}/>
  </div>
}