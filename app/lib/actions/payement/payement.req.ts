"use server";

import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";
import { HttpRequest } from "../action";
import { CreateResevationDto } from "../reservation/reservation.req";

export interface CreatePaiementDto {
  montant_total_paiement: number;
  montant_suggerer_paiement: number;
  montant_paye_paiement: number
  mode_paiement: string
  reference_paiement: string;
}

export interface PaiementDto {
  paeiment: CreatePaiementDto
  reservation: CreateResevationDto
}

export const CreatePayementApi = async (dto: PaiementDto, id: number) => {
  const create = await HttpRequest(`paiement/${id}`, "POST", dto);
  if (!create?.hasOwnProperty('StatusCode') && !create?.hasOwnProperty('message')) {
    await HttpRequest(`reservation/${id}`, "PATCH", dto.reservation)
  }
  return create
}

export const FindAllPaymentApi = async (owner: boolean, id: number) =>  await HttpRequest(`paiement/owner/${id}`, "GET")
export const FindPaymentByReservationIdApi = async (id: number) => await HttpRequest(`paiement/reservation/${id}`, "GET")



