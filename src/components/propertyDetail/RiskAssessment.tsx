/* eslint-disable @typescript-eslint/no-explicit-any */
import { Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

const RiskAssessment = ({ property }: { property: any }) => {
  return (
    <div className='pt-0 flex flex-col gap-4'>
      <h2 className='font-medium mb-3 text-2xl leading-[32px]'>
        Property Information
      </h2>
      <div className='flex gap-6 p-6 max-sm:flex-col border border-[#e1e3e5] rounded-[8px]'>
        <div className='flex w-full'>
          <div style={{ flex: "1 1 0%" }}>
            <div className='text-sm text-[#58626f] flex items-center gap-1 pb-1 leading-5'>
              Number of Rooms
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='h-3 w-3 ml-1 text-gray-400' />
                  </TooltipTrigger>
                  <TooltipContent className='bg-black text-white p-1 rounded-md'>
                    <p className='text-xs'>Rooms</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='font-medium text-base leading-7'>
              {property.number_of_rooms}
            </div>
          </div>

          <div style={{ flex: "1 1 0%" }}>
            <div className='text-sm text-[#58626f] flex items-center gap-1 pb-1 leading-5'>
              Construction Year:
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='h-3 w-3 ml-1 text-gray-400' />
                  </TooltipTrigger>
                  <TooltipContent className='bg-black text-white p-1 rounded-md'>
                    <p className='text-xs'>Year of Construction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='font-medium'>{property.construction_year}</div>
          </div>
        </div>
        <div className='flex w-full'>
          <div style={{ flex: "1 1 0%" }}>
            <div className='text-sm text-[#58626f] flex items-center gap-1 pb-1 leading-5'>
              Property Type
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='h-3 w-3 ml-1 text-gray-400' />
                  </TooltipTrigger>
                  <TooltipContent className='bg-black text-white p-1 rounded-md'>
                    <p className='text-xs'>Property Type</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='font-medium text-base leading-7'>
              {property.property_type === "apartment" ? "Apartment" : "House"}
            </div>
          </div>

          <div style={{ flex: "1 1 0%" }}>
            <div className='text-sm text-[#58626f] flex items-center gap-1 pb-1 leading-5'>
              Condition
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='h-3 w-3 ml-1 text-gray-400' />
                  </TooltipTrigger>
                  <TooltipContent className='bg-black text-white p-1 rounded-md'>
                    <p className='text-xs'>Property Condition</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='font-medium flex items-center '>
              {property.condition === "new"
                ? "New"
                : property.condition === "used"
                ? "Used"
                : "Needs Renovation"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
