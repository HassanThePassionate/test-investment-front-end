export function calculatePercentageChange(current: number, previous: number): string {
    if (previous === 0) return 'N/A';
    const change = ((current - previous) / previous) * 100;
    const direction = change > 0 ? 'up' : 'down';
    const symbol = direction === 'up' ? '🔼' : '🔽';
    return `${symbol} ${Math.abs(change).toFixed(1)}% compared to last month`;
  }
  