"use client";
import { useEffect, useState } from "react";

// 設定後端 API 的基礎 URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function useSpot() {
  const [spots, setSpots] = useState<{
    id: string;
    s_name: string;
    s_add: string;
    map: string;
    s_intro: string;
    imageUrl: string;
    coverUrls: string[]; // 增加劇照圖片的支持
    hours: string;
    tel: string;
    s_tag:string[];
  }[]>([]);

  // 讀取景點
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

  // 新增景點
  const addSpot = async (newSpot: {
    s_name: string;
    s_add: string;
    map: string;
    s_intro: string;
    imageUrl: string;
    coverUrls: string[]; // 加入劇照圖片 URL
    hours: string;
    tel: string;
    s_tag:string[];
  }) => {
    try {
      const response = await fetch(`${API_URL}/spot/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpot),
      });
      const data = await response.json();
      setSpots((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding spot:", error);
    }
  };

  // 刪除景點
  const deleteSpot = async (id: string) => {
    try {
      await fetch(`${API_URL}/spot/${id}`, {
        method: "DELETE",
      });
      setSpots((prev) => prev.filter((spot) => spot.id !== id));
    } catch (error) {
      console.error("Error deleting spot:", error);
    }
  };

  // 更新景點
  const updateSpot = async (id: string, updatedSpot: {
    s_name: string;
    s_add: string;
    map: string;
    s_intro: string;
    imageUrl: string;
    coverUrls: string[]; // 更新劇照圖片 URL
    hours: string;
    tel: string;
    s_tag:string[];
  }) => {
    try {
      const response = await fetch(`${API_URL}/spot/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSpot),
      });
      const data = await response.json();
      setSpots((prev) =>
        prev.map((spot) => (spot.id === id ? { ...spot, ...data } : spot))
      );
    } catch (error) {
      console.error("Error updating spot:", error);
    }
  };

  return { spots, addSpot, deleteSpot, updateSpot } as const;
}
