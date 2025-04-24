/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchUsers } from "@/api/userAPI";

export const description = "An interactive area chart";

interface User {
  status: string;
  created_at: string;
  registration_date?: string;
}

interface ChartDataPoint {
  date: string;
  activeUsers: number;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  activeUsers: {
    label: "Active Users",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("90d");
  const [users, setUsers] = React.useState<User[]>([]);
  console.log(users);
  const [activeUserData, setActiveUserData] = React.useState<ChartDataPoint[]>(
    []
  );

  // Fetch users
  React.useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      setUsers(users);

      // Process the data for active users
      const activeUsers = users.filter((user: any) => user.status === "active");

      // Group active users by date
      const activeUsersByDate: Record<string, ChartDataPoint> = {};

      // Create date points for the last 90 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 90);

      // Initialize dates
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateKey = d.toISOString().split("T")[0];
        activeUsersByDate[dateKey] = { date: dateKey, activeUsers: 0 };
      }

      // Count active users by their creation/registration date
      activeUsers.forEach((user: any) => {
        // Assuming there's a created_at or registration_date field
        const userDate = new Date(
          user.created_at || user.registration_date || ""
        );
        const dateKey = userDate.toISOString().split("T")[0];

        if (activeUsersByDate[dateKey]) {
          activeUsersByDate[dateKey].activeUsers += 1;
        }
      });

      // Convert to array and sort by date
      const chartData = Object.values(activeUsersByDate).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setActiveUserData(chartData);
    };

    loadUsers();
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (!activeUserData.length) return [];

    let daysToSubtract = 90;

    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return activeUserData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [activeUserData, timeRange]);

  return (
    <Card className='@container/card h-[67vh]'>
      <CardHeader>
        <CardTitle>Total Active Users</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Active users for the last{" "}
            {timeRange === "90d"
              ? "3 months"
              : timeRange === "30d"
              ? "30 days"
              : "7 days"}
          </span>
          <span className='@[540px]/card:hidden'>
            Last{" "}
            {timeRange === "90d"
              ? "3 months"
              : timeRange === "30d"
              ? "30 days"
              : "7 days"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={(value: "7d" | "30d" | "90d") => setTimeRange(value)}
            variant='outline'
            className='hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex'
          >
            <ToggleGroupItem value='90d'>Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value='30d'>Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value='7d'>Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value: "7d" | "30d" | "90d") => setTimeRange(value)}
          >
            <SelectTrigger
              className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
              size='sm'
              aria-label='Select a value'
            >
              <SelectValue placeholder='Last 3 months' />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem value='90d' className='rounded-lg'>
                Last 3 months
              </SelectItem>
              <SelectItem value='30d' className='rounded-lg'>
                Last 30 days
              </SelectItem>
              <SelectItem value='7d' className='rounded-lg'>
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6 h-full'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-full w-full'
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id='fillActiveUsers' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='green' stopOpacity={1.0} />
                <stop offset='95%' stopColor='green' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='activeUsers'
              type='natural'
              fill='url(#fillActiveUsers)'
              stroke='green'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
