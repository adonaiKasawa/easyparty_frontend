"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { ChevronDown, ChevronDownIcon, PrinterIcon, Search, SearchIcon, } from "lucide-react";
import { Session } from "next-auth/types";
import moment from "moment";
import { IPayement } from "@/app/types/interfaces";
import { capitalize } from "@/app/config/tools";
import { file_url, local_file_url } from "@/app/lib/actions/action";
import { AvatarIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { FindAllPaymentApi } from "@/app/lib/actions/payement/payement.req";
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
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { useToast } from "../../ui/use-toast";

const statusColorMap: Record<string, ChipProps["color"]> = {
  payment_confim: "success",
  pending: "danger",
  consume: "secondary",
  cancel: "danger",
};


export default function PaymentSsrTableUI({ initData, session, }: { session: Session; initData: IPayement[] }) {
  const { user } = session
  const INITIAL_VISIBLE_COLUMNS = user.privilege_user === PrivilegesEnum.CLT ?
    ["#", "reference", "date", "methode", "reservation", "montant", "actions"] : ["#", "reference", "date", "client", "reservation", "methode", "montant", "actions"];

  const [payement, setPayement] = useState<IPayement[]>(initData);
  const [day, setDay] = useState<any[]>([]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<String>>(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState<Set<String>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<"all">("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });
  let i = 1;

  const [page, setPage] = React.useState(1);

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
        item.reference_paiement
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase())
        ||
        item.montant_paiement
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase())

      );
    }

    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   Findpayement = Findpayement.filter((res) =>
    //     Array.from(statusFilter).includes(res.status),
    //   );
    // }


    return Findpayement;
  }, [payement, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof IPayement] as number;
      const second = b[sortDescriptor.column as keyof IPayement] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (res: IPayement, columnKey: React.Key) => {
      switch (columnKey) {
        case "#":
          return <p>{i++}</p>;
        case "date":
          return <p>{moment(res.createdAt).format("DD/MM/YYYY")}</p>;
        case "reservation":
          return (
            <div className="">
              <p>000{res.reservation?.id}</p>
            </div>
          );
        case "reference":
          return <p>{res.reference_paiement}</p>
        case "methode":
          return <p>{res.method_paiement}</p>

        case "montant":
          return <p>{res.montant_paiement}$</p>

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
    },
    []
  );

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

  const handleFindPayement: any = async () => {
    if (session) {
      const { user } = session
      let findPayement: IPayement[] = await FindAllPaymentApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

      console.log(findPayement);

      if (!findPayement?.hasOwnProperty('StatusCode') && !findPayement?.hasOwnProperty('message')) {
        setPayement(findPayement)
      }
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <LabelInputContainer className="mb-4 w-56">
            <Input
              startContent={<SearchIcon className="text-default-300" />}
              className="bg-mid-gray"
              id="city"
              value={filterValue}
              onChange={(e) => { setFilterValue(e.target.value) }}
              placeholder="Kinshasa"
              type="text"
            />
          </LabelInputContainer>
          <div className="flex gap-3">
            <Button>
              Réserver une salle
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {payement.length} réservation
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
    day,
    setDay,
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

  useEffect(() => {
    console.log(payement);

  }, [])

  return (
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
        {(item: IPayement) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export const Actions = ({
  payement,
  all_payement,
  setPayement,
  handleFindReservartion,
}: {
  payement: IPayement;
  setPayement: Dispatch<SetStateAction<IPayement[]>>;
  all_payement: IPayement[];
  handleFindReservartion: () => void;
}) => {
  const { toast } = useToast()


  return (
    <div className="relative flex justify-end items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hidden sm:flex">
          <Button size="icon" variant="outline">
            <PrinterIcon className="text-default-400" />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div >
  );
};
