import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logout from "./svgs/Logout";
import Users from "./svgs/Users";
import { useNavigate } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "users",
      icon: Users,
    },
    {
      title: "Registration Requests",
      url: "registration-request",
      icon: IconChartBar,
    },
    {
      title: "Investment Opportunities",
      url: "investment-opportunities",
      icon: IconFolder,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5 '
            >
              <a href='#'>
                <IconInnerShadowTop className='!size-5' />
                <span className='text-base font-semibold'>Admin Portal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter
        onClick={() => navigate("/login")}
        className='  bg-black text-white flex items-center gap-2 mb-2  mx-2 flex-row rounded-md h-[46px] text-sm cursor-pointer hover:bg-[#333]'
      >
        <Logout />
        Sign out
      </SidebarFooter>
    </Sidebar>
  );
}
