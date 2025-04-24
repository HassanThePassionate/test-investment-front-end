import { Outlet } from "react-router-dom";
import { AppSidebar } from "../app-sidebar";
import { SiteHeader } from "../site-header";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />

        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
