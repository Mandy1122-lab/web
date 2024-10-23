'use client'
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login() {
  const [account, setAccount] = useState({ email: "", password: "" });
  const auth = useAuth();

  const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const login = function () {
    // 根據 email 決定使用者的身份角色
    let roles = [];
    if (account.email === "admin@example.com") {
      roles = ["M"]; // 管理員身份
    } else if (account.email === "user@example.com") {
      roles = ["U"]; // 一般用戶身份
    }
    auth.login(account.email, roles);  // 修正：傳遞 roles 參數
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
