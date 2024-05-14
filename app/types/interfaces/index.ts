import { CreateResevationDto } from "@/app/lib/actions/reservation/reservation.req";
import { ReservationStatusEnum } from "../enums/reservation.enum";

export interface PayloadUserInterface {
  sub: number;
  name: string;
  prenom: string;
  telephone: string;
  email: string;
  username: null;
  privilege_user: string;
  ville?: string;
  pays?: string;
  adresse?: string;
  iat: number;
  exp: number;
}

export interface Token {
  access_token: string,
  refresh_token: string
}

export interface CreateAbonnementDto {
  montant_abonnement: string | null;
  method_abonnement: string | null;
  reference_abonnement: string | null;
}

export interface CreateUserDto {
  nom: string,
  prenom: string,
  telephone: string,
  email: string,
  password: string,
  privilege: string,
  adresse?: string;
  ville?: string;
  pays?: string;
  confirm?: boolean
}

export interface IRooms {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  name: string;
  description: string;
  capacity: number;
  location: string;
  adress: string;
  city: string;
  country: null;
  equipment: string[];
  additional_services: string[];
  visuals: string[];
  tarif: ITarif
}

export interface IServices {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  name: string;
  description: string;
  price: number;
  person: boolean
}

export interface ITarif {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface IReservation {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  date_start: Date;
  date_end: Date;
  number_person: number;
  niveau_reservation: ReservationStatusEnum;
  user: IUser;
  rooms: IRooms;
  res_serv?: IResService[];
}
export interface IResService {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  service: IServices;
  reservation: IReservation
}

export interface IPayement {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  montant_total_paiement: number,
  montant_suggerer_paiement: number,
  montant_paye_paiement: number,
  mode_paiement: string
  reference_paiement: string
  reservation: IReservation;
}
export interface IPayementCurrent extends IReservation {
  paiement: IPayement[]
}
export interface IUser {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  sexe?: string;
  datenaissance?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  username?: string;
  salt?: string;
  password?: string;
  hashedRt?: string;
  privilege?: string;
  status?: string;
  confirm?: boolean;
}

export interface IResevationPrint extends CreateResevationDto {
  picture: string
  res_serv: IServices[],
  numbre_jour: number,
  client: IUser;
  room: IRooms;
  reservation: IReservation
}

export interface IPayementPrint extends IPayementCurrent {

}
