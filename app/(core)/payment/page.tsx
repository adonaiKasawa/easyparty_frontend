"use server";

import React from "react";
import { auth } from "../auth/[...nextauth]";
import { IPayement, IReservation } from "../../types/interfaces";
import { redirect } from "next/navigation";
import { PrivilegesEnum } from "../../types/enums/privilege.enum";
import { FindAllReservationApi } from "../../lib/actions/reservation/reservation.req";
import PaymentSsrTableUI from "../../components/table/payment/payment.ssr.table";
import { FindAllPaymentApi } from "../../lib/actions/payement/payement.req";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ReservationStatusEnum } from "../../types/enums/reservation.enum";


export default async function ReservationPage() {
  const session = await auth();
  if (!session) {
    redirect("/")
  }
  const { user } = session;

  let findPayement: IPayement[] = await FindAllPaymentApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

  if (findPayement?.hasOwnProperty('StatusCode') && findPayement?.hasOwnProperty('message')) {
    findPayement = []
  }

  let findReservation: IReservation[] = await FindAllReservationApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

  if (findReservation?.hasOwnProperty('StatusCode') && findReservation?.hasOwnProperty('message')) {
    findReservation = []
  }

  console.log(findReservation[0]);
  
  let montantTotal = 0
  let montantEntent = 0
  findPayement.map((item) => {
    montantTotal += parseInt(item.montant_paiement)
  })
  findReservation.map((item) => {
    if (item.status === ReservationStatusEnum.P) {
      if (item.rooms.tarif?.price) {
        montantEntent += item.rooms.tarif?.price
      }
    }

  })
  console.log(findPayement);


  return <main className="container mx-auto px-24 py-8">
    <p className="font-bold text-7xl">Payement & Facturation</p>
    <div className="grid grid-cols-3 gap-4 my-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Montant Total
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <p className="text-5xl">{montantTotal}$</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Montant en attente de paeiment
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <p className="text-5xl">{montantEntent}$</p>
        </CardContent>
      </Card>
    </div>
    <PaymentSsrTableUI session={session} initData={findPayement} />
  </main>

}