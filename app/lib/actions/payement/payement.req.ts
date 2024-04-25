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

export const CreatePayementApi = async (dto: PaiementDto, id: number) => await HttpRequest(`paiement/${id}`, "POST", dto);

export const FindAllPaymentApi = async (owner: boolean, id: number) => owner ? await HttpRequest(`paiement/owner/${id}`, "GET") : await HttpRequest(`paiement/${id}`, "GET");



