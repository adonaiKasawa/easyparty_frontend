import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";

const columns = [
  { name: "#", uid: "#", sortable: true },
  { name: "N°", uid: "#n", sortable: true },
  { name: "Salle", uid: "room", sortable: true },
  { name: "Date de réservation", uid: "date", sortable: true },
  { name: "Date de début", uid: "date_start", sortable: true },
  { name: "Date de fin", uid: "date_end", sortable: true },
  { name: "Jours", uid: "number_days", sortable: true },
  { name: "Client", uid: "client", sortable: true },
  { name: "Statut", uid: "statut", sortable: true },
  
  { name: "Actions", uid: "actions" },
];


const statusOptions = [
  { name: "En attente du paeiment", uid: ReservationStatusEnum.P },
  { name: "Paeiment confimer", uid: ReservationStatusEnum.PC },
  { name: "Consommer", uid: ReservationStatusEnum.U },
  { name: "Annuler", uid: ReservationStatusEnum.C },
];



export { columns, statusOptions };
