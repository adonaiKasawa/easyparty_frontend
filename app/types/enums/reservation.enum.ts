export enum ReservationStatusEnum {
  P = 'pending', // En attente 
  PP = 'pending_payment', // En attente du paeiment
  PC = 'payment_confim', // paeiment confimer
  C = 'cancel', // reservation annuler
  U =  'consume' // reservation consommer
}
