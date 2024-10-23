'use client'
import { createContext, useContext, useState } from "react";
type authContextType = {
  account:{
    email: string;
    roles: string[];
  }
  login: (email:string, roles: string[]) => void;
  logout: () => void;
};
const authContextDefaultValues: authContextType = {
  account:{
    email: "",
    roles: [],
  },
  login: (email:string) => {console.log(email)},
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
  const [account, setAccount] = useState({email:"",roles:[] as string[]});
  
//   console.log('email:',account.email);
  const login = (email:string, roles:string[]) => {
      setAccount({email,roles});
  };

  const logout = () => {
    setAccount({email:"",roles:[]});
  };
  const value = {
    account,
    login,
    logout,
};
  const { login } = useAuth();
  
  // 用戶同時擁有 "U" 和 "M" 身份
  login("user@example.com", ["U", "M"]);
  
  // 或者只擁有單一身份
  login("admin@example.com", ["M"]);

  const { account } = useAuth();
  
  if (account.roles.includes("M")) {
    console.log("該用戶是管理員");
  }
  
  if (account.roles.includes("U")) {
    console.log("該用戶是一般用戶");
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
