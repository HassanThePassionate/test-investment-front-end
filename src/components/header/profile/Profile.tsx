import Profile2 from "@/components/svgs/Profile2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "@/components/header/header.module.css";
import style from "@/components/header/notification/notification.module.css";
import { links } from "@/constant/ProfileLinksData";
import ProfileItem from "./ProfileItem";

import { cn } from "@/lib/utils";
import Separator from "@/components/ui/Separator";
import Logout from "@/components/svgs/Logout";
import myStyles from "./profile.module.css";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={styles["dropdown-trigger"]}>
        <Profile2 />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='max-h-[821px] overflow-y-auto bg-white max-w-[340px] w-full p-2 mt-2 rounded-b-[4px] rounded-t-none mr-6 '>
        <div className='px-3 py-2 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className={cn("text-white", style.profile)}>
              <Profile2 />
            </div>
            <div className='flex flex-col'>
              <div className='flex items-center flex-wrap'>
                <p className='text-base leading-6 font-medium'>Silva Drox</p>
              </div>
              <p className='text-sm text-[#58626f] font-normal leading-[22px]'>
                Private Investor - EGU819528
              </p>
            </div>
          </div>
        </div>
        <Separator className='my-2' />
        <div className=' flex flex-col gap-2'>
          {links.map((link) => (
            <ProfileItem key={link.text} icon={link.icon} text={link.text} />
          ))}
          <Separator className='my-2 mb-0' />
          <DropdownMenuItem className={myStyles.trigger}>
            <Link to={"/login"} className='flex items-center gap-3'>
              <Logout />
              Logout
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
