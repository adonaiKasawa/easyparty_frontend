import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";

const columns = [
  { name: "#", uid: "#", sortable: true },
  { name: "Nom", uid: "nom", sortable: true },
  { name: "Prénom", uid: "prenom", sortable: true },
  { name: "Téléphone", uid: "tel", sortable: true },
  { name: "Email", uid: "email", sortable: true },
  
  { name: "Actions", uid: "actions" },
];


const statusOptions = [
  { name: "En attente de paeiment", uid: ReservationStatusEnum.P },
  // { name: "Paeiment confimer", uid: ReservationStatusEnum.PC },
  // { name: "Consommer", uid: ReservationStatusEnum.U },
  // { name: "Annuler", uid: ReservationStatusEnum.C },
];



export { columns, statusOptions };
