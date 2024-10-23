'use client'
import { createContext, useContext, useState } from "react";

type authContextType = {
  account: {
    email: string;
    roles: string[];
  };
  login: (email: string, roles: string[]) => void;
  logout: () => void;
};

const authContextDefaultValues: authContextType = {
  account: {
    email: "",
    roles: [],
  },
  login: (email: string, roles: string[]) => { console.log(email, roles); },  // 修正：加入 roles 參數
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [account, setAccount] = useState({ email: "", roles: [] as string[] });

  const login = (email: string, roles: string[]) => {
    setAccount({ email, roles });
  };

  const logout = () => {
    setAccount({ email: "", roles: [] });
  };

  const value = {
    account,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
