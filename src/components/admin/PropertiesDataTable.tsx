"use client";

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
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
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

import type { UniqueIdentifier } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format-date";

import {
  changePropertyStatus,
  deletePropertyUser,
  getProperties,
} from "@/api/propertiesAPI";
import { ImageDialog } from "../PhotoDialog";
import { DocumentDialog } from "../DocumentDialog";

// Import the new dialog components at the top of the file

type statusType = "pending" | "rejected" | "active";

export const schema = z.object({
  id: z.number(),
  city: z.string(),
  condition: z.enum(["new", "used", "renovated"]).optional(),
  construction_year: z.number(),
  contact_email: z.string().email(),
  contact_name: z.string(),
  contact_phone: z.string(),
  contact_surname: z.string(),
  country: z.string(),
  county: z.string(),
  created_at: z.string().datetime(),
  district: z.string(),
  documents: z.array(
    z.object({
      id: z.number().optional(),
      file: z.any().optional(),
      document: z.string().optional(), // This is likely the field name from your backend
      file_url: z.string().optional(),
      url: z.string().optional(),
      document_type: z.string().optional(),
      uploaded_at: z.string().optional(),
    })
  ),
  estimated_value: z.string(), // can be changed to z.number() if preferred
  floor_or_apartment: z.string(),
  gross_area: z.string(), // can be z.number() too if numeric
  has_air_conditioning: z.boolean(),
  has_basement: z.boolean(),
  has_elevator: z.boolean(),
  has_garage: z.boolean(),
  has_private_garden: z.boolean(),
  has_private_pool: z.boolean(),
  has_storage: z.boolean(),
  has_terrace: z.boolean(),
  how_found: z.string(),
  is_public: z.boolean(),
  marketing_consent: z.boolean(),
  number_of_rooms: z.number(),
  number_or_lot: z.string(),
  observations: z.string(),
  parish: z.string(),
  photos: z.array(
    z.object({
      id: z.number().optional(),
      file: z.any().optional(),
      image: z.string().optional(), // This is the field name from your backend
      file_url: z.string().optional(),
      url: z.string().optional(),
      order: z.number().optional(),
      uploaded_at: z.string().optional(),
    })
  ),
  postal_code: z.string(),
  property_type: z.string().optional(), // add more types if needed
  status: z.enum(["active", "pending", "rejected"]).optional(), // possible statuses
  street: z.string(),
  terms_accepted: z.boolean(),
  updated_at: z.string().datetime(),
  urgent_sale: z.enum(["yes", "no"]), // assuming only "yes" or "no"
});

type ActionLoadingState = {
  [key: number]: {
    delete?: boolean;
    approve?: boolean;
    reject?: boolean;
  };
};

