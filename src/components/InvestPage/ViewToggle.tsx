import { cn } from "@/lib/utils";
import CardView from "../svgs/CardView";
import ListView from "../svgs/ListView";
import style from "./invest.module.css";
interface ViewToggleProps {
  viewMode: "list" | "grid";
  onChange: (value: "list" | "grid") => void;
}

const ViewToggle = ({ viewMode, onChange }: ViewToggleProps) => {
  return (
    <div className='flex gap-3'>
      <div className={style.view}>
        <button
          className={cn(
            style["list-view"],
            viewMode === "list" && "!bg-[#eef1ff]"
          )}
          onClick={() => onChange("list")}
        >
          <div className='flex text-[#58626f]'>
            <ListView />
          </div>
        </button>
        <button
          className={cn(
            style["card-view"],
            viewMode === "grid" && "!bg-[#eef1ff]"
          )}
          onClick={() => onChange("grid")}
        >
          <div className='flex text-[#58626f]'>
            <CardView />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
