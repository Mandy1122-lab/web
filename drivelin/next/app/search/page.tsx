'use client';

import { useState } from "react";

const Search = () => {
  const [query, setQuery] = useState<string>(""); // 搜尋關鍵字
  const [results, setResults] = useState<any[]>([]); // 搜尋結果
  const [loading, setLoading] = useState<boolean>(false); // 加載狀態
  const [error, setError] = useState<string>(""); // 錯誤訊息

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/search?q=${query}`);
      if (!response.ok) {
        throw new Error("搜尋失敗");
      }

      const data = await response.json();
      setResults(data);
    } catch (error: any) {
      setError(error.message || "搜尋錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>搜尋</h1>
      <input
        type="text"
        value={query}
        onChange={handleSearchInput}
        placeholder="輸入搜尋關鍵字"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "搜尋中..." : "搜尋"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {results.length === 0 && !loading && !error && <p>沒有搜尋結果</p>}
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              <h3>{result.s_name}</h3>
              <p>{result.s_tag.join(", ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;