export default function PropertiesDataTable() {
  const [data, setData] = React.useState<z.infer<typeof schema>[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<ActionLoadingState>(
    {}
  );

  // Add these state variables inside the PropertiesDataTable component, after the existing state declarations
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState<z.infer<
    typeof schema
  > | null>(null);
  const [initialImageIndex, setInitialImageIndex] = React.useState(0);

  // Fetch data
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const properties = await getProperties();
      setData(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
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
    setActionLoading((prev) => ({
      ...prev,
      [id]: { ...prev[id], delete: true },
    }));

    try {
      await deletePropertyUser(id);

      setData((prevData) => prevData.filter((property) => property.id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      // Clear loading state
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], delete: false },
      }));
    }
  };

  const changeStatus = async (id: number, status: statusType) => {
    const actionType = status === "active" ? "pending" : "rejected";
    setActionLoading((prev) => ({
      ...prev,
      [id]: { ...prev[id], [actionType]: true },
    }));

    try {
      await changePropertyStatus(id, status);

      setData((prevData) =>
        prevData.map((property) =>
          property.id === id ? { ...property, status } : property
        )
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
      accessorKey: "contact_name",
      header: "Name",
      cell: ({ row }) => (
        <div className=' text-sm'>{row.original.contact_name}</div>
      ),
    },
    {
      accessorKey: "contact_email",
      header: "Email",
      cell: ({ row }) => (
        <div className=' text-sm'>{row.original.contact_email}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Registration Date",
      cell: ({ row }) => <div>{formatDate(row.original.created_at)}</div>,
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
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => {
        return row.original.country;
      },
    },

    // Phone Number Column (shown on both pages)
    {
      accessorKey: "contact_phone",
      header: "Phone Number",
      cell: ({ row }) => {
        return row.original.contact_phone;
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => {
        return row.original.city;
      },
    },
    {
      accessorKey: "district",
      header: "District",
      cell: ({ row }) => {
        return row.original.district;
      },
    },
    {
      accessorKey: "estimated_value",
      header: "Value",
      cell: ({ row }) => {
        return row.original.estimated_value;
      },
    },
    {
      accessorKey: "floor_or_apartment",
      header: "Floors",
      cell: ({ row }) => {
        return row.original.floor_or_apartment;
      },
    },
    {
      accessorKey: "gross_area",
      header: "Area",
      cell: ({ row }) => {
        return row.original.gross_area;
      },
    },
    // {
    //   accessorKey: "has_air_conditioning",
    //   header: "Air Conditioning",
    //   cell: ({ row }) => {
    //     return row.original.has_air_conditioning;
    //   },
    // },
    // {
    //   accessorKey: "has_basement",
    //   header: "Basement",
    //   cell: ({ row }) => {
    //     return row.original.has_basement;
    //   },
    // },
    // {
    //   accessorKey: "has_elevator",
    //   header: "Elevator",
    //   cell: ({ row }) => {
    //     return row.original.has_elevator;
    //   },
    // },
    // {
    //   accessorKey: "has_terrace",
    //   header: "Terrace",
    //   cell: ({ row }) => {
    //     return row.original.has_terrace;
    //   },
    // },
    {
      accessorKey: "number_of_rooms",
      header: "Rooms",
      cell: ({ row }) => {
        return row.original.number_of_rooms;
      },
    },
    {
      accessorKey: "property_type",
      header: "Type",
      cell: ({ row }) => {
        return row.original.property_type;
      },
    },
    {
      accessorKey: "urgent_sale",
      header: "Urgent",
      cell: ({ row }) => {
        return row.original.urgent_sale;
      },
    },
    {
      accessorKey: "photos",
      header: "Photos",
      cell: ({ row }) => {
        const photos = row.original.photos || [];
        return (
          <div className='flex items-center'>
            {photos && photos.length > 0 ? (
              <div
                className='flex space-x-1 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProperty(row.original);
                  setInitialImageIndex(0);
                  setImageDialogOpen(true);
                }}
              >
                {photos.slice(0, 1).map((photo, idx) => (
                  <div
                    key={idx}
                    className='relative h-8 w-8 overflow-hidden rounded-md'
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(row.original);
                      setInitialImageIndex(idx);
                      setImageDialogOpen(true);
                    }}
                  >
                    <img
                      src={photo.image || photo.file_url || photo.url}
                      alt={`Property photo ${idx + 1}`}
                      className='h-full w-full object-cover'
                    />
                  </div>
                ))}
                {photos.length > 3 && (
                  <div
                    className='flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(row.original);
                      setInitialImageIndex(3);
                      setImageDialogOpen(true);
                    }}
                  >
                    +{photos.length - 3}
                  </div>
                )}
              </div>
            ) : (
              <span className='text-muted-foreground text-sm'>No photos</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "documents",
      header: "Documents",
      cell: ({ row }) => {
        const documents = row.original.documents || [];
        return (
          <div className='flex items-center'>
            {documents && documents.length > 0 ? (
              <div
                className='flex space-x-1 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProperty(row.original);
                  setDocumentDialogOpen(true);
                }}
              >
                <span className='text-sm'>{documents.length} document(s)</span>
              </div>
            ) : (
              <span className='text-muted-foreground text-sm'>
                No documents
              </span>
            )}
          </div>
        );
      },
    },
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
                  onClick={() => changeStatus(id, "rejected")}
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
            {status === "rejected" && (
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
                onClick={() => changeStatus(id, "rejected")}
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

  const safeData = Array.isArray(data) ? data : [];
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => safeData.map(({ id }) => id) || [],
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

  // Add this right before the final return statement of the component
  return (
    <>
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
            <Table className='h-auto'>
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
                      className=' text-center !text-xs'
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
        <TabsContent
          value='key-personnel'
          className='flex flex-col px-4 lg:px-6'
        >
          <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
        </TabsContent>
        <TabsContent
          value='focus-documents'
          className='flex flex-col px-4 lg:px-6'
        >
          <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
        </TabsContent>
      </Tabs>

      {/* Image Dialog */}
      {selectedProperty && (
        <ImageDialog
          isOpen={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          images={selectedProperty.photos || []}
          initialIndex={initialImageIndex}
        />
      )}

      {/* Document Dialog */}
      {selectedProperty && (
        <DocumentDialog
          isOpen={documentDialogOpen}
          onClose={() => setDocumentDialogOpen(false)}
          documents={selectedProperty.documents || []}
          initialIndex={0}
        />
      )}
    </>
  );
}
