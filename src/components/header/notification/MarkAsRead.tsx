import ThreeDots from "@/components/svgs/ThreeDots";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import style from "./notification.module.css";
const MarkAsRead = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={style.trigger}>
        <ThreeDots />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-[32px] max-h-[783px] overflow-y-auto bg-white rounded-[4px] py-3  px-0'>
        <DropdownMenuItem
          className={cn(
            "!px-6 !py-3 text-sm hover:bg-[#F8F7FF] transition-colors duration-300 ease-in-out rounded-none",
            style.trigger
          )}
        >
          Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MarkAsRead;
