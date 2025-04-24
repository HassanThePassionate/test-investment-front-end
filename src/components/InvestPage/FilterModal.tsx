"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilter } from "../context/filter-context";

export interface FilterState {
  priceRange: [number, number];
  constructionYearRange: [number, number];
  propertyTypes: string[];
  countries: string[];
  cities: string[];
  condition: string;
  status: string[];
  excludeMyProperties: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

export function FilterModal({
  isOpen,
  onClose,
  onApplyFilters,
}: FilterModalProps) {
  const { activeFilters, setActiveFilters } = useFilter();
  const [localFilters, setLocalFilters] = useState<FilterState>({
    ...activeFilters,
  });

  // Update local filters when activeFilters change or modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({ ...activeFilters });
    }
  }, [activeFilters, isOpen]);

  const propertyTypeOptions = [
    "apartment",
    "house",
    "villa",
    "commercial",
    "land",
    "industrial",
  ];

  const countryOptions = [
    "Estonia",
    "Latvia",
    "Lithuania",
    "Germany",
    "Finland",
    "Portugal",
    "Spain",
  ];

  const cityOptions = [
    "Tallinn",
    "Riga",
    "Vilnius",
    "Berlin",
    "Helsinki",
    "Lisbon",
    "Madrid",
    "Barcelona",
  ];

  const statusOptions = ["Open", "Pending", "Rejected"];
  const conditionOptions = ["new", "used", "renovated"];

  const handlePropertyTypeChange = (type: string) => {
    setLocalFilters((prev) => {
      if (prev.propertyTypes.includes(type)) {
        return {
          ...prev,
          propertyTypes: prev.propertyTypes.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          propertyTypes: [...prev.propertyTypes, type],
        };
      }
    });
  };

  const handleCountryChange = (country: string) => {
    setLocalFilters((prev) => {
      if (prev.countries.includes(country)) {
        return {
          ...prev,
          countries: prev.countries.filter((c) => c !== country),
        };
      } else {
        return {
          ...prev,
          countries: [...prev.countries, country],
        };
      }
    });
  };

  const handleCityChange = (city: string) => {
    setLocalFilters((prev) => {
      if (prev.cities.includes(city)) {
        return {
          ...prev,
          cities: prev.cities.filter((c) => c !== city),
        };
      } else {
        return {
          ...prev,
          cities: [...prev.cities, city],
        };
      }
    });
  };

  const handleStatusChange = (status: string) => {
    setLocalFilters((prev) => {
      if (prev.status.includes(status)) {
        return {
          ...prev,
          status: prev.status.filter((s) => s !== status),
        };
      } else {
        return {
          ...prev,
          status: [...prev.status, status],
        };
      }
    });
  };

  const selectAll = (
    field: "propertyTypes" | "countries" | "cities" | "status"
  ) => {
    if (field === "propertyTypes") {
      setLocalFilters((prev) => ({
        ...prev,
        propertyTypes: [...propertyTypeOptions],
      }));
    } else if (field === "countries") {
      setLocalFilters((prev) => ({ ...prev, countries: [...countryOptions] }));
    } else if (field === "cities") {
      setLocalFilters((prev) => ({ ...prev, cities: [...cityOptions] }));
    } else if (field === "status") {
      setLocalFilters((prev) => ({ ...prev, status: [...statusOptions] }));
    }
  };

  const clearAll = (
    field: "propertyTypes" | "countries" | "cities" | "status" | "all"
  ) => {
    if (field === "all") {
      setLocalFilters({
        priceRange: [50000, 250000],
        constructionYearRange: [1950, 2023],
        propertyTypes: [],
        countries: [],
        cities: [],
        condition: "",
        status: [],
        excludeMyProperties: false,
      });
    } else {
      setLocalFilters((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const handleApply = () => {
    console.log("Applying filters:", localFilters);
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    setActiveFilters(localFilters);
    onClose();
  };

  const handleCancel = () => {
    // Reset to active filters without applying changes
    setLocalFilters({ ...activeFilters });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/30 z-50 flex justify-end'>
      <div className='bg-white w-full max-w-md h-full overflow-y-auto animate-in slide-in-from-right'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-xl font-semibold'>Filters</h2>
          <button
            onClick={handleCancel}
            className='p-1 rounded-full hover:bg-gray-100 cursor-pointer'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='p-4 space-y-6'>
          {/* Price Range Slider */}
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-base font-medium'>Price range</span>
              <span className='text-base font-semibold text-gray-600'>
                €{localFilters.priceRange[0].toLocaleString()} to €
                {localFilters.priceRange[1].toLocaleString()}+
              </span>
            </div>
            <Slider
              value={localFilters.priceRange}
              min={50000}
              max={1000000}
              step={10000}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  priceRange: value as [number, number],
                }))
              }
              className='py-2'
            />
            <div className='flex justify-between text-sm text-gray-500'>
              <span>€50,000</span>
              <span>€1,000,000+</span>
            </div>
          </div>

          {/* Construction Year Slider */}
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-base font-medium'>Construction year</span>
              <span className='text-base font-semibold text-gray-600'>
                {localFilters.constructionYearRange[0]} to{" "}
                {localFilters.constructionYearRange[1]}
              </span>
            </div>
            <Slider
              value={localFilters.constructionYearRange}
              min={1950}
              max={2023}
              step={1}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  constructionYearRange: value as [number, number],
                }))
              }
              className='py-2'
            />
            <div className='flex justify-between text-sm text-gray-500'>
              <span>1950</span>
              <span>2023</span>
            </div>
          </div>

          {/* Property Type */}
          <Accordion type='single' collapsible defaultValue='property-type'>
            <AccordionItem value='property-type' className='border-b'>
              <AccordionTrigger className='text-base font-medium py-2'>
                Property type
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm text-[#234CFF]'>
                    <button
                      className='cursor-pointer'
                      onClick={() => selectAll("propertyTypes")}
                    >
                      Select all
                    </button>
                    <button
                      className='cursor-pointer'
                      onClick={() => clearAll("propertyTypes")}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {propertyTypeOptions.map((type) => (
                      <button
                        key={type}
                        onClick={() => handlePropertyTypeChange(type)}
                        className={`px-3 py-1.5 capitalize text-sm rounded-full cursor-pointer border ${
                          localFilters.propertyTypes.includes(type)
                            ? "bg-[#234CFF] border-[#234CFF] text-white"
                            : "bg-white border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Country */}
          <Accordion type='single' collapsible defaultValue='country'>
            <AccordionItem value='country' className='border-b'>
              <AccordionTrigger className='text-base font-medium py-2'>
                Country
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm text-[#234CFF]'>
                    <button
                      className='cursor-pointer'
                      onClick={() => selectAll("countries")}
                    >
                      Select all
                    </button>
                    <button
                      className='cursor-pointer'
                      onClick={() => clearAll("countries")}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {countryOptions.map((country) => (
                      <button
                        key={country}
                        onClick={() => handleCountryChange(country)}
                        className={`px-3 py-1.5 text-sm rounded-full border cursor-pointer ${
                          localFilters.countries.includes(country)
                            ? "bg-[#234CFF] border-[#234CFF] text-white"
                            : "bg-white border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* City */}
          <Accordion type='single' collapsible defaultValue='city'>
            <AccordionItem value='city' className='border-b'>
              <AccordionTrigger className='text-base font-medium py-2'>
                City
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm text-[#234CFF]'>
                    <button
                      className='cursor-pointer'
                      onClick={() => selectAll("cities")}
                    >
                      Select all
                    </button>
                    <button
                      className='cursor-pointer'
                      onClick={() => clearAll("cities")}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {cityOptions.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCityChange(city)}
                        className={`px-3 py-1.5 text-sm rounded-full border cursor-pointer ${
                          localFilters.cities.includes(city)
                            ? "bg-[#234CFF] border-[#234CFF] text-white"
                            : "bg-white border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Condition */}
          <Accordion type='single' collapsible defaultValue='condition'>
            <AccordionItem value='condition' className='border-b'>
              <AccordionTrigger className='text-base font-medium py-2'>
                Condition
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm text-[#234CFF]'>
                    <button
                      className='cursor-pointer'
                      onClick={() =>
                        setLocalFilters((prev) => ({ ...prev, condition: "" }))
                      }
                    >
                      Clear all
                    </button>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Select
                      value={localFilters.condition}
                      onValueChange={(value) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          condition: value,
                        }))
                      }
                    >
                      <SelectTrigger className='w-full cursor-pointer border-border h-[40px]'>
                        <SelectValue placeholder='Select condition...' />
                      </SelectTrigger>
                      <SelectContent className='max-h-[180px]'>
                        {conditionOptions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition.charAt(0).toUpperCase() +
                              condition.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Status */}
          <Accordion type='single' collapsible defaultValue='status'>
            <AccordionItem value='status' className='border-b'>
              <AccordionTrigger className='text-base font-medium py-2'>
                Status
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm text-[#234CFF]'>
                    <button
                      className='cursor-pointer'
                      onClick={() => selectAll("status")}
                    >
                      Select all
                    </button>
                    <button
                      className='cursor-pointer'
                      onClick={() => clearAll("status")}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`px-3 py-1.5 text-sm rounded-full border cursor-pointer ${
                          localFilters.status.includes(status)
                            ? "bg-[#234CFF] border-[#234CFF] text-white"
                            : "bg-white border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Exclude My Properties */}
          <Accordion
            type='single'
            collapsible
            defaultValue='exclude-properties'
          >
            <AccordionItem value='exclude-properties' className='border-b'>
              <AccordionTrigger className='text-base font-medium py-2'>
                Exclude my properties
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex items-center space-x-2'>
                  <Switch
                    checked={localFilters.excludeMyProperties}
                    onCheckedChange={(checked) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        excludeMyProperties: checked,
                      }))
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className='p-4 border-t flex justify-between sticky bottom-0 bg-white'>
          <Button variant='outline' onClick={() => clearAll("all")}>
            Clear all
          </Button>
          <Button
            className='bg-[#234CFF] hover:bg-indigo-700'
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
