// app/api/search/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q'); // 從 URL 取得搜尋關鍵字

  if (!query) {
    return NextResponse.json({ message: "搜尋內容不得為空" }, { status: 400 });
  }

  const apiUrl = `http://localhost:8000/search?q=${query}`; // 根據你的後端 API 地址進行調整

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('搜尋失敗');
    }

    const data = await response.json();
    return NextResponse.json(data); // 返回搜尋結果
  } catch (error) {
    return NextResponse.json({ message: "搜尋錯誤" }, { status: 500 });
  }
}
