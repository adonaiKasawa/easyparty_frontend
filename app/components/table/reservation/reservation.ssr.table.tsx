"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  SortDescriptor
} from "@nextui-org/table";
import { Chip, ChipProps } from "@nextui-org/chip";
import { Input } from "../../ui/input";
import { columns, statusOptions } from "./data";
import { Pagination } from "@nextui-org/pagination";
import { ChevronDown, ChevronDownIcon, Search, SearchIcon, } from "lucide-react";
import { Session } from "next-auth/types";
import moment from "moment";
import { IReservation, IResevationPrint, IServices } from "@/app/types/interfaces";
import { capitalize } from "@/app/config/tools";
import { file_url, local_file_url } from "@/app/lib/actions/action";
import { AvatarIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { FindAllReservationApi, UpdateReservationApi } from "@/app/lib/actions/reservation/reservation.req";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { Button } from "../../ui/button";
import Image from "next/image";
import { LabelInputContainer } from "../../auth/signin/signin.ui";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { useToast } from "../../ui/use-toast";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { ReservationPreformatInvocePrint, ReservationReportingPrint } from "../../print";
import { Label } from "../../ui/label";
import { DatePickerUI } from "../../ui/date-picker";

export const statusColorMap: Record<string, ChipProps["color"]> = {
  payment_confim: "success",
  pending: "danger",
  consume: "secondary",
  cancel: "danger",
};


export default function ReservationSsrTableUI({ initData, session, }: { session: Session; initData: IReservation[] }) {
  const { user } = session
  const INITIAL_VISIBLE_COLUMNS = ["#", "#n", "room", "date", "number_days", "date_start", "date_end", "statut", "actions"]

  const [reservation, setReservation] = useState<IReservation[]>(initData);

  const [dateDebut, setDateDebut] = useState<Date>();
  const [dateFin, setDateFin] = useState<Date>();

  const [dateDebutFilter, setDateDebutFilter] = useState<Date>();
  const [dateFinFilter, setDateFinFilter] = useState<Date>();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<String>>(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState<Set<String>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Set<ReservationStatusEnum> | "all">("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  let i = 1;

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(reservation.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === new Set(['all'])) return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let FindReservation = [...reservation];

    if (hasSearchFilter) {
      FindReservation = FindReservation.filter((item) =>
        `000${item.id}`.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        item.rooms.name.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        `${item.user.nom} ${item.user.prenom}`.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        `${item.user.prenom} ${item.user.nom}`.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        item.niveau_reservation.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        `${moment(item.createdAt).format("DD/MM/YYYY")}`.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        `${moment(item.date_start).format("DD/MM/YYYY")}`.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        `${moment(item.date_end).format("DD/MM/YYYY")}`.toString().toLowerCase().includes(filterValue.toLowerCase())

      );
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      FindReservation = FindReservation.filter((res) =>
        Array.from(statusFilter).includes(res.niveau_reservation),
      );
    }

    if (dateDebutFilter || dateFinFilter) {
      const start = moment(dateDebutFilter);
      const end = moment(dateFinFilter);

      FindReservation = FindReservation.filter((item) => {
        const d = moment(item.createdAt);
        if (start.isSame(end)) {
          console.log(start.calendar());
          console.log(d.calendar());
          return d.format("DD/MM/YYYY") === start.format("DD/MM/YYYY")
        } else {
          return d.isBetween(start, end)
        }
      })
      // console.log("change", moment(dateDebutFilter).format("DD/MM/YYYY"));
      // console.log("change", moment(dateFinFilter).format("DD/MM/YYYY"));
    }

    return FindReservation;
  }, [reservation, filterValue, statusFilter, dateDebutFilter, dateFinFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof IReservation] as number;
      const second = b[sortDescriptor.column as keyof IReservation] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (res: IReservation, columnKey: React.Key) => {
      switch (columnKey) {
        case "#":
          return <p>{i++}</p>;
        case "#n":
          return <p>000{res.id}</p>;
        case "date":
          return <p>{moment(res.createdAt).format("DD/MM/YYYY")}</p>;
        case "date_start":
          return <p>{moment(res.date_start).format("DD/MM/YYYY")}</p>;
        case "date_end":
          return <p>{moment(res.date_end).format("DD/MM/YYYY")}</p>;
        case "number_days":
          const s = moment(res.date_start);
          const e = moment(res.date_end);
          return <p>{parseInt(e.diff(s, "days").toString()) + 1}</p>;
        case "room":
          return (
            <div className="">
              <Image
                src={`${local_file_url}${res?.rooms?.visuals[0]}`}
                width={100}
                height={100}
                alt={`${res?.rooms?.visuals[0]}`}
                className="rounded-lg"
              />
              <p>{res.rooms?.name}</p>
            </div>
          );
        case "statut":
          return <Chip
            className="border-none gap-1 text-default-600"
            color={statusColorMap[res.niveau_reservation]}
            size="sm"
            variant="dot"
          >
            {statusOptions.find(item => item.uid === res.niveau_reservation)?.name}
          </Chip>
        case "client":
          return (
            <div className="">
              <p>{res.user?.nom}</p>
            </div>
          );
        case "actions":

          return (
            <>
              {res.niveau_reservation !== ReservationStatusEnum.U &&
                <ActionAnnonce
                  handleFindReservartion={handleFindReservation}
                  reservation={res}
                  setReservation={setReservation}
                  all_reservation={reservation}
                />
              }
            </>
          );
        default:
          return <></>;
      }
    },
    []
  );

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const handleFindReservation: any = async () => {
    if (session) {
      const { user } = session
      let findReservation: IReservation[] = await FindAllReservationApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

      console.log(findReservation);

      if (!findReservation?.hasOwnProperty('StatusCode') && !findReservation?.hasOwnProperty('message')) {
        setReservation(findReservation)
      }
    }
  };

  const onFilterByDateRange = React.useCallback(() => {

    setDateDebutFilter(dateDebut);
    setDateFinFilter(dateFin)

  }, [dateDebut, dateFin, dateDebutFilter, dateFinFilter]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <LabelInputContainer className="">
            <Label>Recherche</Label>
            <Input
              startContent={<SearchIcon className="text-default-300 ml-2" />}
              className="bg-mid-gray"
              id="city"
              value={filterValue}
              onChange={(e) => { setFilterValue(e.target.value) }}
              placeholder="Kinshasa"
              type="text"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="date_debut">Date de fin</Label>
            <DatePickerUI label="Sélectionner une date" date={dateDebut} setDate={setDateDebut} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="date_fin">Date de fin</Label>
            <DatePickerUI label="Sélectionner une date" date={dateFin} setDate={setDateFin} />
          </LabelInputContainer>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden sm:flex">
                <Button
                  variant="outline"
                  className="gap-4"
                >
                  Status
                  <ChevronDownIcon size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                aria-label="Table Columns"
              >
                <DropdownMenuGroup>
                  {statusOptions.map((status) => {
                    let checked = false

                    if (statusFilter !== "all") {
                      statusFilter.forEach((item) => {
                        if (item === status.uid) {
                          checked = true
                        }
                      })
                    } else {
                      checked = true
                    }
                    const onCheckedChange = (e: boolean) => {
                      if (statusFilter !== "all") {
                        let r: ReservationStatusEnum[] = []
                        statusFilter.forEach((item) => {
                          r.push(item)
                        })
                        if (e) {
                          r.push(status.uid)
                        } else {
                          r = r.filter((i) => i !== status.uid)
                        }
                        setStatusFilter(new Set(r))
                      } else {
                        let r: ReservationStatusEnum[] = []
                        statusOptions.map((item) => {
                          if (item.uid !== status.uid) {
                            r.push(item.uid)
                          }
                        })
                        setStatusFilter(new Set(r))
                      }
                    }

                    return (
                      <DropdownMenuCheckboxItem
                        checked={checked}
                        key={status.uid}
                        className="capitalize"
                        onCheckedChange={onCheckedChange}

                      >
                        {capitalize(status.name)}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={onFilterByDateRange}>
              Filtrer
            </Button>
            <Button onClick={handlePrint}>
              Imprimer
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {reservation.length} réservation
          </span>
          <label className="flex items-center text-default-400 text-small">
            Lignes par page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    dateDebut,
    dateFin,
    onFilterByDateRange,
    dateDebutFilter,
    dateFinFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          Tous les éléments séléctionné
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(() => ({
    wrapper: ["max-h-[382px]", "max-w-3xl"],
    th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
    td: [
      // first
      "group-data-[first=true]:first:before:rounded-none",
      "group-data-[first=true]:last:before:rounded-none",
      // middle
      "group-data-[middle=true]:before:rounded-none",
      // last
      "group-data-[last=true]:first:before:rounded-none",
      "group-data-[last=true]:last:before:rounded-none",
    ],
  }), []);

  return (
    <main>
      <Table
        isCompact={false}
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "max-h-[382px] after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={"all"}
        selectionMode="none"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Aucun reservation trouvé"} items={sortedItems}>
          {(item: IReservation) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="hidden">
        <ReservationReportingPrint
          filter={{
            keyWord: filterValue,
            dateDebutFilter,
            dateFinFilter,
            statusFilter
          }}
          data_print={sortedItems}
          ref={componentRef} />
      </div>
    </main>
  );
}

export const ActionAnnonce = ({
  reservation,
  all_reservation,
  setReservation,
  handleFindReservartion,
}: {
  reservation: IReservation;
  setReservation: Dispatch<SetStateAction<IReservation[]>>;
  all_reservation: IReservation[];
  handleFindReservartion: () => void;
}) => {
  const [data_print, setData_print] = useState<IResevationPrint>()

  const { toast } = useToast()
  const router = useRouter();
  const componentRef = useRef(null);
  const print = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    let res_serv: IServices[] = []
    let totalJours = moment(reservation.date_end).diff(moment(reservation.date_start), "days") + 1;
    reservation.res_serv?.map((item) => {
      res_serv.push(item.service)
    })
    setData_print({
      date_start: reservation.date_start,
      date_end: reservation.date_end,
      room: reservation.rooms,
      picture: `${local_file_url}${reservation.rooms.visuals[0]}`,
      number_person: reservation.number_person,
      client: reservation.user,
      niveau_reservation: ReservationStatusEnum.P,
      res_serv,
      numbre_jour: totalJours,
      reservation
    });
    setTimeout(() => {
      print()
    });
  }

  const handleChangeState = async (status: ReservationStatusEnum) => {
    const update = await UpdateReservationApi(reservation.id, { niveau_reservation: status });
    if (
      update.hasOwnProperty("statusCode") &&
      update.hasOwnProperty("message")
    ) {
      let message = "";
      if (typeof update.message === "object") {
        update.message.map((item: string) => (message += `${item} \n`));
      } else {
        message = update.message
      }
      toast({
        title: "Erreur",
        description: message
      })
    } else {
      handleFindReservartion();
      toast({
        title: "Réussi",
        description: 'La modification de la reservation a réussi'
      })
    }
  };


  return (
    <div className="relative flex justify-end items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hidden sm:flex">
          <Button size="icon" variant="ghost">
            <DotsVerticalIcon className="text-default-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-label="Table Columns">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handlePrint}>
              Imprimer
            </DropdownMenuItem>
            {(reservation.niveau_reservation === ReservationStatusEnum.P) &&
              <DropdownMenuItem onClick={() => {
                router.push(`/payment/reservation/${reservation.id}`)
              }}>
                Payer
              </DropdownMenuItem>
            }
            {reservation.niveau_reservation !== ReservationStatusEnum.U &&
              <DropdownMenuItem onClick={() => { handleChangeState(ReservationStatusEnum.C) }}>
                Annuler
              </DropdownMenuItem>
            }
            {reservation.niveau_reservation === ReservationStatusEnum.PC &&
              <DropdownMenuItem onClick={() => { handleChangeState(ReservationStatusEnum.U) }}>
                Consomer
              </DropdownMenuItem>
            }
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="hidden">
        {data_print &&
          <ReservationPreformatInvocePrint reservation={data_print} ref={componentRef} />
        }
      </div>
    </div>
  );
};
