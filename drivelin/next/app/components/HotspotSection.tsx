"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "../_firebase/Config"; 
import styles from "../styles/HotspotSection.module.css";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function HotspotSection() {
  const [spots, setSpots] = useState<{
    id: string;
    s_name: string;
    imageUrl: string;
  }[]>([]);

  // 從 Firebase 抓取資料
  useEffect(() => {
    async function fetchSpots() {
      try {
        const response = await fetch(`${API_URL}/spot/`);
        const spotsData = await response.json();
        const filteredSpots = spotsData.filter(
          (spot: { s_name: string }) => spot.s_name !== "a" && spot.s_name !== "b"
        );
        setSpots(filteredSpots);
      } catch (error) {
        console.error("Error fetching spots:", error);
      }
    }
    fetchSpots();
  }, []);

  return (
    <section className={styles.hotspotSection}>
      <h2 className={styles.hotspotTitle}>熱門景點</h2>
  
      {Array.isArray(spots) && spots.length > 0 ? (
        <div className={styles.hotspotContainer}>
          {spots.slice(0, 4).map((spot) => (
            <Link key={spot.id} href={`/spot/${spot.id}`}>
              <div className={styles.hotspotItem}>
                <div
                  className={styles.hotspotImage}
                  style={{
                    backgroundImage: `url(${spot.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className={styles.hotspotName}>{spot.s_name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.noData}>目前沒有可顯示的景點。</p>
      )}
    </section>
  );
}
