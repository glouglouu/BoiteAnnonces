import { createContext, useState } from "react";

type User = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  token: string | null;
};
type AppContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export const UserContext = createContext<AppContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    firstName: null,
    lastName: null,
    email: null,
    token: null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
