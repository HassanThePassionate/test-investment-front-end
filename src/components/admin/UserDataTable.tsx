import * as React from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconLayoutColumns,
  IconLoader,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { UniqueIdentifier } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format-date";
import { changeUserStatus, deleteUser, fetchUsers } from "@/api/userAPI";
import { useLocation } from "react-router-dom";

type statusType = "pending" | "cancel" | "active";

export const schema = z.object({
  id: z.number(),
  full_name: z.string(),
  email: z.string(),
  status: z.string(),
  phone_number: z.string(),
  location: z.string(),
  occupation: z.string(),
  registration_date: z.string(),
});

type ActionLoadingState = {
  [key: number]: {
    delete?: boolean;
    approve?: boolean;
    reject?: boolean;
  };
};

export function UserDataTable() {
  const [data, setData] = React.useState<z.infer<typeof schema>[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<ActionLoadingState>(
    {}
  );
  const location = useLocation();
  const path = location.pathname;
  const isUsersPage = path === "/admin/users";
  // Fetch data
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const users = await fetchUsers();
      setData(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();

    const intervalId = setInterval(loadData, 15000);

    return () => clearInterval(intervalId);
  }, [loadData]);

  const handleDelete = async (id: number) => {
    // Set loading state for this specific action
    setActionLoading((prev) => ({
      ...prev,
      [id]: { ...prev[id], delete: true },
    }));

    try {
      await deleteUser(id);

      setData((prevData) => prevData.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      // Clear loading state
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], delete: false },
      }));
    }
  };

  const changeStatus = async (id: number, status: statusType) => {
    // Set loading state for this specific action
    const actionType = status === "active" ? "approve" : "reject";
    setActionLoading((prev) => ({
      ...prev,
      [id]: { ...prev[id], [actionType]: true },
    }));

    try {
      await changeUserStatus(id, status);

      setData((prevData) =>
        prevData.map((user) => (user.id === id ? { ...user, status } : user))
      );
    } catch (error) {
      console.log(error);
    } finally {
      // Clear loading state
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], [actionType]: false },
      }));
    }
  };

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className='flex items-center justify-center'>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-center'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => (
        <div className='w-[150px] text-sm'>{row.original.full_name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className='w-[220px] text-sm'>{row.original.email}</div>
      ),
    },
    {
      accessorKey: "registration_date",
      header: "Registration Date",
      cell: ({ row }) => (
        <div>{formatDate(row.original.registration_date)}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          {row.original.status === "active" ? (
            <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
          ) : (
            <IconLoader />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        return row.original.location;
      },
    },

    // Phone Number Column (shown on both pages)
    {
      id: "phone_number",
      header: "Phone Number",
      cell: ({ row }) => {
        return row.original.phone_number;
      },
    },

    // Actions Column (only shown on users page)
    ...(!isUsersPage
      ? [
          {
            id: "actions",
            header: "Actions",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: ({ row }: any) => {
              const status = row.original.status;
              const id = row.original.id;
              const isActionLoading = actionLoading[id] || {};

              return (
                <div className='flex gap-2 items-center'>
                  {status === "pending" && (
                    <>
                      <Button
                        className='flex gap-2 bg-red-700 hover:bg-red-800 px-2 cursor-pointer text-[11px]'
                        onClick={() => changeStatus(id, "cancel")}
                        disabled={isActionLoading.reject}
                      >
                        {isActionLoading.reject ? (
                          <Loader2 size={14} className='animate-spin' />
                        ) : (
                          " Reject"
                        )}
                      </Button>
                      <Button
                        className='flex gap-2 bg-green-700 hover:bg-green-800 px-2 cursor-pointer text-[11px]'
                        onClick={() => changeStatus(id, "active")}
                        disabled={isActionLoading.approve}
                      >
                        {isActionLoading.approve ? (
                          <Loader2 size={14} className='animate-spin' />
                        ) : (
                          "Approved"
                        )}
                      </Button>
                    </>
                  )}
                  {status === "cancel" && (
                    <>
                      <Button
                        className='flex gap-2 bg-red-700 hover:bg-red-800 px-2 cursor-pointer text-[11px]'
                        onClick={() => handleDelete(id)}
                        disabled={isActionLoading.delete}
                      >
                        {isActionLoading.delete ? (
                          <Loader2 size={14} className='animate-spin' />
                        ) : (
                          " Delete"
                        )}
                      </Button>
                      <Button
                        className='flex gap-2 bg-green-700 hover:bg-green-800 px-2 cursor-pointer text-[11px]'
                        onClick={() => changeStatus(id, "active")}
                        disabled={isActionLoading.approve}
                      >
                        {isActionLoading.approve ? (
                          <Loader2 size={14} className='animate-spin' />
                        ) : (
                          " Approved"
                        )}
                      </Button>
                    </>
                  )}
                  {status === "active" && (
                    <Button
                      className='flex gap-2 bg-red-700 hover:bg-red-800 px-2 cursor-pointer text-[11px]'
                      onClick={() => changeStatus(id, "cancel")}
                      disabled={isActionLoading.reject}
                    >
                      {isActionLoading.reject ? (
                        <Loader2 size={14} className='animate-spin' />
                      ) : (
                        " Reject"
                      )}
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
      id: row.original.id,
    });

    return (
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        ref={setNodeRef}
        className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <Tabs
      defaultValue='outline'
      className='w-full flex-col justify-start gap-6 h-[90vh]'
    >
      <div className='flex items-center justify-between px-4 lg:px-6 pt-6'>
        <div className='flex items-center gap-2 justify-end w-full'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <IconLayoutColumns />
                <span className='hidden lg:inline'>Customize Columns</span>
                <span className='lg:hidden'>Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value='outline'
        className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'
      >
        <div className='overflow-hidden rounded-lg border h-full'>
          <Table className='h-full'>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className='**:data-[slot=table-cell]:first:w-8'>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    <div className='flex justify-center items-center'>
                      <Loader2 className='mr-2 h-6 w-6 animate-spin' />
                      Loading data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between px-4'>
          <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value='past-performance'
        className='flex flex-col px-4 lg:px-6'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
      <TabsContent value='key-personnel' className='flex flex-col px-4 lg:px-6'>
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
      <TabsContent
        value='focus-documents'
        className='flex flex-col px-4 lg:px-6'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
    </Tabs>
  );
}
