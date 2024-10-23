'use client'
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from 'next/navigation';  

export default function Login() {
  const [account, setAccount] = useState({ email: "", password: "" });
  const auth = useAuth();
  const router = useRouter();  

  const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const adminEmails = [
    "a1@gmail.com",
    "a2@gmail.com",
    "a3@gmail.com"
  ];

  const userEmails = [
    "u1@gmail.com",
    "u2@gmail.com"
  ];

  const login = function () {
    let roles: string[] = [];
    if (adminEmails.includes(account.email)) {
      roles = ["M"]; 
    } else if (userEmails.includes(account.email)) {
      roles = ["U"]; 
    }

    auth.login(account.email, roles);  


    if (roles.includes("M")) {
      router.push('admin');  
    } else if (roles.includes("U")) {
      router.push('user');  
    } else {
      router.push('/');  
    }
  };

  return (
    <div>
      <TextField
        label="電子郵件"
        variant="outlined"
        type="text"
        name="email"
        value={account.email}
        onChange={handleClick}
      />
      <p />
      <TextField
        label="密碼"
        variant="outlined"
        type="password"
        name="password"
        value={account.password}
        onChange={handleClick}
      />
      <p />
      <Button variant="contained" color="primary" onClick={login}>
        登入
      </Button>
    </div>
  );
}
