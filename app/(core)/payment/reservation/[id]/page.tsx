"use client";

import { LabelInputContainer } from "@/app/components/auth/signin/signin.ui";
import { Button } from "@/app/components/ui/button";
import { DatePickerUI } from "@/app/components/ui/date-picker";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useToast } from "@/app/components/ui/use-toast";
import { capitalize } from "@/app/config/tools";
import { findUserByPrivilegeApi } from "@/app/lib/actions/auth";
import { FindAllReservatioByIdApi } from "@/app/lib/actions/reservation/reservation.req";
import { FindServicesApi } from "@/app/lib/actions/services/services.req";
import { PaymentModeEnum, PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { IPayementPrint, IReservation, IRooms, IServices, IUser } from "@/app/types/interfaces";
import { ChevronDownIcon } from "lucide-react";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CreatePayementApi, FindPaymentByReservationIdApi } from "@/app/lib/actions/payement/payement.req";
import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";
import { PayementInvocePrint } from "@/app/components/print";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";

export default function PaymentReservation({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<IRooms>();
  const [reservation, setReservation] = useState<IReservation>();
  const [index, setIndex] = useState<number>(0)
  const [date, setDate] = useState<Date>();
  const [dateFin, setDateFin] = useState<Date>();
  const [servicesListe, setServicesListe] = useState<IServices[]>([]);
  const [servicesSelected, setServicesSelected] = useState<IServices[]>([]);
  const [numberPerson, setNumberPerson] = useState<number>(0);
  const [totalJours, setTotalJours] = useState<number>(0);
  const [client, setClient] = useState<number>(0);
  const [clients, setClients] = useState<IUser[]>([]);

  const [amountSuggest, setAmountSuggest] = useState<number>()
  const [amountPayment, setAmountPayment] = useState<number>(0)
  const [modeOfPayment, setModeOfPayment] = useState<PaymentModeEnum>(PaymentModeEnum.FULL_PAYMENT)

  const [data_print, setData_print] = useState<IPayementPrint>()

  const [open, setOpen] = useState<boolean>(false)
  const [pending, setPending] = useState<boolean>(false)

  const { toast } = useToast();
  const router = useRouter();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => onAfterPrint()
  });

  const onAfterPrint = () => {
    router.push("/payment")
  }

  const handelFindReservationById = useCallback(async () => {
    const find: IReservation = await FindAllReservatioByIdApi(parseInt(params.id));
    if (!find.hasOwnProperty('StatusCode') && !find.hasOwnProperty('message')) {
      console.log(find.id);
      setReservation(find)
      setRoom(find.rooms)
      if (find.res_serv) {
        const services: IServices[] = [];
        find?.res_serv?.map((item) => {
          services.push(item.service)
        });
        setClient(find.user.id)
        setServicesSelected(services);
        handeDateChange(find.date_start)
        handeDateFinChange(find.date_end)
        setNumberPerson(find.number_person)
        const start = moment(find.date_start.toString())
        const end = moment(find.date_end.toString())
        const daysDiff = end.diff(start, 'days');
        setTotalJours(daysDiff + 1)
      }
    }
  }, [reservation]);

  const handleCreatePayement = async () => {
    if (reservation) {
      if (amountSuggest && amountSuggest > 0) {
        if (amountPayment > 0) {
          let services: number[] = []
          servicesSelected.forEach((item) => {
            services.push(item.id)
          })
          setPending(true);
          const create = await CreatePayementApi({
            paeiment: {
              montant_total_paiement: handleCalculet(),
              mode_paiement: modeOfPayment,
              montant_paye_paiement: amountPayment,
              montant_suggerer_paiement: amountSuggest,
              reference_paiement: moment().unix().toString()
            },
            reservation: {
              number_person: numberPerson,
              clientId: client,
              reservice: services,
              niveau_reservation: ReservationStatusEnum.PC,
              roomId: room?.id,
              date_end: dateFin,
              date_start: date
            }
          }, reservation?.id);

          if (!create?.hasOwnProperty('StatusCode') && !create?.hasOwnProperty('message')) {
            if (reservation) {
              const payement = await FindPaymentByReservationIdApi(reservation?.id);
              if (!payement?.hasOwnProperty('StatusCode') && !payement?.hasOwnProperty('message')) {
                console.log(payement);

                toast({
                  title: "Payement",
                  description: "Le payment se bien passer",
                });
                setPending(false);
                setData_print(payement)

                setTimeout(() => {
                  handlePrint()
                })
              }
            }
          } else {
            let message = '';
            if (typeof create.message === "object") {
              create.message.map((item: string) => message += `${item} \n`)
            } else {
              message = create.message;
            }
            toast({
              variant: "destructive",
              title: "Paiement échouée.",
              description: message,
            });
          }
        }
      } else {
        toast({
          variant: "destructive",
          title: "Paeiment échouée.",
          description: "Veuillez saisir le montant proposé par le client.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Paeiment échouée.",
        description: "La réservation n'esxite pas.",
      });
    }
  }

  const handleFindServices = useCallback(async () => {
    let find: IServices[] = await FindServicesApi();

    if (!find?.hasOwnProperty('StatusCode') && !find?.hasOwnProperty('message')) {
      setServicesListe(find);
    }
  }, [servicesListe]);

  const handleFindClients = useCallback(async () => {
    let findAllUser: IUser[] = await findUserByPrivilegeApi(PrivilegesEnum.CLT)
    if (!findAllUser?.hasOwnProperty('StatusCode') && !findAllUser?.hasOwnProperty('message')) {
      setClients(findAllUser)
    }
  }, [clients]);

  const handeDateChange: React.Dispatch<React.SetStateAction<Date | undefined>> = (e) => {
    setDate(e)
    if (dateFin && e) {
      const start = moment(e.toString())
      const end = moment(dateFin.toString())
      const daysDiff = end.diff(start, 'days');
      setTotalJours(daysDiff + 1)
    }
  }

  const handeDateFinChange: React.Dispatch<React.SetStateAction<Date | undefined>> = (e) => {
    setDateFin(e)
    if (date && e) {
      const start = moment(date.toString())
      const end = moment(e.toString())
      const daysDiff = end.diff(start, 'days');
      setTotalJours(daysDiff + 1)
    }
  }

  const handleCalculet = () => {
    let total = 0

    if (room) {
      total = room.tarif.price * (totalJours > 0 ? totalJours : 1)
      servicesSelected.map((item) => {
        total += item.price * (item.person ? numberPerson : 1) * (totalJours > 0 ? totalJours : 1)
      })
    }
    return total
  }

  useEffect(() => {
    handelFindReservationById();
    handleFindServices();
    handleFindClients();
  }, [])

  return <main className="container px-24 py-8">
    <p className="text-center font-bold text-2xl my-4">Paeiment de la réservation</p>
    {(reservation && room) &&
      <div className="w-full flex justify-between gap-4">
        <div className="w-full flex flex-col gap-4 p-4 rounded-xl border bg-card text-card-foreground">
          <div className="flex justify-between ">
            <p className="font-medium">Nom:</p>
            <p className="text-end">{room.name}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Capacite:</p>
            <p className="text-end">{room?.capacity}prs</p>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="number_personne">Client</Label>
            <div>
              <p className="font-medium text-right">
                {capitalize(`${reservation.user.nom} ${reservation.user?.prenom}`)}
              </p>
              <p className="text-neutral-500 text-right">
                {reservation.user.telephone}; {reservation.user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="number_personne">Nombre de personne</Label>
            <Input id="number_personne" value={numberPerson} onChange={(e) => { setNumberPerson(parseInt(e.target.value)) }} placeholder="Nombre de personne" type="number" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="number_personne">Service additionnel</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden sm:flex">
                <Button
                  variant="outline"
                  className="gap-4"
                >
                  Services
                  <ChevronDownIcon size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                aria-label="Table Columns"
              >
                <DropdownMenuGroup>
                  {servicesListe.map((list) => {
                    let checked = false

                    servicesSelected.forEach((select) => {
                      if (list.id === select.id) {
                        checked = true
                      }
                    })

                    const onCheckedChange = (e: boolean) => {
                      let r: IServices[] = []
                      servicesSelected.forEach((item) => {
                        r.push(item)
                      })
                      if (e) {
                        r.push(list)
                      } else {
                        r = r.filter((i) => i.id !== list.id)
                      }
                      setServicesSelected(r)
                    }

                    return (
                      <DropdownMenuCheckboxItem
                        checked={checked}
                        key={list.id}
                        className="capitalize"
                        onCheckedChange={onCheckedChange}

                      >
                        {capitalize(list.name)}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuGroup>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <LabelInputContainer className="">
              <Label>Date de debut</Label>
              <DatePickerUI label="Sélectionner une date" date={date} setDate={handeDateChange} />
            </LabelInputContainer>
          </div>
          <div>
            <LabelInputContainer className="">
              <Label>Date de fin</Label>
              <DatePickerUI label="Sélectionner une date" date={dateFin} setDate={handeDateFinChange} />
            </LabelInputContainer>
          </div>
          <div className="flex justify-between">
            <p>Nombre de total de jours</p>
            <p>{totalJours > 0 ? totalJours : 1} jours</p>
          </div>
          <hr />
          <p className="text-center font-medium">Proposition du paeiment</p>
          <div>
            <Label htmlFor="number_personne">Montant proposer</Label>
            <Input className="w-full" id="number_personne"
              value={amountSuggest} onChange={(e) => {
                setAmountSuggest(parseInt(e.target.value));
                if (modeOfPayment === PaymentModeEnum.FULL_PAYMENT) {
                  setAmountPayment(parseInt(e.target.value));
                }
              }}
              placeholder="Montant proposer"
              type="number" />
          </div>
          <div>
            <Label htmlFor="number_personne">Mode de paiement</Label>
            <Select value={modeOfPayment} onValueChange={(e: PaymentModeEnum) => {
              setModeOfPayment(e);
              if (e === PaymentModeEnum.FULL_PAYMENT) {
                if (amountSuggest) {
                  setAmountPayment(amountSuggest)
                }
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Mode de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentModeEnum.FULL_PAYMENT}>{PaymentModeEnum.FULL_PAYMENT}</SelectItem>
                <SelectItem value={PaymentModeEnum.PARTIAL_PAYMENT}>{PaymentModeEnum.PARTIAL_PAYMENT}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {modeOfPayment === PaymentModeEnum.PARTIAL_PAYMENT && <div>
            <Label htmlFor="number_personne">Montant du premier payer</Label>
            <Input id="number_personne"
              value={amountPayment} onChange={(e) => { setAmountPayment(parseInt(e.target.value)) }}
              placeholder="Montant du premier payer"
              type="number" />
          </div>}
        </div>


        <div className="w-full  flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4 px-8 py-4  rounded-xl border bg-card text-card-foreground">
            <p className="text-center text-2xl font-medium">Facturation</p>
            <div className="flex justify-between border-b pb-2">
              <p className="font-medium">Location salle ({room.tarif?.price}$ / jrs)</p>
              <p className="font-bold">{room?.tarif.price * (totalJours > 0 ? totalJours : 1)}$</p>
            </div>
            {servicesSelected.map((item) => {
              return <div className="flex justify-between border-b pb-2">
                <p className="font-medium">{item.name} ( {item.price}$ {item.person && `/ prs `}  / jrs )</p>
                <p className="font-bold">{item.price * (item.person ? numberPerson : 1) * (totalJours > 0 ? totalJours : 1)}$</p>
              </div>
            })}
            <div className="text-center"><p className="text-neutral-500 font-medium">Montant</p> <br />
              {(amountSuggest && (handleCalculet() > amountSuggest)) ?
                <>
                  <sup className="text-neutral-400">- {handleCalculet() - amountSuggest}$ </sup>
                  <p className="text-4xl font-bold">{amountSuggest}$ </p>
                  <sub className="p-2 line-through text-neutral-400">{handleCalculet()}$ </sub>
                </>
                : <p className={"text-4xl font-bold"}>{handleCalculet()}$</p>
              }
            </div>


          </div>
          {(amountSuggest && modeOfPayment) ?
            <div className="w-full flex flex-col gap-4 px-8 py-4  rounded-xl border bg-card text-card-foreground">
              <div className="flex justify-between">
                <p>mode de paeiment: </p>
                <p>{modeOfPayment}</p>
              </div>
              <div className="flex justify-between">
                <p>Montant de proposer: </p>
                <p>{amountSuggest}$</p>
              </div>
              <div className="flex justify-between">
                <p>Montant payer: </p>
                <p>{amountPayment}$</p>
              </div>
              <div className="flex justify-between">
                <p>Montant restant: </p>
                <p>{amountSuggest - amountPayment}$</p>
              </div>
            </div> : null}
          <PayementDialog
            handleCreatePayement={handleCreatePayement}
            pending={pending}
            open={open}
            setOpen={setOpen}
            setPending={setPending}
          />
          <div className="hidden">
            {
              data_print && <PayementInvocePrint data_print={data_print} ref={componentRef} />
            }
          </div>
        </div>
      </div>
    }
  </main>

}


export function PayementDialog({
  handleCreatePayement,
  pending,
  setPending,
  open,
  setOpen
}: {
  handleCreatePayement: () => Promise<void>,
  pending: boolean,
  setPending: React.Dispatch<React.SetStateAction<boolean>>,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {



  return <Dialog open={open} onOpenChange={(open) => { setOpen(open) }}>
    <DialogTrigger asChild>
      <Button>Payer</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Comfirmer le payement</DialogTitle>
        <DialogDescription>
          Ets-vous sure de vouloir effectuer ce paeiment
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          disabled={pending}
          onClick={(e) => {
            e.preventDefault();
            handleCreatePayement();
          }}
          type="submit"
        >
          {pending ? <ReloadIcon className="animate-spin" /> : "Confirmer"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}