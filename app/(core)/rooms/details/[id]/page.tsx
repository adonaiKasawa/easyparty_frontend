"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FindRoomByIdApi } from "@/app/lib/actions/rooms/rooms.req";
import { local_file_url } from "@/app/lib/actions/action";
import { IRooms, IServices, IUser } from "@/app/types/interfaces";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";

import { Button } from "@/app/components/ui/button";
import { LabelInputContainer } from "@/app/components/auth/signin/signin.ui";
import { DatePickerUI } from "@/app/components/ui/date-picker";
import { ReservationRoomsApi } from "@/app/lib/actions/reservation/reservation.req";
import { useToast } from "@/app/components/ui/use-toast";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { ChevronDownIcon } from "lucide-react";
import { capitalize } from "@/app/config/tools";
import { FindServicesApi } from "@/app/lib/actions/services/services.req";
import moment from "moment";
import { findUserByPrivilegeApi } from "@/app/lib/actions/auth";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";

export default function DetailsRoomPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<IRooms>();
  const [index, setIndex] = useState<number>(0)
  const [date, setDate] = useState<Date>();
  const [dateFin, setDateFin] = useState<Date>();
  const [servicesListe, setServicesListe] = useState<IServices[]>([]);
  const [servicesSelected, setServicesSelected] = useState<IServices[]>([]);
  const [numberPerson, setNumberPerson] = useState<number>(0);
  const [totalJours, setTotalJours] = useState<number>(0);
  const [client, setClient] = useState<number>(0);
  const [clients, setClients] = useState<IUser[]>([]);

  const { toast } = useToast();


  const handelFindRoomById = useCallback(async () => {
    const find = await FindRoomByIdApi(params.id);
    if (!find.hasOwnProperty('StatusCode') && !find.hasOwnProperty('message')) {
      console.log(find.id);
      setRoom(find)
    }
  }, [room]);

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

  const handelReservationRooms = async () => {
    if (date && dateFin && room?.id) {
      if (client !== 0) {
        if (numberPerson > 0 && numberPerson <= room?.capacity) {
          let services: number[] = []
          servicesSelected.forEach((item) => {
            services.push(item.id)
          })
          console.log(services);

          const req = await ReservationRoomsApi({
            date_start: date,
            date_end: dateFin,
            roomId: room.id,
            number_person: numberPerson,
            reservice: services,
            clientId: client
          });
          if (!req.hasOwnProperty('StatusCode') && !req.hasOwnProperty('message')) {
            toast({
              title: "Réservation réussi",
              description: "Votre servation se bien passer",
            });
          } else {
            let message = '';
            if (typeof req.message === "object") {
              req.message.map((item: string) => message += `${item} \n`)
            } else {
              message = req.message;
            }
            toast({
              variant: "destructive",
              title: "Réservation échouée.",
              description: message,
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: `Le nombre de personne doit etre inferieur ou égale à ${room.capacity}.`,
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "Client inconnut",
          description: "Assurez-vous de bien vérifier client de votre réservation ou enregistrez le en cas d'un nouveau client.",
        })
      }
    } else {
      toast({
        variant: "destructive",
        title: "La date de la réservation est obligatoire",
        description: "Assurez-vous de bien vérifier la date de votre réservation.",
      })
    }

  }

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
    handelFindRoomById();
    handleFindServices();
    handleFindClients();
  }, [])

  return <main className="container px-24 py-8">
    <p className="text-center font-bold text-5xl my-4">Réservation</p>
    {room &&
      <div className="w-full flex justify-between gap-4">
        <div className="w-full flex flex-col gap-4 p-4 rounded-xl border bg-card text-card-foreground">
          <div className="flex justify-between ">
            <p className="font-medium">Nom:</p>
            <p className="text-end">{room.name}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Capacite:</p>
            <p className="text-end">{room.capacity}prs</p>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="number_personne">Client</Label>
            <Select value={client.toString()} onValueChange={(e) => { setClient(parseInt(e)) }}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Type de compte" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((item) => (
                  <SelectItem value={item.id.toString()} >
                    <p className="font-bold">{item.nom} {item?.prenom}</p> <br />
                    <p className="text-sm text-neutral-500">({item.telephone} {item?.email})</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>


        <div className="w-full flex flex-col gap-4 px-8 py-4  rounded-xl border bg-card text-card-foreground">
          <p className="text-center text-2xl font-medium">Facturation</p>
          <div className="flex justify-between border-b pb-2">
            <p className="font-medium">Location salle ({room.tarif?.price}$ / jrs)</p>
            <p className="font-bold">{room.tarif.price * (totalJours > 0 ? totalJours : 1)}$</p>
          </div>
          {servicesSelected.map((item) => {
            return <div className="flex justify-between border-b pb-2">
              <p className="font-medium">{item.name} ( {item.price}$ {item.person && `/ prs `}  / jrs )</p>
              <p className="font-bold">{item.price * (item.person ? numberPerson : 1) * (totalJours > 0 ? totalJours : 1)}$</p>
            </div>
          })}
          <div className="text-center"><p className="text-neutral-500 font-medium">Montant</p> <br />
            <p className="text-4xl font-bold">
              {
                handleCalculet()
              }$
            </p>
          </div>

          <Button onClick={handelReservationRooms}>
            Vérifier & Réserver
          </Button>
        </div>
      </div>
    }

  </main>

}


