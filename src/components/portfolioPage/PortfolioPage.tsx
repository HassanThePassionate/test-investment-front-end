import { portfolioData } from "@/constant/portfolioData";
import style from "./portfolio.module.css";
import PortfolioItem from "./PortfolioItem";
import InvestmentDashboard from "../dashboardPage/InvestmentBoard";
import { cn } from "@/lib/utils";
import { FilterModal } from "../InvestPage/FilterModal";
import { useEffect, useState } from "react";
import { getLoanData } from "@/constant/LoanData";
import { useFilter } from "../context/filter-context";
import { Loan } from "@/types/loan";
type FilterState = {
  priceRange: [number, number];
  constructionYearRange: [number, number];
  propertyTypes: string[];
  countries: string[];
  condition: string;
  status: string[];
  excludeMyProperties: boolean;
};
const PortfolioPage = () => {
  const { searchQuery, setIsFilterModalOpen, isFilterModalOpen } = useFilter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  console.log(filteredLoans);
  const [sortField] = useState<keyof Loan>("listingDate");
  const [sortDirection] = useState<"asc" | "desc">("desc");
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    priceRange: [6, 14],
    constructionYearRange: [6, 72],
    propertyTypes: [],
    countries: [],
    condition: "",
    status: [],
    excludeMyProperties: false,
  });

  useEffect(() => {
    // Load loan data
    const data = getLoanData();
    setLoans(data);
    setFilteredLoans(data);
  }, []);

  useEffect(() => {
    // Filter loans based on search query and active filters
    let filtered = loans.filter(
      (loan) =>
        loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
    if (activeFilters.constructionYearRange.length > 0) {
      filtered = filtered.filter((loan) =>
        activeFilters.constructionYearRange.includes(loan.constructionYear!)
      );
    }

    if (activeFilters.countries.length > 0) {
      filtered = filtered.filter((loan) =>
        activeFilters.countries.includes(loan.country)
      );
    }

    if (activeFilters.status.length > 0) {
      filtered = filtered.filter((loan) =>
        activeFilters.status.includes(loan.status)
      );
      console.log("Filtered loans by status:", filtered);
      console.log(
        "Active status filters:",
        activeFilters.status.includes("active")
      );
    }

    if (activeFilters.condition) {
      filtered = filtered.filter(
        (loan) => loan.risk === activeFilters.condition
      );
    }

    // Filter by interest rate
    filtered = filtered.filter((loan) => {
      const interestValue = Number.parseFloat(loan.interest.replace("%", ""));
      return (
        interestValue >= activeFilters.priceRange[0] &&
        interestValue <= activeFilters.priceRange[1]
      );
    });

    // Filter by loan period
    filtered = filtered.filter(
      (loan) =>
        loan.period >= activeFilters.constructionYearRange[0] &&
        loan.period <= activeFilters.constructionYearRange[1]
    );

    // Sort loans
    const sorted = [...filtered].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });

    setFilteredLoans(sorted);
  }, [loans, searchQuery, sortField, sortDirection, activeFilters]);

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div
        className={cn(
          "max-md:!grid max-md:!grid-cols-4 !gap-y-12 max-sm:!grid-cols-2",
          style.wrapper
        )}
      >
        {portfolioData.map((item, i) => (
          <PortfolioItem
            key={i}
            title={item.title}
            amount={item.amount}
            icon={item.icon}
          />
        ))}
      </div>
      <InvestmentDashboard title='Invested loans' doubleFilters />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default PortfolioPage;
