import { createContext, useCallback, useContext, useState } from "react";
import { z } from "zod";
import { schema } from "@/components/admin/UserDataTable";
import { fetchUsers } from "@/api/userAPI";

type User = z.infer<typeof schema>;

type UserContextType = {
  data: User[];
  loadData: () => void;
  isLoading: boolean;
  setData: React.Dispatch<React.SetStateAction<User[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const users: User[] = await fetchUsers();
      setData(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ data, setData, isLoading, setIsLoading, loadData }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
}
