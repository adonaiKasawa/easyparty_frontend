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
import { ChipProps } from "@nextui-org/chip";
import { Input } from "../../ui/input";
import { columns } from "./data";
import { Pagination } from "@nextui-org/pagination";
import { SearchIcon, } from "lucide-react";
import { Session } from "next-auth/types";
import { IUser } from "@/app/types/interfaces";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { FindAllReservationApi } from "@/app/lib/actions/reservation/reservation.req";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";
import { Button } from "../../ui/button";
import { LabelInputContainer } from "../../auth/signin/signin.ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { ReservationStatusEnum } from "@/app/types/enums/reservation.enum";
import { useToast } from "../../ui/use-toast";
import Link from "next/link";

export default function ClientSsrTableUI({ initData, session, }: { session: Session; initData: IUser[] }) {
  const { user } = session
  const INITIAL_VISIBLE_COLUMNS = ["#", "nom", "prenom", "tel", "email", "actions"]

  const [client, setClient] = useState<IUser[]>(initData);
  const [day, setDay] = useState<any[]>([]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<String>>(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState<Set<String>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Set<ReservationStatusEnum> | "all">(new Set([ReservationStatusEnum.P]));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });
  let i = 1;

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(client.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === new Set(['all'])) return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let FindReservation = [...client];

    if (hasSearchFilter) {
      FindReservation = FindReservation.filter((item) =>
        item.nom
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase())
        ||
        item.prenom
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||

        item.telephone
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        item.email
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   FindReservation = FindReservation.filter((res) =>
    //     Array.from(statusFilter).includes(res.status),
    //   );
    // }


    return FindReservation;
  }, [client, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof IUser] as number;
      const second = b[sortDescriptor.column as keyof IUser] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (res: IUser, columnKey: React.Key) => {
      switch (columnKey) {
        case "#":
          return <p>{i++}</p>;
        case "nom":
          return <p>{res.nom}</p>;
        case "prenom":
          return (
            <div className="">
              <p>{res.prenom}</p>
            </div>
          );
        case "email":
          return <p>
            {res.email}
          </p>
        case "tel":
          return (
            <div className="">
              <p>{res.telephone}</p>
            </div>
          );
        case "actions":

          return (
            <>
              <ActionAnnonce
                handleFindClient={handleFindClient}
                client={res}
                setClient={setClient}
                all_client={client}
              />
            </>
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

  const handleFindClient: any = async () => {
    if (session) {
      const { user } = session
      let findReservation: IUser[] = await FindAllReservationApi(user.privilege_user === PrivilegesEnum.PSF, user.sub);

      console.log(findReservation);

      if (!findReservation?.hasOwnProperty('StatusCode') && !findReservation?.hasOwnProperty('message')) {
        setClient(findReservation)
      }
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <LabelInputContainer className="w-56">
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
            <Button variant={"link"}>
              <Link href="/client/create">
                Ajouter un client
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {client.length} client
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
      <TableBody emptyContent={"Aucun reservation trouvé"} items={sortedItems}>
        {(item: IUser) => (
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

export const ActionAnnonce = ({
  client,
  all_client,
  setClient,
  handleFindClient,
}: {
  client: IUser;
  setClient: Dispatch<SetStateAction<IUser[]>>;
  all_client: IUser[];
  handleFindClient: () => void;
}) => {
  const { toast } = useToast()

  const handleChangeState = async (status: ReservationStatusEnum) => {
    // const update = await UpdateReservationApi(reservation.id, { status });
    // if (
    //   update.hasOwnProperty("statusCode") &&
    //   update.hasOwnProperty("message")
    // ) {
    //   let message = "";
    //   if (typeof update.message === "object") {
    //     update.message.map((item: string) => (message += `${item} \n`));
    //   } else {
    //     message = update.message
    //   }
    //   toast({
    //     title: "Erreur",
    //     description: message
    //   })
    // } else {
    //   handleFindReservartion();
    //   toast({
    //     title: "Réussi",
    //     description: 'La modification de la reservation a réussi'
    //   })
    // }
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
            <DropdownMenuItem onClick={() => { handleChangeState(ReservationStatusEnum.C) }}>
              Suprrimer
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div >
  );
};
