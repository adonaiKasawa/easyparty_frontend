"use server";

import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";
import { HttpRequest } from "../../actions/action";
import { IServices } from "@/app/types/interfaces";

export interface CreateResevationDto {
  date_start?: Date,
  date_end?: Date,
  roomId?: number
  number_person?: number
  reservice?: number[] | IServices[]
  niveau_reservation?: ReservationStatusEnum
  clientId?: number
}

export const ReservationRoomsApi = async (dto: CreateResevationDto) => await HttpRequest('reservation', "POST", dto);

export const FindAllReservationApi = async (owner: boolean, id: number) =>  await HttpRequest(`reservation/owner/${id}`, "GET")

export const FindAllReservatioByIdApi = async (id: number) => await HttpRequest(`reservation/byId/${id}`, "GET");

export const UpdateReservationApi = async (id: number, dto: CreateResevationDto) => await HttpRequest(`reservation/${id}`, "PATCH", dto)


