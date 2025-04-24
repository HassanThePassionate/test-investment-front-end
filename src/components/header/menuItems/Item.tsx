import { Link, useLocation } from "react-router-dom";
import style from "./menuItems.module.css";
import { cn } from "@/lib/utils";
const Item = ({ text, link }: { text: string; link: string }) => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <li>
      <Link
        to={link}
        className={cn(
          "max-md:!text-black max-md:!py-2",
          style["list-item"],
          pathname === link && "md:!text-[#c8d2ff] !text-[#212f40]"
        )}
      >
        {text}
      </Link>
    </li>
  );
};

export default Item;
