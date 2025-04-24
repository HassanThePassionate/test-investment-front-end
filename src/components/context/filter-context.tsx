"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { FilterState } from "../InvestPage/FilterModal";

type ViewMode = "list" | "grid";

interface FilterContextType {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: Dispatch<SetStateAction<boolean>>;
  activeFilters: FilterState;
  setActiveFilters: Dispatch<SetStateAction<FilterState>>;
}

// Default filter state
const defaultFilterState: FilterState = {
  priceRange: [50000, 250000],
  constructionYearRange: [1950, 2023],
  propertyTypes: [],
  countries: [],
  cities: [],
  condition: "",
  status: [],
  excludeMyProperties: false,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] =
    useState<FilterState>(defaultFilterState);

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        isFilterModalOpen,
        setIsFilterModalOpen,
        activeFilters,
        setActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
