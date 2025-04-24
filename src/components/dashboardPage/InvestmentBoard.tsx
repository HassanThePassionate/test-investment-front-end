"use client";

import { useState } from "react";
import style from "./dashboard.module.css";
import { cn } from "@/lib/utils";
import Toggle from "./Toggle";
import FileSearch from "../svgs/FileSearch";

import { Link } from "react-router-dom";

import Filters from "../InvestPage/Filters";

import BriefCaseIcon from "@/components/svgs/BriefCaseIcon";

type InvestmentType = "active" | "finish";

interface Investment {
  id: string;
  name: string;
  amount: number;
  date: string;
  status: InvestmentType;
}

interface InvestmentDashboardProps {
  title?: string;
  investments?: Investment[];
  className?: string;
  doubleFilters?: boolean;
}

export default function InvestmentDashboard({
  title = "Your latest investments",
  investments = [],
  className,
  doubleFilters,
}: InvestmentDashboardProps) {
  const [activeTab, setActiveTab] = useState<InvestmentType>("active");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [properties, setProperties] = useState([]);
  console.log(setProperties);
  // Filter investments based on active tab and any additional filters
  const filteredInvestments = investments.filter(
    (investment) => investment.status === activeTab
  );

  const clearAllFilters = () => {
    setFilters({});
  };

  return (
    <div className={cn("w-full rounded-lg border bg-white ", className)}>
      <div>
        {!doubleFilters && (
          <div className='mb-6 flex min-[400px]:items-center items-start justify-between gap-4 max-sm:flex-col py-7 px-6'>
            <h2 className='sm:text-2xl text-lg font-semibold text-gray-900'>
              {title}
            </h2>
            <Toggle onChange={setActiveTab} viewMode={activeTab} />
          </div>
        )}
        {doubleFilters && (
          <>
            <h2 className='text-2xl  py-7 px-6 font-semibold text-gray-900'>
              {title}
            </h2>
            <div className='flex items-center justify-between flex-wrap gap-6'>
              <div className='w-full pl-6'>
                <Toggle onChange={setActiveTab} viewMode={activeTab} />
              </div>
              <Filters properties={properties} />
            </div>
          </>
        )}
      </div>

      <div className='flex min-h-[428px] flex-col items-center justify-center'>
        {filteredInvestments.length > 0 ? (
          <div className='w-full'>
            {/* Investment list would go here */}
            <ul className='space-y-4'>
              {filteredInvestments.map((investment) => (
                <li
                  key={investment.id}
                  className='rounded-lg border p-4 transition-colors hover:bg-gray-50'
                >
                  <div className='flex justify-between'>
                    <div>
                      <h3 className='font-medium'>{investment.name}</h3>
                      <p className='text-sm text-gray-500'>
                        {new Date(investment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        ${investment.amount.toLocaleString()}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          investment.status === "active"
                            ? "text-blue-600"
                            : "text-green-600"
                        )}
                      >
                        {investment.status === "active"
                          ? "In progress"
                          : "Completed"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          Object.keys(filters).length === 0 &&
          activeTab === "active" && (
            <div className='flex flex-col items-center justify-center text-center gap-6'>
              <div className=' flex w-[42px] items-center justify-center '>
                <FileSearch />
              </div>
              <div className='flex flex-col'>
                <h3 className='mb-2 sm:text-[20px] text-base font-semibold leading-[28px]'>
                  No matching results
                </h3>
                <p className='mb-4 text-sm text-gray-500 flex flex-col'>
                  Adjust your filters or
                  <button
                    onClick={clearAllFilters}
                    className='text-purple-600 hover:underline'
                  >
                    clear all filters
                  </button>
                </p>
              </div>
            </div>
          )
        )}
        {activeTab === "finish" && (
          <div className='flex flex-col items-center justify-center text-center gap-6'>
            <div className=' flex  w-[60px] h-[60px] items-center justify-center'>
              <BriefCaseIcon />
            </div>
            <div className='flex flex-col items-center'>
              <h4 className='mb-6 text-2xl font-semibold leading-[32px]'>
                You don't have finished investments
              </h4>
              <Link to='/invest' className={style.btn}>
                Invest
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
