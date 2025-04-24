/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Filter from "../svgs/Filter";
import ViewToggle from "./ViewToggle";
import Search from "../svgs/Search";
import { cn } from "@/lib/utils";
import style from "./invest.module.css";
import { useFilter } from "../context/filter-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getNestedValue } from "@/lib/get-nested-value";
import { formatDate } from "@/lib/format-date";
import styles from "@/components/portfolioPage/portfolio.module.css";
const Filters = ({ properties }: { properties: any[] }) => {
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    setIsFilterModalOpen,
    activeFilters,
  } = useFilter();

  // Calculate how many filters are active
  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.countries.length > 0) count += 1;
    if (activeFilters.propertyTypes.length > 0) count += 1;
    if (activeFilters.cities.length > 0) count += 1;
    if (activeFilters.status.length > 0) count += 1;
    if (activeFilters.condition) count += 1;
    if (activeFilters.excludeMyProperties) count += 1;
    if (
      activeFilters.priceRange[0] !== 50000 ||
      activeFilters.priceRange[1] !== 250000
    )
      count += 1;
    if (
      activeFilters.constructionYearRange[0] !== 1950 ||
      activeFilters.constructionYearRange[1] !== 2023
    )
      count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  const downloadCSV = (dataToDownload: any[] = properties) => {
    // Define the columns to include in the CSV
    const columns = [
      "id",
      "property_type",
      "city",
      "district",
      "street",
      "condition",
      "construction_year",
      "estimated_value",
      "floor_or_apartment",
      "gross_area",
      "number_of_rooms",
      "status",
      "created_at",
    ];

    // Create header row
    const headerRow = [
      "ID",
      "Property Type",
      "City",
      "District",
      "Street",
      "Condition",
      "Construction Year",
      "Estimated Value",
      "Floor/Apartment",
      "Gross Area",
      "Rooms",
      "Status",
      "Created At",
    ];

    // Create CSV content
    let csvContent = headerRow.join(",") + "\n";

    // Add data rows
    dataToDownload.forEach((property) => {
      const row = columns.map((column) => {
        let value;

        // Handle special cases
        if (column === "property_type") {
          value =
            getNestedValue(property, "property_type") ||
            getNestedValue(property, "propertyType");
        } else if (column === "construction_year") {
          value =
            getNestedValue(property, "construction_year") ||
            getNestedValue(property, "constructionYear");
        } else if (column === "estimated_value") {
          value =
            getNestedValue(property, "estimated_value") ||
            getNestedValue(property, "price") ||
            getNestedValue(property, "businessInfo.estimatedValue");
        } else if (column === "floor_or_apartment") {
          value =
            getNestedValue(property, "floor_or_apartment") ||
            getNestedValue(property, "floorApartment");
        } else if (column === "gross_area") {
          value =
            getNestedValue(property, "gross_area") ||
            getNestedValue(property, "grossArea");
        } else if (column === "number_of_rooms") {
          value =
            getNestedValue(property, "number_of_rooms") ||
            getNestedValue(property, "numberOfRooms");
        } else if (column === "created_at") {
          const createdAt =
            getNestedValue(property, "created_at") ||
            getNestedValue(property, "createdAt");
          value = createdAt !== "N/A" ? formatDate(createdAt) : "N/A";
        } else {
          value = getNestedValue(property, column);
        }

        // Escape commas and quotes in the value
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });

      csvContent += row.join(",") + "\n";
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `property-data-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to download data as XLS (simplified version using CSV)
  const downloadXLS = (dataToDownload: any[] = properties) => {
    // For XLS, we'll use a simple approach by creating a CSV with tab separators
    // and giving it an .xls extension. This is not a true XLS file but will open in Excel.

    // Define the columns to include
    const columns = [
      "id",
      "property_type",
      "city",
      "district",
      "street",
      "condition",
      "construction_year",
      "estimated_value",
      "floor_or_apartment",
      "gross_area",
      "number_of_rooms",
      "status",
      "created_at",
    ];

    // Create header row
    const headerRow = [
      "ID",
      "Property Type",
      "City",
      "District",
      "Street",
      "Condition",
      "Construction Year",
      "Estimated Value",
      "Floor/Apartment",
      "Gross Area",
      "Rooms",
      "Status",
      "Created At",
    ];

    // Create content with tab separators
    let content = headerRow.join("\t") + "\n";

    // Add data rows
    dataToDownload.forEach((property) => {
      const row = columns.map((column) => {
        let value;

        // Handle special cases (same as CSV function)
        if (column === "property_type") {
          value =
            getNestedValue(property, "property_type") ||
            getNestedValue(property, "propertyType");
        } else if (column === "construction_year") {
          value =
            getNestedValue(property, "construction_year") ||
            getNestedValue(property, "constructionYear");
        } else if (column === "estimated_value") {
          value =
            getNestedValue(property, "estimated_value") ||
            getNestedValue(property, "price") ||
            getNestedValue(property, "businessInfo.estimatedValue");
        } else if (column === "floor_or_apartment") {
          value =
            getNestedValue(property, "floor_or_apartment") ||
            getNestedValue(property, "floorApartment");
        } else if (column === "gross_area") {
          value =
            getNestedValue(property, "gross_area") ||
            getNestedValue(property, "grossArea");
        } else if (column === "number_of_rooms") {
          value =
            getNestedValue(property, "number_of_rooms") ||
            getNestedValue(property, "numberOfRooms");
        } else if (column === "created_at") {
          const createdAt =
            getNestedValue(property, "created_at") ||
            getNestedValue(property, "createdAt");
          value = createdAt !== "N/A" ? formatDate(createdAt) : "N/A";
        } else {
          value = getNestedValue(property, column);
        }

        return value;
      });

      content += row.join("\t") + "\n";
    });

    // Create a Blob with the content
    const blob = new Blob([content], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `property-data-${new Date().toISOString().split("T")[0]}.xls`
    );
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("!justify-end", style.filters)}>
      <div className='max-sm:max-w-[400px] gap-3 px-6 flex justify-end flex-wrap self-start'>
        <div className={cn("max-[370px]:ma-w-[290px]", style.search)}>
          <span className='text-[#8e959e] mr-3'>
            <Search />
          </span>
          <input
            placeholder='Search for ID'
            className={style.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        <div>
          <button
            className={style["filter-button"]}
            onClick={() => setIsFilterModalOpen(true)}
          >
            <span>
              <Filter />
            </span>
            Filter
            {activeFilterCount > 0 && (
              <Badge
                variant='secondary'
                className='ml-1 bg-blue-100 text-blue-800'
              >
                {activeFilterCount}
              </Badge>
            )}
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "mr-6 cursor-pointer hover:!bg-[#F7F9FB]",
              styles["download-btn"]
            )}
          >
            <DownloadIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => downloadCSV()}
              className='py-3 px-6 cursor-pointer'
            >
              Download Property CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => downloadXLS()}
              className='py-3 px-6 cursor-pointer'
            >
              Download Property XLS
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Filters;
