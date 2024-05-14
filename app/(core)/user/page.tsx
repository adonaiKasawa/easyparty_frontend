"use server";

import { IUser } from "@/app/types/interfaces";
import UserClientPage from "./page.clent";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { findUserByPrivilegeApi } from "@/app/lib/actions/auth";

export default async function () {

  let findUser: IUser[] = await findUserByPrivilegeApi(PrivilegesEnum.PSF);
  if (findUser?.hasOwnProperty('StatusCode') && findUser?.hasOwnProperty('message')) {
    findUser = []
  }
  console.log(findUser);
  
  return <UserClientPage initData={findUser}/>
}