"use client";

import { useEffect, useState, useCallback } from "react";
import style from "./invest.module.css";

import { FilterModal, type FilterState } from "./FilterModal";
import Filters from "./Filters";
import { useFilter } from "../context/filter-context";

import { getAllProperties } from "@/api/propertiesAPI";
import type { PropertyFormData } from "@/types/property";

import { PropertyGrid } from "./PropertyGrid";
import { PropertyList } from "./PropertyList";

const InvestPage = () => {
  const {
    searchQuery,
    setIsFilterModalOpen,
    isFilterModalOpen,
    activeFilters,
    setActiveFilters,
  } = useFilter();
  const [properties, setProperties] = useState<PropertyFormData[]>([]);
  const { viewMode } = useFilter();
  const [filteredProperties, setFilteredProperties] = useState<
    PropertyFormData[]
  >([]);
  const [sortField, setSortField] =
    useState<keyof PropertyFormData>("createAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch properties only once when component mounts
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchProperties = async () => {
      try {
        const response = await getAllProperties();
        console.log("API Response:", response.data);

        if (isMounted) {
          setProperties(response.data || []);
          setFilteredProperties(response.data || []);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProperties();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this runs once on mount

  // Memoize the filter function to prevent unnecessary re-renders
  const filterAndSortProperties = useCallback(() => {
    console.log("Filtering properties. Count:", properties.length);
    console.log("Active filters:", activeFilters);
    console.log("Search query:", searchQuery);

    if (properties.length === 0) return;

    // Filter properties based on search query and active filters
    let filtered = [...properties];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((property) => {
        // Check if id exists and is a number or string
        const idMatch = property.id
          ? property.id
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : false;

        // Check if propertyType exists
        const propertyTypeMatch = property.property_type
          ? property.property_type
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : false;

        // Check if city exists
        const cityMatch = property.city
          ? property.city.toLowerCase().includes(searchQuery.toLowerCase())
          : false;

        return idMatch || propertyTypeMatch || cityMatch;
      });
    }

    // Apply country filter
    if (activeFilters.countries.length > 0) {
      filtered = filtered.filter(
        (property) =>
          property.country && activeFilters.countries.includes(property.country)
      );
    }

    // Apply status filter
    if (activeFilters.status.length > 0) {
      filtered = filtered.filter((property) => {
        // Map internal status to display status
        let displayStatus = "Open";
        if (property.status === "active") displayStatus = "Open";
        if (property.status === "pending") displayStatus = "Pending";
        if (property.status === "rejected") displayStatus = "Rejected";

        return activeFilters.status.includes(displayStatus);
      });
    }

    // Apply property type filter
    if (activeFilters.propertyTypes.length > 0) {
      filtered = filtered.filter(
        (property) =>
          property.property_type &&
          activeFilters.propertyTypes.includes(property.property_type)
      );
    }

    // Apply city filter
    if (activeFilters.cities.length > 0) {
      filtered = filtered.filter(
        (property) =>
          property.city && activeFilters.cities.includes(property.city)
      );
    }

    // Apply condition filter
    if (activeFilters.condition) {
      filtered = filtered.filter(
        (property) =>
          property.condition && property.condition === activeFilters.condition
      );
    }

    // Apply price range filter - only if property has price
    if (
      activeFilters.priceRange[0] !== 50000 ||
      activeFilters.priceRange[1] !== 250000
    ) {
      filtered = filtered.filter(
        (property) =>
          property.estimated_value &&
          property.estimated_value >= activeFilters.priceRange[0] &&
          property.estimated_value <= activeFilters.priceRange[1]
      );
    }

    // Apply construction year filter - only if property has construction_year
    if (
      activeFilters.constructionYearRange[0] !== 1950 ||
      activeFilters.constructionYearRange[1] !== 2023
    ) {
      filtered = filtered.filter(
        (property) =>
          property.construction_year &&
          property.construction_year >=
            activeFilters.constructionYearRange[0] &&
          property.construction_year <= activeFilters.constructionYearRange[1]
      );
    }

    // Sort properties
    const sorted = [...filtered].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      // Handle undefined values
      if (fieldA === undefined && fieldB === undefined) return 0;
      if (fieldA === undefined) return sortDirection === "asc" ? -1 : 1;
      if (fieldB === undefined) return sortDirection === "asc" ? 1 : -1;

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else if (
        (typeof fieldA === "number" || typeof fieldA === "bigint") &&
        (typeof fieldB === "number" || typeof fieldB === "bigint")
      ) {
        return sortDirection === "asc"
          ? Number(fieldA) - Number(fieldB)
          : Number(fieldB) - Number(fieldA);
      } else if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortDirection === "asc"
          ? fieldA.getTime() - fieldB.getTime()
          : fieldB.getTime() - fieldA.getTime();
      }

      // Convert to strings for comparison if types don't match
      return sortDirection === "asc"
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

    console.log("Filtered properties count:", sorted.length);
    setFilteredProperties(sorted);
  }, [properties, searchQuery, activeFilters, sortField, sortDirection]);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    filterAndSortProperties();
  }, [filterAndSortProperties]);

  const handleSort = (field: keyof PropertyFormData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleApplyFilters = (filters: FilterState) => {
    console.log("Applying filters:", filters);
    setActiveFilters(filters);
  };

  return (
    <div>
      <div>
        <h1 className='text-[28px] font-semibold leading-[36px] mb-4'>
          Properties
        </h1>
        <div className='bg-white border border-[#eaecee] rounded-[8px]'>
          <div className='flex flex-col gap-8 mb-4'>
            <div className='flex items-center justify-between px-6 pt-5 pb-3'>
              <div className='flex items-center gap-2'>
                <h2 className='sm:text-[28px] text-lg font-semibold leading-[36px]'>
                  Available Properties
                </h2>
                <span className={style.badge}>
                  {filteredProperties.length} properties
                </span>
              </div>
            </div>
            <Filters properties={properties} />
          </div>

          {isLoading ? (
            <div className='flex justify-center items-center p-10'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
            </div>
          ) : filteredProperties.length > 0 ? (
            viewMode === "list" ? (
              <PropertyList
                properties={filteredProperties}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            ) : (
              <PropertyGrid properties={filteredProperties} />
            )
          ) : (
            <div className='flex justify-center items-center p-10 text-gray-500'>
              No properties found matching your criteria
            </div>
          )}
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default InvestPage;
