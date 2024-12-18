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
      const response = await fetch(`/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error('無法獲取搜尋結果');
      }
      const data = await response.json();
      setFilteredSpots(data);
    } catch (err) {
      setError();
      console.error(err);
    } finally {
      setLoading(false);
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

      {loading && <p>載入中...</p>}

      <SearchSpotList spots={filteredSpots} isQueried={isQueried} /> {}
    </div>
  );
}
