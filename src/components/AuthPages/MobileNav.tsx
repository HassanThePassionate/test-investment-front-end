import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
const menuItems = ["Sobre", "How it Works", "Reviews", "Contact Us"];
const MobileNav = () => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='max-md:block md:hidden'>
        <MenuIcon size={22} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='pt-4'>
        <ul className='flex  px-4 flex-col gap-4'>
          {menuItems.map((item) => (
            <li className='hover:underline text-[#58626f] hover:text-black transition duration-200 cursor-pointer text-[15px]  py-2'>
              <a href='#'>{item}</a>
            </li>
          ))}
        </ul>
        <DropdownMenuSeparator />
        <button
          onClick={() => navigate("/register")}
          className='bg-black text-white m-4  transition duration-200 rounded-full px-6 py-2 text-sm cursor-pointer hover:bg-[#333]'
        >
          Junta-te a nós
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileNav;
