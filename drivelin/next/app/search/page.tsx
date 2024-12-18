'use client'; 
import { useState } from 'react';
import styles from '../page.module.css'; 
import SearchSpotList from './searchSpotList'; 

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isQueried, setIsQueried] = useState(false); 

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('請輸入搜尋關鍵字');
      return;
    }
    setError('');
    setLoading(true);
    setIsQueried(true); 
    try {
      const response = await fetch(`http://localhost:8000/search?q=${searchQuery}`);
      if (!response.ok) {
        // 檢查錯誤回應內容
        const errorText = await response.text();
        throw new Error(`伺服器回應錯誤: ${errorText}`);
      }
      const data = await response.json();
      setFilteredSpots(data);
    } catch (err) {
      setError(`搜尋失敗: ${err.message}`);
      console.error(err);
    }
    
  };

  return (
    <div className={styles['search-container']}>
      <h1 className={styles['search-title']}>搜尋</h1>

      <div className={styles['search-input-container']}>
        <input
          type="text"
          placeholder="輸入關鍵字"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles['search-input']}
        />
        <button
          onClick={handleSearch}
          className={styles['search-button']}
          disabled={!searchQuery}
        >
          搜尋
        </button>
      </div>

      {error && <p className={styles['error-message']}>{error}</p>}


      <SearchSpotList spots={filteredSpots} isQueried={isQueried} /> {}
    </div>
  );
}
