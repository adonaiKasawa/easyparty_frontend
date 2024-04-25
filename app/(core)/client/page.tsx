"use server";

import React from "react";
import { auth } from "../auth/[...nextauth]";
import { redirect } from "next/navigation";
import ClientPage from "./page.client";
import { findUserByPrivilegeApi } from "@/app/lib/actions/auth";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { IUser } from "@/app/types/interfaces";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect('/auth')
  }
  let findAllUser: IUser[] = await findUserByPrivilegeApi(PrivilegesEnum.CLT)
  if (findAllUser?.hasOwnProperty('StatusCode') && findAllUser?.hasOwnProperty('message')) {
    findAllUser = []
  }
  console.log(findAllUser);
  
  return <div>
    <ClientPage session={session} initData={findAllUser} />
  </div>
}