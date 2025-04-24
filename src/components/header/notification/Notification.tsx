import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import BellIcon from "../../svgs/BellIcon";
import style from "./notification.module.css";
import MarkAsRead from "./MarkAsRead";
import NotificationItem from "./NotificationItem";
import ViewAll from "./ViewAll";
import Separator from "@/components/ui/Separator";
import styles from "@/components/header/header.module.css";

const Notification = () => {
  return (
    <Popover>
      <PopoverTrigger className={styles["dropdown-trigger"]}>
        <BellIcon />
      </PopoverTrigger>
      <PopoverContent className='max-h-[821px] overflow-y-auto bg-white md:max-w-[600px] w-full p-0 mt-2 rounded-b-[4px] rounded-t-none ml-4 max-w-[315px] max-md:mr-6 '>
        <div className={style.header}>
          <div className='font-medium text-[#212f40] text-lg leading-[28px]'>
            Notifications
          </div>
          <MarkAsRead />
        </div>
        <Separator />
        <NotificationItem />
        <Separator />
        <ViewAll />
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
