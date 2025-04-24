import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

export function SiteHeader() {
  const location = useLocation();
  const path = location.pathname.split("/")[2] || "Dashboard";

  // Optional: Capitalize first letter
  const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full  items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <h1 className='text-2xl font-bold mb-4 ml-2 mt-4'>{formattedPath}</h1>
      </div>
    </header>
  );
}
