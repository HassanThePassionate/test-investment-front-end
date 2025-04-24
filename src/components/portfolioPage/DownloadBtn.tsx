import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon } from "lucide-react";
import style from "./portfolio.module.css";
import { cn } from "@/lib/utils";
const DownloadBtn = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "mr-6 cursor-pointer hover:!bg-[#F7F9FB]",
          style["download-btn"]
        )}
      >
        <DownloadIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className='py-3 px-6 cursor-pointer'>
          Download Portfolio XLS
        </DropdownMenuItem>
        <DropdownMenuItem className='py-3 px-6 cursor-pointer'>
          Download Portfolio CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadBtn;
