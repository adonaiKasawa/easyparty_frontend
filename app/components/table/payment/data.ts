import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";

const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Reference", uid: "reference", sortable: true },
  { name: "Réservation", uid: "reservation", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Client", uid: "client", sortable: true },
  { name: "Methode", uid: "methode", sortable: true },
  { name: "Montant total", uid: "montant_total", sortable: true },
  { name: "Montant suggere", uid: "montant_suggere", sortable: true },
  { name: "Montant payer", uid: "montant_paye", sortable: true },
  { name: "Montant restant", uid: "montant_reste", sortable: true },
  
  { name: "Actions", uid: "actions" },
  
  // { name: "Statut", uid: "statut", sortable: true },
  
  // { name: "Actions", uid: "actions" },
];


const statusOptions = [
  { name: "En attente du paeiment", uid: ReservationStatusEnum.P },
  { name: "Paeiment confimer", uid: ReservationStatusEnum.PC },
  { name: "Consommer", uid: ReservationStatusEnum.U },
  { name: "Annuler", uid: ReservationStatusEnum.C },
];



export { columns, statusOptions };
