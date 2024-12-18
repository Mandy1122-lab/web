"use client";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function useSearch() {
  const [spots, setSpots] = useState<{
    id: string;
    s_name: string;
    s_add: string;
    map: string;
    s_intro: string;
    imageUrl: string;
    coverUrls: string[];
    hours: string;
    tel: string;
    s_tag: string[];
  }[]>([]);

  // 讀取spots
  useEffect(() => {
    async function fetchSpots() {
      try {
        const response = await fetch(`${API_URL}/spot/`);
        const data = await response.json();
        setSpots(data);
      } catch (error) {
        console.error("Error fetching spots:", error);
      }
    }
    fetchSpots();
  }, []);

  return { spots }; 
}
