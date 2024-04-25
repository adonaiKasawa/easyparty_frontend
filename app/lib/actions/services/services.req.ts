"use server";

import { CheckedState } from "@radix-ui/react-checkbox";
import { HttpRequest } from "../action";
import { auth } from "@/app/(core)/auth/[...nextauth]";

export const CreateServicesApi = async (dto: {
  name: string,
  description?: string,
  price: number,
  person: CheckedState | undefined
}) => await HttpRequest("services", "POST", dto);

export const FindServicesApi = async () => {
  const session = await auth()
  return await HttpRequest(`services/owner/${session?.user.sub}`, "GET")
}