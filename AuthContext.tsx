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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};