export function CarouselSpacing({ visuals, setIndex, index }: { visuals: string[], setIndex: React.Dispatch<React.SetStateAction<number>>, index: number }) {
  return (
    <Carousel className="ml-4">
      <CarouselContent className="">
        {visuals.map((item, i) => (
          <CarouselItem onClick={() => { setIndex(i) }} key={i} className={"md:basis-1/2 lg:basis-1/3 cursor-pointer"}>
            <div className={index === i ? "border-blue-500 border-2 rounded-lg" : ""}>
              <Image
                src={`${local_file_url}${item}`}
                width={100}
                height={100}
                style={{
                  height: 100
                }}
                alt={item}
                className="w-full rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}




//  {/* <div className="">
//           <Card className="">
//             <CardHeader>
//               <CardTitle className="font-bold text-5xl">
//                 {room?.name}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Image
//                 src={`${local_file_url}${room.visuals[index]}`}
//                 width={2000}
//                 height={2000}
//                 alt={room.visuals[index]}
//                 className="w-full rounded-lg"
//               />
//             </CardContent>
//             <CardFooter className="flex items-center justify-center">
//               <div>
//                 <CarouselSpacing index={index} setIndex={setIndex} visuals={room.visuals} />
//               </div>
//             </CardFooter>
//           </Card>
//         </div> */}


// {/* <div className="flex justify-between">
//   <p className="text-neutral-500 font-medium">Équipement:</p>
//   <p className="text-end">
//     {room.equipment.map((item) => (
//       <>
//         {item} < br />
//       </>
//     ))}
//   </p>
// </div> */}
// {/* <div className="flex justify-between">
//   <p className="text-neutral-500 font-medium">Service:</p>
//   <p className="text-end">
//     {room.additional_services.map((item) => (
//       <>
//         {item} < br />
//       </>
//     ))}
//   </p>
// </div> */}
// {/* <div className="flex justify-between">
//   <p className="text-neutral-500 font-medium">Adresse:</p>
//   <p className="text-end">{room.adress}</p>
// </div> */}
// {/* <div className="flex justify-between">
//   <p className="text-neutral-500 font-medium">Ville:</p>
//   <p className="text-end">{room.city}</p>
// </div> */}
// {/* <div className="flex justify-between">
//   <p className="text-neutral-500 font-medium">Pays:</p>
//   <p className="text-end">{room.country}</p>
// </div> */}