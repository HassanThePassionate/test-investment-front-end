import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
const menuItems = ["Sobre", "How it Works", "Reviews", "Contact Us"];

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-between h-[80px] px-6 lg:px-[160px]'>
      <Logo />

      <ul className=' items-center gap-6 hidden md:flex'>
        {menuItems.map((item) => (
          <li className='hover:underline text-[#58626f] hover:text-black transition duration-200 cursor-pointer text-[15px]'>
            <a href='#'>{item}</a>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate("/register")}
        className='bg-black text-white hidden md:flex transition duration-200 rounded-full px-6 py-2 text-sm cursor-pointer hover:bg-[#333]'
      >
        Junta-te a nós
      </button>
      <MobileNav />
    </div>
  );
};

export default Navbar;
