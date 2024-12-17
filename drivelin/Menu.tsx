'use client';
import { AppBar, Button, TextField, Toolbar, Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from "../account/AuthContext";
import { useState } from 'react';

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" variant={pathname === "/" ? "outlined" : "text"} onClick={() => router.push("/")}>首頁</Button>
        <Button color="inherit" variant={pathname === "/product" ? "outlined" : "text"} onClick={() => router.push("/product")}>最新</Button>
        <Button color="inherit" variant={pathname === "/spot_end" ? "outlined" : "text"} onClick={() => router.push("/spot_end")}>景點分類</Button>

        <Box sx={{ flexGrow: 1 }} />  {/* 用於分隔按鈕與搜尋框 */}

        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜尋..."
          size="small"
          sx={{ backgroundColor: 'white', borderRadius: 1, mr: 1 }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#fed566', color: '#000',}}
          onClick={handleSearch}
        >
          搜尋
        </Button>


        <Box sx={{ ml: 2 }}>{auth.account.email}</Box>
      </Toolbar>
    </AppBar>
  );
}
