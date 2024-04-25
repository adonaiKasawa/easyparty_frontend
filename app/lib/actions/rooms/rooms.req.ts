"use server";

import { HttpRequest } from "../../actions/action";


export const FindAllRoomsApi = async () => await HttpRequest("rooms", "GET");
export const FindRoomByIdApi = async (id: string) => await HttpRequest(`rooms/${id}`, "GET");
export const CreateRoomsApi = async (dto: any, price: number) => {
  const create = await HttpRequest("rooms", "POST", dto);
  if (!create.hasOwnProperty("StatusCode") && !create.hasOwnProperty("message")) {
    const tarif = await HttpRequest("tarif", "POST", {
      "name": "Forfait Premium",
      "price": price,
      "description": "Forfait Premium"
    });
    if (!create.hasOwnProperty("StatusCode") && !create.hasOwnProperty("message")) {
       await HttpRequest(`rooms/assignTarif/${create.id}/${tarif.id}`, "POST");
    }
  }
  return create;
}