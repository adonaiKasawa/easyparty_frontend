"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AppNameUI } from "../appname";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import clsx from "clsx";
import { IPayementCurrent, IPayementPrint, IReservation, IResevationPrint } from "@/app/types/interfaces";
import moment from "moment";
import { capitalize } from "@/app/config/tools";
import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";
import { statusColorMap } from "../table/reservation/reservation.ssr.table";
import { statusOptions } from "../table/reservation/data";
import { Chip } from "@nextui-org/chip";



export const ReservationPreformatInvocePrint = React.forwardRef(({ reservation }: { reservation: IResevationPrint }, ref: React.LegacyRef<HTMLDivElement> | undefined) => {

  let total = 0;
  reservation.res_serv.map((item) => {
    total += item.price * (item.person ? reservation.number_person ? reservation.number_person : 1 : 1) * reservation.numbre_jour;
  });
  total += reservation.room.tarif.price * reservation.numbre_jour;


  return (
    <div className="w-full" ref={ref}>
      <div className="flex flex-col container py-12  gap-8">
        <div className="flex w-full items-center justify-between">
          <div className="text-center">
            <Image
              src={`/icon.png`}
              width={100}
              height={100}
              alt="loge easyparty"
            />
            <p className="font-bold text-xl">
              <AppNameUI />
            </p>
          </div>
          <div className="text-center">
            <p className="font-bold text-4xl">
              PROFORMAT
            </p>
            <p className="font-meduim text-2xl">
              Réservation sale de fête
            </p>
          </div>
          <div className="text-center">
            <Image
              src={`${reservation.picture}`}
              width={100}
              height={100}
              alt="loge easyparty room "
              className="rounded-md"
            />
            <p className="font-bold text-xl">
              {reservation.room.name}
            </p>
          </div>
        </div>

        <Card className="w-full mt-4">
          <CardContent className="py-4 px-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold">Facturer à:</p>
                <p className="">
                  {capitalize(reservation.client.nom) + '' + capitalize(reservation.client.prenom)} {reservation.client.telephone}
                </p>
                <p>
                  {reservation.client.email}
                </p>
              </div>
              <div>
                <p className="font-bold">PRO__{reservation.reservation.id}</p>
                <p>{moment(reservation.reservation.createdAt).format('LL')}</p>
              </div>
            </div>
            <div className="mt-2 flex justify-between mb-2">
              <div>
                <p><b>Nom de la sale</b>: {reservation.room.name}</p>
                <p><b>Capacite:</b> {reservation.room.capacity}prs </p>
              </div>
              <div>
                <p><b>Personne:</b> {reservation.number_person}prs </p>
              </div>
              <div>
                <p><b>Dé:</b> {moment(reservation.date_start).format("LL")} <b>Au</b> {moment(reservation.date_end).format("LL")}</p>
                <p><b>Nombre de jour:</b> {reservation.numbre_jour}</p>
              </div>
            </div>
            <Table className="">
              <TableHeader className="bg-blue-500">
                <TableRow>
                  <TableHead className="w-[100px] border-r-2 border-r-white text-white">#</TableHead>
                  <TableHead className="border-r-2 border-r-white text-white">Services</TableHead>
                  <TableHead className="border-r-2 border-r-white text-white">Type</TableHead>
                  <TableHead className="border-r-2 border-r-white text-white">Montant</TableHead>
                  <TableHead className="border-r-2 border-r-white text-white">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className={clsx("bg-blue-200 dark:bg-gray-800")} key={'000_1'}>
                  <TableCell className="border-r-2 border-r-white font-medium">{1}</TableCell>
                  <TableCell className="border-r-2 border-r-white">Location sale</TableCell>
                  <TableCell className="border-r-2 border-r-white">sale</TableCell>
                  <TableCell className="border-r-2 border-r-white text-right">${reservation.room.tarif.price}</TableCell>
                  <TableCell className="border-r-2 border-r-white text-right">${reservation.room.tarif.price * reservation?.numbre_jour}</TableCell>
                </TableRow>
                {
                  reservation.res_serv.map((item, index) => (
                    <TableRow className={clsx("", {
                      "bg-blue-200 dark:bg-gray-800": index + 1 % 2
                    })} key={item.id}>
                      <TableCell className="border-r-2 border-r-white font-medium">{index + 1}</TableCell>
                      <TableCell className="border-r-2 border-r-white">{item.name}</TableCell>
                      <TableCell className="border-r-2 border-r-white">{item.person ? "personne" : "sale"}</TableCell>
                      <TableCell className="border-r-2 border-r-white text-right">${item.price}</TableCell>
                      <TableCell className="border-r-2 border-r-white text-right">${item.price * (item.person ? reservation?.number_person ? reservation.number_person : 0 : 1) * reservation?.numbre_jour}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <div className="flex justify-between mt-2">
              <div>
                <div>
                  <p className="font-bold">Termes et conditions:</p>
                  Le paiement est dû dans les 15 jours  <br /> à compter de la date de facture.
                </div>
              </div>
              <div className="flex  items-end justify-end ">
                <Table className="w-80">
                  <TableBody className="font-bold">
                    <TableRow>
                      <TableCell className="border-r-2 border-r-white">Subtotal</TableCell>
                      <TableCell className="border-r-2 border-r-white text-right">${total}</TableCell>
                    </TableRow>
                    {/* <TableRow>
                      <TableCell className="border-r-2 border-r-white">Tax (16%)</TableCell>
                      <TableCell className="border-r-2 border-r-white text-right">$31.85</TableCell>
                    </TableRow> */}
                    <TableRow className="bg-blue-500">
                      <TableCell className="border-r-2 border-r-white text-white">Total Amount</TableCell>
                      <TableCell className="border-r-2 border-r-white text-right text-white">${total}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 ">
              <div>
                <p><b>Thank you </b> once again for entrusting <br />us with your dessert catering.</p>
              </div>
              <div className="flex flex-col pb-4 items-center justify-center">
                <div className="flex w-72 flex-col items-center justify-center gap-4 pb-4 border-b-2 border-b-black dark:border-b-white">
                  <p><span className="font-bold">Date: </span> {moment(reservation.reservation.createdAt).format("LL")}</p>
                  <Image
                    src={"/signature.jpg"}
                    width={100}
                    height={100}
                    alt="signature"
                  />
                </div>
                <p className="font-bold">
                  Adonai Mbula
                </p>
                <p> Manager</p>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export const ReservationReportingPrint = React.forwardRef(({ filter, data_print }: {
  data_print: IReservation[],
  filter: {
    keyWord: string;
    dateDebutFilter: Date | undefined;
    dateFinFilter: Date | undefined;
    statusFilter: Set<ReservationStatusEnum> | "all"
  }
}, ref: React.LegacyRef<HTMLDivElement> | undefined) => {
  let status = '';
  if (filter.statusFilter !== "all") {
    let e: string[] = []
    filter.statusFilter.forEach((item) => {
      let name = statusOptions.find(e => e.uid === item)?.name;
      if (name) {
        e.push(name)
      }
    });
    status = e.join(" - ");
  } else {
    status = "Tout"
  }

  return <div className="p-4" ref={ref}>
    <div className="flex w-full items-center justify-between">
      <div className="text-center">
        <Image
          src={`/icon.png`}
          width={100}
          height={100}
          alt="loge easyparty"
        />
        <p className="font-bold text-xl">
          <AppNameUI />
        </p>
      </div>
      <div className="text-center">
        <p className="font-bold text-4xl">
          RAPPORT
        </p>
        <p className="font-meduim text-2xl">
          Réservation
        </p>
      </div>
      <div className="text-rigth">
      </div>
    </div>
    <div className="my-8">
      <p>Date d'impression: {moment().format("DD/MM/YYYY")} </p>
      <p>Filtré par mot clé: {filter.keyWord} </p>
      <p>Filtré par statut: [ {status} ] </p>
      <p>Filtré par période: Dé {filter.dateDebutFilter ? moment(filter.dateDebutFilter).format("DD/MM/YYYY") : "--"} au {filter.dateFinFilter ? moment(filter.dateFinFilter).format("DD/MM/YYYY") : "--"}</p>
    </div>

    <div>
      <Table className="">
        <TableHeader className="bg-blue-500">
          <TableRow>
            <TableHead className="border-r border-r-white text-white">#</TableHead>
            <TableHead className="border-r border-r-white text-white">N°</TableHead>
            <TableHead className="border-r border-r-white text-white">Sale</TableHead>
            <TableHead className="border-r border-r-white text-white">Date</TableHead>
            <TableHead className="border-r border-r-white text-white">Début</TableHead>
            <TableHead className="border-r border-r-white text-white">Fin</TableHead>
            <TableHead className="border-r border-r-white text-white">Jours</TableHead>
            <TableHead className="text-white">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            data_print.map((item, index) => {
              return (
                <TableRow
                  className={clsx("", {
                    "bg-blue-200 dark:bg-gray-800": index % 2
                  })}
                  key={item.id}
                >
                  <TableCell className="border-r border-r-white font-medium">{index + 1}</TableCell>
                  <TableCell className="border-r border-r-white">000{item.id}</TableCell>
                  <TableCell className="border-r border-r-white">{item.rooms.name}</TableCell>
                  <TableCell className="border-r border-r-white">{moment(item.createdAt).format("DD/MM/YYYY")}</TableCell>
                  <TableCell className="border-r border-r-white">{moment(item.date_start).format("DD/MM/YYYY")}</TableCell>
                  <TableCell className="border-r border-r-white">{moment(item.date_end).format("DD/MM/YYYY")}</TableCell>
                  <TableCell className="border-r border-r-white">{moment(item.date_end).diff(moment(item.date_start)) + 1}</TableCell>
                  <TableCell className="border-r border-r-white"><Chip
                    className="border-none gap-1 text-default-600"
                    color={statusColorMap[item.niveau_reservation]}
                    size="sm"
                    variant="dot"
                  >
                    {statusOptions.find(e => e.uid === item.niveau_reservation)?.name}
                  </Chip>
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </div>
  </div>
});


export const PayementInvocePrint = React.forwardRef(({ data_print }: { data_print: IPayementPrint }, ref: React.LegacyRef<HTMLDivElement> | undefined) => {
  let totalPayer = 0;

  data_print.paiement.map((item) => {
    totalPayer += item.montant_paye_paiement
  })


  return (
    <div className="w-full" ref={ref}>
      <div className="flex flex-col container py-12  gap-8">
        <div className="flex w-full items-center justify-between">
          <div className="text-center">
            <Image
              src={`/icon.png`}
              width={100}
              height={100}
              alt="loge easyparty"
            />
            <p className="font-bold text-xl">
              <AppNameUI />
            </p>
          </div>
          <div className="text-center">
            <p className="font-bold text-4xl">
              Facture de paiement
            </p>
            <p className="font-meduim text-2xl">
              Réservation sale de fête
            </p>
          </div>
        </div>

        <Card className="w-full mt-4">
          <CardContent className="py-4 px-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold">Facturer à:</p>
                <p className="">
                  {capitalize(data_print.user.nom) + '' + capitalize(data_print.user.prenom)} {data_print.user.telephone}
                </p>
                <p>
                  {data_print.user.email}
                </p>
              </div>
              <div>
                <p className="font-bold">INV__{data_print.paiement[data_print.paiement.length - 1].reference_paiement}</p>
                <p>{moment(data_print.paiement[data_print.paiement.length - 1].createdAt).format('LL')}</p>
              </div>
            </div>
            <Table className="">
              <TableBody className="font-bold">
                <TableRow>
                  <TableCell className="border-r-2 border-r-white bg-blue-500">Montant Total</TableCell>
                  <TableCell className="border-r-2 border-r-white bg-blue-200 text-right">${data_print.paiement[0].montant_total_paiement}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r-2 border-r-white bg-blue-500">Montant négocier </TableCell>
                  <TableCell className="border-r-2 border-r-white bg-blue-200 text-right">${data_print.paiement[0].montant_suggerer_paiement}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r-2 border-r-white bg-blue-500">Montant payer</TableCell>
                  <TableCell className="border-r-2 border-r-white bg-blue-200 text-right">${data_print.paiement[data_print.paiement.length - 1].montant_paye_paiement}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r-2 border-r-white bg-blue-500">Montant restant</TableCell>
                  <TableCell className="border-r-2 border-r-white bg-blue-200 text-right">${data_print.paiement[0].montant_suggerer_paiement - totalPayer}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-between mt-2">
              <div>
                <div>
                  <p className="font-bold">Termes et conditions:</p>
                  Le paiement est dû dans les 15 jours  <br /> à compter de la date de facture.
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 ">
              <div>
                <p><b>Thank you </b> once again for entrusting <br />us with your dessert catering.</p>
              </div>
              <div className="flex flex-col pb-4 items-center justify-center">
                <div className="flex w-72 flex-col items-center justify-center gap-4 pb-4 border-b-2 border-b-black dark:border-b-white">
                  <p><span className="font-bold">Date: </span> {moment(data_print.paiement[data_print.paiement.length - 1].createdAt).format("LL")}</p>
                  <Image
                    src={"/signature.jpg"}
                    width={100}
                    height={100}
                    alt="signature"
                  />
                </div>
                <p className="font-bold">
                  Adonai Mbula
                </p>
                <p> Manager</p>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export const PayementReportingPrint = React.forwardRef(({ filter, data_print }: {
  data_print: IPayementPrint[], filter: {
    keyWord: string;
    dateDebutFilter: Date | undefined;
    dateFinFilter: Date | undefined;
  }
}, ref: React.LegacyRef<HTMLDivElement> | undefined) => {
  let TmontantTotal = 0;
  let Tmontant_paye_paiement = 0;
  let Tmontant_suggere_paiement = 0;
  let Tmontant_endete_paiement = 0;
  let Tmontant_marge_beneficiary_paiement = 0;
  let Tmontant_pending_payement = 0;

  data_print.map((item) => {
    item.paiement.map((p) => {
      Tmontant_paye_paiement += p.montant_paye_paiement;
    });
    TmontantTotal += item.paiement[0]?.montant_total_paiement;
    Tmontant_suggere_paiement += item.paiement[0]?.montant_suggerer_paiement

    Tmontant_marge_beneficiary_paiement += TmontantTotal - Tmontant_suggere_paiement
  });
  Tmontant_endete_paiement += Tmontant_suggere_paiement - Tmontant_paye_paiement

  data_print.map((item) => {
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
    // {
    //   title: "Montant en attente",
    //   price: Tmontant_pending_payement
    // },
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

  return <div className="p-4" ref={ref}>
    <div className="flex w-full items-center justify-between">
      <div className="text-center">
        <Image
          src={`/icon.png`}
          width={100}
          height={100}
          alt="loge easyparty"
        />
        <p className="font-bold text-xl">
          <AppNameUI />
        </p>
      </div>
      <div className="text-center">
        <p className="font-bold text-4xl">
          RAPPORT
        </p>
        <p className="font-meduim text-2xl">
          Paeiment
        </p>
      </div>
      <div className="text-rigth">
        <p>Date d'impression: {moment().format("DD/MM/YYYY")} </p>
        <p>Filtré par mot clé: {filter.keyWord} </p>
        <p>Filtré par période: Dé {filter.dateDebutFilter ? moment(filter.dateDebutFilter).format("DD/MM/YYYY") : "--"} au {filter.dateFinFilter ? moment(filter.dateFinFilter).format("DD/MM/YYYY") : "--"}</p>
      </div>
    </div>
    <div className="grid grid-cols-5 justify-center gap-4 my-4">
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
    <div>
      <Table className="">
        <TableHeader className="bg-blue-500">
          <TableRow>
            <TableHead className="border-r border-r-white text-white">#</TableHead>
            <TableHead className="border-r border-r-white text-white">Reference</TableHead>
            <TableHead className="border-r border-r-white text-white">Réservation</TableHead>
            <TableHead className="border-r border-r-white text-white">Date</TableHead>
            <TableHead className="border-r border-r-white text-white">Methode</TableHead>
            <TableHead className="border-r border-r-white text-white">Montant total</TableHead>
            <TableHead className="border-r border-r-white text-white">Montant suggere</TableHead>
            <TableHead className="border-r border-r-white text-white">Montant payer</TableHead>
            <TableHead className="text-white">Montant restant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            data_print.map((item, index) => {
              let t = 0
              let g = item.paiement[0].montant_suggerer_paiement

              item.paiement.map((e) => {
                t += e.montant_paye_paiement
              })
              return (
                <TableRow
                  className={clsx("", {
                    "bg-blue-200 dark:bg-gray-800": index % 2
                  })}
                  key={item.id}
                >
                  <TableCell className="border-r border-r-white font-medium">{index + 1}</TableCell>
                  <TableCell className="border-r border-r-white">{item.paiement[item.paiement.length - 1].reference_paiement}</TableCell>
                  <TableCell className="border-r border-r-white">000{item.id}</TableCell>
                  <TableCell className="border-r border-r-white">{moment(item.paiement[item.paiement.length - 1].createdAt).format("DD/MM/YYYY")}</TableCell>
                  <TableCell className="border-r border-r-white">{item.paiement[0].mode_paiement}</TableCell>
                  <TableCell className="border-r border-r-white text-right">${item.paiement[0].montant_total_paiement}</TableCell>
                  <TableCell className="border-r border-r-white text-right">${g}</TableCell>
                  <TableCell className="border-r border-r-white text-right">${t}</TableCell>
                  <TableCell className="text-right">${g - t}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </div>
  </div>
});
