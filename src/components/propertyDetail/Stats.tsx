/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import style from "./property.module.css";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
const Stats = ({ property }: { property: any }) => {
  return (
    <div className={cn("max-sm:!flex-col max-sm:!items-start", style.stats)}>
      <div className='flex flex-col w-full gap-6'>
        <div className='flex w-full'>
          <div style={{ flex: "1 1 0%" }}>
            <span className='text-sm text-[#58626f] leading-[20px] pb-1  flex items-center'>
              Amount
            </span>
            <span className='text-lg font-medium leading-[28px] max-sm:text-sm'>
              {property.estimated_value}
            </span>
          </div>

          <div style={{ flex: "1 1 0%" }}>
            <span className='text-sm text-[#58626f] leading-[20px] pb-1 flex items-center'>
              Area
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='h-3 w-3 ml-1 text-gray-400' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs'> Gross Area</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className='text-lg font-medium leading-[28px] max-sm:text-sm'>
              {property.gross_area}
            </span>
          </div>
          <div style={{ flex: "1 1 0%" }}>
            <span className='text-sm text-[#58626f] leading-[20px] pb-1 flex items-center'>
              City
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='h-3 w-3 ml-1 text-gray-400' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs'>City</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className='text-lg font-medium leading-[28px] max-sm:text-sm'>
              {property.city}
            </span>
          </div>
        </div>

        <div className='flex w-full'>
          <div style={{ flex: "1 1 0%" }}>
            <span className='text-sm text-[#58626f] leading-[20px] pb-1 flex items-center'>
              Country
            </span>
            <span className='text-lg font-medium leading-[28px] max-sm:text-sm flex items-center gap-1'>
              {property.country}
            </span>
          </div>
          <div style={{ flex: "1 1 0%" }}>
            <span className='text-sm text-[#58626f] leading-[20px] pb-1 flex items-center'>
              District
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='h-3 w-3 ml-1 text-gray-400' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs'>District</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className='text-lg font-medium leading-[28px] max-sm:text-sm'>
              {property.district}
            </span>
          </div>
          <div style={{ flex: "1 1 0%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
