import { cn } from "@/lib/utils";
import style from "@/components/InvestPage/invest.module.css";
interface ToggleProps {
  viewMode: "active" | "finish";
  onChange: (value: "active" | "finish") => void;
}

const Toggle = ({ viewMode, onChange }: ToggleProps) => {
  return (
    <div className='flex gap-3 '>
      <div className={cn("max-sm:w-[250px] max-[350px]:!w-auto", style.view)}>
        <button
          className={cn(
            style["list-view"],
            viewMode === "active" && "!bg-[#eef1ff]"
          )}
          onClick={() => onChange("active")}
        >
          <div className='flex text-[#58626f]'>Active</div>
        </button>
        <button
          className={cn(
            style["card-view"],
            viewMode === "finish" && "!bg-[#eef1ff]"
          )}
          onClick={() => onChange("finish")}
        >
          <div className='flex text-[#58626f]'>Finish</div>
        </button>
      </div>
    </div>
  );
};

export default Toggle;
