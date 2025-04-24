/* eslint-disable @typescript-eslint/no-explicit-any */

import { calculatePercentageChange } from "./calculatePercentageChange";

  
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
  
 export function calculateInvestmentsWithChange(properties: any[]) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastYear = lastMonthDate.getFullYear();
  
    let totalInvestmentCapital = 0;
    let monthlyInvestmentVolume = 0;
    let lastMonthInvestmentVolume = 0;
  
    properties.forEach((property) => {
      const estimatedValue = parseFloat(property.estimated_value);
      const createdAt = new Date(property.created_at);
      if (property.status === 'active') {
        totalInvestmentCapital += estimatedValue;
      }

      if (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      ) {
        monthlyInvestmentVolume += estimatedValue;
      }
  
      if (
        createdAt.getMonth() === lastMonth &&
        createdAt.getFullYear() === lastYear
      ) {
        lastMonthInvestmentVolume += estimatedValue;
      }
    });
  
    return {
      totalInvestmentCapital: formatCurrency(totalInvestmentCapital),
      monthlyInvestmentVolume: formatCurrency(monthlyInvestmentVolume),
      percentageChange: calculatePercentageChange(
        monthlyInvestmentVolume,
        lastMonthInvestmentVolume
      ),
    };
  }
  
  