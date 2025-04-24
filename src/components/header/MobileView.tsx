import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import MenuItems from "./menuItems/MenuItems";

import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const MobileView = () => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='md:hidden block p-2'>
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <MenuItems />
        <DropdownMenuSeparator />
        <Button
          onClick={() => navigate("/sell")}
          className='cursor-pointer bg-blue-600 hover:bg-blue-700'
        >
          Add Property
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileView;
