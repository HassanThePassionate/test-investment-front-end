import { cn } from "@/lib/utils";
import style from "./notification.module.css";
const ViewAll = () => {
  return (
    <button className={cn(style["view-all"], style.trigger)}>ViewAll</button>
  );
};

export default ViewAll;
