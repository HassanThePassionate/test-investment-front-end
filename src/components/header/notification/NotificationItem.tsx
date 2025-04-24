import Profile1Icon from "@/components/svgs/Profile1Icon";
import style from "./notification.module.css";
import { cn } from "@/lib/utils";
const NotificationItem = () => {
  return (
    <div className={cn(style["item-wrapper"], style.trigger)}>
      <div className={style.item}>
        <div className={style.profile}>
          <Profile1Icon />
        </div>
        <div className={cn("max-md:!max-w-[195px] ", style.content)}>
          <div className={style.heading}>
            New project on Estateguru :#71530233 Development loan - 1.stage
            (Latvia)
          </div>
          <p className={style.para}>16 hours ago</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
