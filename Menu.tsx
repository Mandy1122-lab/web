'use client';
import { AppBar, Button, Toolbar } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
// import { AuthContext } from './account/AuthContext';
// import { useContext } from 'react';
import { useAuth } from "./account/AuthContext";


export default function Menu() {
  const router = useRouter()
  const pathname = usePathname()
  // const authContext = useContext(AuthContext);
  const auth = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" variant={pathname === "/" ? "outlined" : "text"} onClick={() => router.push("/")}>主頁面</Button>
        <Button color="inherit" variant={pathname === "/product" ? "outlined" : "text"} onClick={() => router.push("/product")}>產品管理</Button>
        <Button color="inherit" variant={pathname === "/spot_end" ? "outlined" : "text"} onClick={() => router.push("/spot_end")}>景點管理</Button>
        
        {auth.account.email}
      </Toolbar>
    </AppBar>
  );
}