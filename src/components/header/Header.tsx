import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Separator from "../ui/Separator";
import style from "./header.module.css";
import Logo from "./Logo";
import MenuItems from "./menuItems/MenuItems";
import MobileView from "./MobileView";
import Notification from "./notification/Notification";
import Profile from "./profile/Profile";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className={style.header}>
      <div className='flex items-center gap-[40px]'>
        <Logo />
        <div className='max-md:hidden block'>
          <MenuItems />
        </div>
      </div>
      <div className='flex items-center gap-2 sm:gap-6'>
        <div className='max-md:hidden block'>
          <Button
            onClick={() => navigate("/sell")}
            className='cursor-pointer bg-blue-600 hover:bg-blue-700'
          >
            Add Property
          </Button>
        </div>
        <Separator className='w-[1px] h-6 bg-[#58626f] max-md:hidden block' />
        <Notification />
        <Profile />
        <MobileView />
      </div>
    </header>
  );
};

export default Header;
