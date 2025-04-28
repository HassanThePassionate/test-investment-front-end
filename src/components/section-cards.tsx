"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAdminProperties } from "@/api/propertiesAPI";
import { fetchUsers } from "@/api/userAPI";
import { calculateInvestmentsWithChange } from "@/lib/calculate-investment";
import { countUsersByStatus } from "@/lib/CountUserByStatus";

export function SectionCards() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = async () => {
      setIsLoading(true);
      try {
        const users = await fetchUsers();
        setUsers(users);
        const data = await getAdminProperties();
        setProperties(data.properties);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    data();
  }, []);

  const result = calculateInvestmentsWithChange(properties);

  const activeUsers = countUsersByStatus(users).active;
  const PendingUsers = countUsersByStatus(users).pending;
  const activeProperties = countUsersByStatus(properties).active;
  const PendingProperties = countUsersByStatus(properties).pending;

  if (isLoading) {
    return <SkeletonCards />;
  }

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Investment Capital</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {result.totalInvestmentCapital}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Monthly Investment</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {result.monthlyInvestmentVolume}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {activeUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Pending Users</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {PendingUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Properties Opportunities</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {activeProperties}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Pending Properties</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {PendingProperties}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className='grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3'>
      {[...Array(6)].map((_, index) => (
        <Card key={index} className='@container/card'>
          <CardHeader>
            <div className='h-4 w-32 animate-pulse rounded bg-muted'></div>
            <div className='h-8 w-24 animate-pulse rounded bg-muted'></div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
