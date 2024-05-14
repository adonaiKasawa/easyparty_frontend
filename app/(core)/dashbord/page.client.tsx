"use client";

import DashboardSsrTableUI from "@/app/components/table/dashboard/dashbaord.ssr.table";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";
import { IPayementCurrent, IReservation } from "@/app/types/interfaces";
import { Session } from "next-auth/types";

export default function DashboardClient({ initData, session, }: { session: Session; initData: { reservation: IReservation[], paeiment: IPayementCurrent[] } }) {
  
  let ReservationPendigPayement = 0
  let ReservationPayementConfirm = 0
  let ReservationAnnuler = 0

  let TmontantTotal = 0;
  let Tmontant_paye_paiement = 0;
  let Tmontant_suggere_paiement = 0;
  let Tmontant_endete_paiement = 0;
  let Tmontant_marge_beneficiary_paiement = 0;

  initData.paeiment.map((item) => {
    item.paiement.map((p) => {
      Tmontant_paye_paiement += p.montant_paye_paiement;
    });
    TmontantTotal += item.paiement[0]?.montant_total_paiement;
    Tmontant_suggere_paiement += item.paiement[0]?.montant_suggerer_paiement

    Tmontant_marge_beneficiary_paiement += TmontantTotal - Tmontant_suggere_paiement
  });
  Tmontant_endete_paiement += Tmontant_suggere_paiement - Tmontant_paye_paiement


  ReservationPendigPayement = initData.reservation.filter((item) => item.niveau_reservation === ReservationStatusEnum.P).length
  ReservationPayementConfirm = initData.reservation.filter((item) => item.niveau_reservation === ReservationStatusEnum.PC).length
  ReservationAnnuler = initData.reservation.filter((item) => item.niveau_reservation === ReservationStatusEnum.C).length


  let reservation = [
    {
      title: "En attente",
      total: ReservationPendigPayement
    },
    {
      title: "Confirmer",
      total: ReservationPayementConfirm
    },
    {
      title: "Annuler",
      total: ReservationAnnuler
    },
  ]

  let payement = [{
    title: "Total",
    total: TmontantTotal
  },
  {
    title: "Négocier",
    total: Tmontant_suggere_paiement
  },
  {
    title: "Payer",
    total: Tmontant_paye_paiement
  },
  {
    title: "Restant",
    total: Tmontant_endete_paiement
  }
  ]
  return (
    <main className="container mx-auto px-24 py-8">
      <p className="text-7xl font-bold mb-4">Tableau de bord</p>
      <p className="text-4xl">Réservation</p>
      <div className="flex justify-around w-full my-4 gap-4">
        {reservation.map((item) => <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-2xl">
            {item.total}
          </CardContent>
        </Card>)}
      </div>
      <p className="text-4xl">Paeiment</p>
      <div className="flex justify-around w-full my gap-4">
        {payement.map((item) => <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-2xl">
            ${item.total}
          </CardContent>
        </Card>)}
      </div>
    </main>
  )
}