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
import { ChipProps } from "@nextui-org/chip";
import { Input } from "../../ui/input";
import { columns } from "./data";
import { Pagination } from "@nextui-org/pagination";
import { DollarSignIcon, PrinterIcon, SearchIcon, } from "lucide-react";
import { Session } from "next-auth/types";
import moment from "moment";
import { IPayementCurrent, IPayementPrint } from "@/app/types/interfaces";
import { CreatePayementApi, FindAllPaymentApi, FindPaymentByReservationIdApi } from "@/app/lib/actions/payement/payement.req";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { Button } from "../../ui/button";
import { LabelInputContainer } from "../../auth/signin/signin.ui";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"

import { useToast } from "../../ui/use-toast";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";
import { PayementInvocePrint, PayementReportingPrint } from "../../print";
import { Pending } from "../../pending";
import { Label } from "../../ui/label";
import { DatePickerUI } from "../../ui/date-picker";

const statusColorMap: Record<string, ChipProps["color"]> = {
  payment_confim: "success",
  pending: "danger",
  consume: "secondary",
  cancel: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["#", "reference", "date", "methode", "reservation", "montant_total", "montant_paye", "montant_suggere", "montant_reste", "actions"]

export default function PaymentSsrTableUI({ initData, session, }: { session: Session; initData: IPayementCurrent[] }) {
  const { user } = session
  const [payement, setPayement] = useState<IPayementCurrent[]>(initData);
  const [dateDebut, setDateDebut] = useState<Date>();
  const [dateFin, setDateFin] = useState<Date>();

  const [dateDebutFilter, setDateDebutFilter] = useState<Date>();
  const [dateFinFilter, setDateFinFilter] = useState<Date>();

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<String>>(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState<Set<String>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<"all">("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const router = useRouter();

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let i = 1;

  const pages = Math.ceil(payement.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === new Set(['all'])) return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let Findpayement = [...payement];

    if (hasSearchFilter) {
      Findpayement = Findpayement.filter((item) =>
        item.paiement[item.paiement.length - 1].reference_paiement.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        item.paiement[item.paiement.length - 1].montant_total_paiement.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        item.paiement[item.paiement.length - 1].montant_suggerer_paiement.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        item.paiement[item.paiement.length - 1].mode_paiement.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        `000${item.id}`.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
        `${moment(item.paiement[item.paiement.length - 1].createdAt).format("DD/MM/YYYY")}`.toString().toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   Findpayement = Findpayement.filter((res) =>
    //     Array.from(statusFilter).includes(res.status),
    //   );
    // }

    if (dateDebutFilter || dateFinFilter) {
      const start = moment(dateDebutFilter);
      const end = moment(dateFinFilter);

      Findpayement = Findpayement.filter((item) => {
        const d = moment(item.paiement[item.paiement.length - 1].createdAt);
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

    return Findpayement;
  }, [payement, filterValue, statusFilter, dateDebutFilter, dateFinFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof IPayementCurrent] as number;
      const second = b[sortDescriptor.column as keyof IPayementCurrent] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (res: IPayementCurrent, columnKey: React.Key) => {
      let t = 0
      let g = res.paiement[0].montant_suggerer_paiement

      res.paiement.map((item) => {
        t += item.montant_paye_paiement
      })
      switch (columnKey) {
        case "#":
          return <p>{i++}</p>;
        case "date":
          return <p>{moment(res.createdAt).format("DD/MM/YYYY")}</p>;
        case "reservation":
          return (
            <div className="">
              <p>000{res.id}</p>
            </div>
          );
        case "reference":
          return <p>{res.paiement[res.paiement.length - 1].reference_paiement}</p>
        case "methode":
          return <p>{res.paiement[0].mode_paiement}</p>
        case "montant_total":
          return <p>{res.paiement[0].montant_total_paiement}$</p>
        case "montant_suggere":
          return <p>{g}$</p>
        case "montant_paye":
          return <p>{t}$</p>
        case "montant_reste":
          return <p>{g - t}$</p>
        case "actions":
          return (
            <Actions
              handleFindReservartion={handleFindPayement}
              payement={res}
              setPayement={setPayement}
              all_payement={payement}
            />
          );
        default:
          return <></>;
      }
    }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onFilterByDateRange = React.useCallback(() => {
    setDateDebutFilter(dateDebut);
    setDateFinFilter(dateFin)

  }, [dateDebut, dateFin, dateDebutFilter, dateFinFilter]);

  const handleFindPayement = async () => {
    if (session) {
      const { user } = session
      let findPayement: IPayementCurrent[] = await FindAllPaymentApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

      if (!findPayement?.hasOwnProperty('StatusCode') && !findPayement?.hasOwnProperty('message')) {
        setPayement(findPayement)
      }
    }
  };

  const handelDateDebutChange: React.Dispatch<React.SetStateAction<Date | undefined>> = (e) => {
    setDateDebut(e);
  }

  const handelDateFinChange: React.Dispatch<React.SetStateAction<Date | undefined>> = (e) => {
    setDateFin(e);
  }

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
            <DatePickerUI label="Sélectionner une date" date={dateDebut} setDate={handelDateDebutChange} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="date_fin">Date de fin</Label>
            <DatePickerUI label="Sélectionner une date" date={dateFin} setDate={handelDateFinChange} />
          </LabelInputContainer>
          <div className="flex gap-3">
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
            Total {payement.length} payement
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
    handlePrint,
    componentRef.current,
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    dateDebut,
    dateFin,
    handelDateDebutChange,
    handelDateFinChange,
    onFilterByDateRange,
    dateDebutFilter,
    dateFinFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="">
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
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter, componentRef]);

  const classNames = React.useMemo(
    () => ({
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
    }),
    []
  );


  return (
    <main className="">
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
        <TableBody emptyContent={"Aucun payement trouvé"} items={sortedItems}>
          {(item: IPayementCurrent) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="hidden">
        <PayementReportingPrint
          filter={{
            keyWord: filterValue,
            dateDebutFilter,
            dateFinFilter
          }}
          data_print={sortedItems}
          ref={componentRef}
        />
      </div>

    </main>
  );
}

export const Actions = ({
  payement,
  all_payement,
  setPayement,
  handleFindReservartion,
}: {
  payement: IPayementCurrent;
  setPayement: Dispatch<SetStateAction<IPayementCurrent[]>>;
  all_payement: IPayementCurrent[];
  handleFindReservartion: () => void;
}) => {

  const [isDete, setIsDete] = useState<boolean>(false);
  const [amountPayment, setAmountPayment] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [data_print, setData_print] = useState<IPayementPrint>(payement)
  const [pending, setPending] = useState<boolean>(false)

  const { toast } = useToast();

  const router = useRouter();

  const componentRef = useRef(null);

  const print = useReactToPrint({
    documentTitle: `EasyParty_INVOICE_REF${payement.paiement[payement.paiement.length - 1].reference_paiement}`,
    content: () => componentRef.current,
  });


  const handlePrint = () => {
    setTimeout(() => {
      print()
    });
  }

  const handleCreatePayement = async () => {
    if (amountPayment > 0) {
      setPending(true);
      const create = await CreatePayementApi({
        paeiment: {
          montant_total_paiement: payement.paiement[0].montant_total_paiement,
          mode_paiement: payement.paiement[0].mode_paiement,
          montant_paye_paiement: amountPayment,
          montant_suggerer_paiement: payement.paiement[0].montant_suggerer_paiement,
          reference_paiement: moment().unix().toString()
        },
        reservation: {}
      }, payement?.id);

      if (!create?.hasOwnProperty('StatusCode') && !create?.hasOwnProperty('message')) {
        if (payement) {
          const find = await FindPaymentByReservationIdApi(payement?.id);
          if (!find?.hasOwnProperty('StatusCode') && !find?.hasOwnProperty('message')) {
            console.log(find);

            toast({
              title: "Payement",
              description: "Le payment se bien passer",
            });
            setPending(false);
            setData_print(find)

            setTimeout(() => {
              handlePrint()
              handleFindReservartion()
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
    } else {

    }
  }

  useEffect(() => {
    let g = payement.paiement[0].montant_suggerer_paiement;
    let p = 0
    payement.paiement.map((item) => {

      p += item.montant_paye_paiement;
    });
    setIsDete(g > p)
  }, [isDete]);

  return (
    <div className="relative flex justify-end items-center gap-2">
      <Button size="icon" variant="outline" onClick={handlePrint}>
        <PrinterIcon className="text-default-400" />
      </Button>
      {isDete &&
        <Dialog open={open} onOpenChange={(open) => { setOpen(open) }}>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline">
              <DollarSignIcon className="text-default-400" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Comfirmer le payement</DialogTitle>
              <DialogDescription>
                <div>
                  <Label htmlFor="number_personne">Montant proposer</Label>
                  <Input className="w-full" id="number_personne"
                    value={amountPayment} onChange={(e) => { setAmountPayment(parseInt(e.target.value)) }}
                    placeholder="Montant à payer"
                    type="number" />
                </div>
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
                {pending ? <Pending /> : "Confirmer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }

      <div className="hidden">
        {
          data_print && <PayementInvocePrint data_print={data_print} ref={componentRef} />
        }
      </div>
    </div>
  );
};

