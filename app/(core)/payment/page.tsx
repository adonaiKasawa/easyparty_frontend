"use server";

import React from "react";
import { auth } from "../../auth/[...nextauth]";
import { IPayement, IPayementCurrent, IReservation } from "../../types/interfaces";
import { redirect } from "next/navigation";
import { PrivilegesEnum } from "../../types/enums/privilege.enum";
import { FindAllReservationApi } from "../../lib/actions/reservation/reservation.req";
import PaymentSsrTableUI from "../../components/table/payment/payment.ssr.table";
import { FindAllPaymentApi } from "../../lib/actions/payement/payement.req";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ReservationStatusEnum } from "../../types/enums/reservation.enum";
import moment from "moment";


export default async function ReservationPage() {
  const session = await auth();
  if (!session) {
    redirect("/")
  }
  const { user } = session;

  let findPayement: IPayementCurrent[] = await FindAllPaymentApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

  if (findPayement?.hasOwnProperty('StatusCode') && findPayement?.hasOwnProperty('message')) {
    findPayement = []
  }

  let findReservation: IReservation[] = await FindAllReservationApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

  if (findReservation?.hasOwnProperty('StatusCode') && findReservation?.hasOwnProperty('message')) {
    findReservation = []
  }



  let TmontantTotal = 0;
  let Tmontant_paye_paiement = 0;
  let Tmontant_suggere_paiement = 0;
  let Tmontant_endete_paiement = 0;
  let Tmontant_marge_beneficiary_paiement = 0;
  let Tmontant_pending_payement = 0;

  findPayement.map((item) => {
    item.paiement.map((p) => {
      Tmontant_paye_paiement += p.montant_paye_paiement;
    });
    TmontantTotal += item.paiement[0]?.montant_total_paiement;
    Tmontant_suggere_paiement += item.paiement[0]?.montant_suggerer_paiement

    Tmontant_marge_beneficiary_paiement += TmontantTotal - Tmontant_suggere_paiement
  });
  Tmontant_endete_paiement += Tmontant_suggere_paiement - Tmontant_paye_paiement

  findReservation.map((item) => {
    if (item.niveau_reservation === ReservationStatusEnum.P) {
      const start = moment(item.date_start.toString())
      const end = moment(item.date_end.toString())
      const daysDiff = end.diff(start, 'days') + 1;
      console.log(`${item.id}`, daysDiff);

      if (item.rooms.tarif?.price) {
        let service = 0;
        item.res_serv?.map((s) => {
          service += s.service.price * (s.service.person ? item.number_person : 1)
        })
        Tmontant_pending_payement += ((item.rooms.tarif?.price) + service) * daysDiff
      }
    }
  });

  let statistique: { title: string, price: number }[] = [
    {
      title: "Montant en attente",
      price: Tmontant_pending_payement
    },
    {
      title: " Montant Total",
      price: TmontantTotal,
    },
    {
      title: "Montant suggerer",
      price: Tmontant_suggere_paiement,
    },
    {
      title: "Montant payer",
      price: Tmontant_paye_paiement,
    },
    {
      title: "Montant dette",
      price: Tmontant_endete_paiement,
    },
    {
      title: "Montant marge",
      price: Tmontant_marge_beneficiary_paiement,
    }
  ]

  return <main className="container mx-auto px-24 py-8">
    <p className="font-bold text-7xl">Payement & Facturation</p>
    <div className="grid grid-cols-6 justify-center gap-4 my-4">
      {statistique.map((item) =>
        <Card key={item.title}>
          <CardHeader>
            <CardTitle className="text-center">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <p className="text-2xl">{item.price}$</p>
          </CardContent>
        </Card>
      )}
    </div>
    <PaymentSsrTableUI session={session} initData={findPayement} />
  </main>

}