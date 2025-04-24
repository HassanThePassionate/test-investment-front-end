// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getActiveUsersByDate(users: any[]): { date: string; count: number }[] {
    const map = new Map<string, number>();
  
    users.forEach((user) => {
      if (user.status === "active") {
        const date = new Date(user.createdAt).toISOString().split("T")[0]; // "YYYY-MM-DD"
        map.set(date, (map.get(date) || 0) + 1);
      }
    });
  
    // Convert map to sorted array
    return Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  