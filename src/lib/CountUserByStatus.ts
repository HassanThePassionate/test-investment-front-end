type User = {
    id: number;
    status: "active" | "pending";
  };
  
  export function countUsersByStatus(users: User[]) {
    let activeCount = 0;
    let pendingCount = 0;
  
    users.forEach((user) => {
      if (user.status === "active") {
        activeCount++;
      } else if (user.status === "pending") {
        pendingCount++;
      }
    });
  
    return {
      active: activeCount,
      pending: pendingCount,
    };
  }
  