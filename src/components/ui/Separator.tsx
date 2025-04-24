import { cn } from "@/lib/utils";

const Separator = ({ className }: { className?: string }) => {
  return <div className={cn("h-[1px] bg-[#e1e3e5] m-0", className)}></div>;
};

export default Separator;
