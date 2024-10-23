'use client'
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from 'next/navigation';  // 使用 Next.js 的 useRouter

export default function Login() {
  const [account, setAccount] = useState({ email: "", password: "" });
  const auth = useAuth();
  const router = useRouter();  // 初始化 router

  const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const login = function () {
    let roles: string[] = [];
    if (account.email === "admin@example.com") {
      roles = ["M"]; // 管理員身份
    } else if (account.email === "user@example.com") {
      roles = ["U"]; // 一般用戶身份
    }

    auth.login(account.email, roles);  // 呼叫 AuthContext 內的 login 函數

    // 根據不同的 roles 導向不同的頁面
    if (roles.includes("M")) {
      router.push('admin');  // 導向管理員頁面
    } else if (roles.includes("U")) {
      router.push('user');  // 導向一般用戶頁面
    } else {
      router.push('/');  // 預設導向主頁面
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
