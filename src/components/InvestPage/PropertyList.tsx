/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { PropertyFormData } from "@/types/property";
import { formatDate } from "@/lib/format-date";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Home,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getNestedValue } from "@/lib/get-nested-value";

interface PropertyListProps {
  properties: any[]; // Changed to any[] to handle any data structure
  sortField?: keyof PropertyFormData;
  sortDirection?: "asc" | "desc";
  onSort?: (field: keyof PropertyFormData) => void;
}

export function PropertyList({ properties }: PropertyListProps) {
  const navigate = useNavigate();

  // Sort properties to show active ones at the top
  const sortPropertiesByActiveStatus = (propertiesArray: any[]) => {
    return [...propertiesArray].sort((a, b) => {
      // First prioritize active status
      const statusA = getNestedValue(a, "status", "");
      const statusB = getNestedValue(b, "status", "");

      if (statusA === "active" && statusB !== "active") return -1;
      if (statusA !== "active" && statusB === "active") return 1;

      // Then sort by creation date for active properties (newest first)
      if (statusA === "active" && statusB === "active") {
        const dateA = new Date(
          getNestedValue(a, "created_at") || getNestedValue(a, "createdAt") || 0
        );
        const dateB = new Date(
          getNestedValue(b, "created_at") || getNestedValue(b, "createdAt") || 0
        );
        return dateB.getTime() - dateA.getTime();
      }

      // For non-active properties, maintain their original order
      return 0;
    });
  };

  // CSS for image fallback transition
  const imageStyles = `
    .property-image-container {
      position: relative;
      height: 64px;
      width: 64px;
      border-radius: 0.375rem;
      overflow: hidden;
      background-color: #f3f4f6;
    }
    .property-image {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: opacity 0.2s ease;
    }
    .image-fallback {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f3f4f6;
      transition: opacity 0.2s ease;
    }
    .image-loading .property-image {
      opacity: 0;
    }
  `;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Debug the properties data
  useEffect(() => {
    if (properties.length > 0) {
      console.log("First property structure:", properties[0]);
    }

    // Calculate total pages
    setTotalPages(Math.ceil(properties.length / entriesPerPage));

    // Reset to first page if we have fewer pages than current page
    if (currentPage > Math.ceil(properties.length / entriesPerPage)) {
      setCurrentPage(1);
    }
  }, [properties, entriesPerPage, currentPage]);

  // Function to get status badge color
  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "active":
        return "!text-green-800 !bg-green-100";
      case "pending":
        return "!text-yellow-800 !bg-yellow-100";
      case "rejected":
        return "!text-red-800 !bg-red-100";
      default:
        return "";
    }
  };

  // Get current entries from sorted properties
  const sortedProperties = sortPropertiesByActiveStatus(properties);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedProperties.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Go to first page
  const goToFirstPage = () => setCurrentPage(1);

  // Go to last page
  const goToLastPage = () => setCurrentPage(totalPages);

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle entries per page change
  const handleEntriesPerPageChange = (value: string) => {
    setEntriesPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  return (
    <div className='overflow-hidden'>
      <style>{imageStyles}</style>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-[#f9fafb] text-sm'>
            <tr>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                ID
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Date
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                City
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                District
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Street
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Construction Year
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Estimated Value
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Floor/Apartment
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Gross Area
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Rooms
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Status
              </th>
              <th className='p-4 text-left text-xs text-[#58626f] font-normal'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {currentEntries.map((property, index) => {
              const propertyId = getNestedValue(property, "id", index);

              return (
                <tr key={propertyId} className={cn("hover:bg-muted/30")}>
                  <td className='px-4 py-4 text-[13px]'>{propertyId}</td>
                  <td className='px-4 py-4 text-[13px] gap-2 flex'>
                    <div className='flex items-center'>
                      {property.photos && property.photos.length > 0 ? (
                        <div className='flex space-x-1 cursor-pointer'>
                          {property.photos
                            .slice(0, 1)
                            .map((photo: any, idx: any) => (
                              <div
                                key={idx}
                                className='relative  h-16 overflow-hidden rounded-md'
                              >
                                <img
                                  src={
                                    photo.image || photo.file_url || photo.url
                                  }
                                  alt={`Property photo ${idx + 1}`}
                                  className='h-full w-full '
                                />
                              </div>
                            ))}
                          {property.photos.length > 3 && (
                            <div className='flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs cursor-pointer'>
                              +{property.photos.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className='relative h-16 w-16 overflow-hidden rounded-md bg-[#DDD] flex items-center justify-center mr-2'>
                          <Home />
                        </span>
                      )}
                    </div>
                    <div className='flex flex-col gap-2'>
                      <span>
                        <b>Type:</b>{" "}
                        {getNestedValue(property, "property_type") ||
                          getNestedValue(property, "propertyType")}
                      </span>
                      <span>
                        <b>Date:</b>{" "}
                        {getNestedValue(property, "created_at")
                          ? formatDate(getNestedValue(property, "created_at"))
                          : getNestedValue(property, "createdAt")
                          ? formatDate(getNestedValue(property, "createdAt"))
                          : "N/A"}
                      </span>
                      <span>
                        {" "}
                        <b>Condition:</b>{" "}
                        {getNestedValue(property, "condition")}
                      </span>
                    </div>
                  </td>

                  <td className='px-4 py-4 text-[13px]'>
                    {getNestedValue(property, "city")}
                  </td>
                  <td className='px-4 py-4 text-[13px]'>
                    {getNestedValue(property, "district")}
                  </td>
                  <td className='px-4 py-4 text-[13px]'>
                    {getNestedValue(property, "street")}
                  </td>

                  <td className='px-4 py-4 text-[13px]'>
                    {getNestedValue(property, "construction_year") ||
                      getNestedValue(property, "constructionYear")}
                  </td>
                  <td className='px-4 py-4 text-[13px]'>
                    {getNestedValue(property, "estimated_value") ||
                      getNestedValue(property, "price") ||
                      getNestedValue(property, "businessInfo.estimatedValue")}
                  </td>
                  <td className='px-4 py-4 text-[13px]'>
                    {getNestedValue(property, "floor_or_apartment") ||
                      getNestedValue(property, "floorApartment")}
                  </td>
                  <td className='px-4 py-4 text-[13px]'>
                    {getNestedValue(property, "gross_area") ||
                      getNestedValue(property, "grossArea")}
                  </td>
                  <td className='px-4 py-4 text-[13px]'>
                    {getNestedValue(property, "number_of_rooms") ||
                      getNestedValue(property, "numberOfRooms")}
                  </td>
                  <td className='px-4 py-4 text-[13px]'>
                    <Badge
                      variant='outline'
                      className={cn(
                        "uppercase text-xs",
                        getStatusBadgeClass(
                          getNestedValue(property, "status", "")
                        )
                      )}
                    >
                      {getNestedValue(property, "status")}
                    </Badge>
                  </td>
                  <td className='px-4 py-4'>
                    <Button
                      onClick={() => navigate(`/property-detail/${propertyId}`)}
                      className='bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className='flex items-center justify-between px-4 py-4 border-t'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-gray-500'>Show</span>
          <Select
            value={entriesPerPage.toString()}
            onValueChange={handleEntriesPerPageChange}
          >
            <SelectTrigger className='w-[80px] h-8'>
              <SelectValue placeholder='10' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
          <span className='text-sm text-gray-500'>entries</span>
        </div>

        <div className='text-sm text-gray-500'>
          Showing {indexOfFirstEntry + 1} to{" "}
          {Math.min(indexOfLastEntry, sortedProperties.length)} of{" "}
          {sortedProperties.length} entries
        </div>

        <div className='flex items-center space-x-1'>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          {/* Page numbers */}
          <div className='flex items-center space-x-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                // If we have 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If we're near the start, show first 5 pages
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // If we're near the end, show last 5 pages
                pageNum = totalPages - 4 + i;
              } else {
                // Otherwise show 2 pages before and after current page
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => paginate(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
