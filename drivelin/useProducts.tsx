import { collection, getDocs, getFirestore, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import app from "@/app/_firebase/Config";
import { useEffect, useState } from "react";

export default function useProducts() {
  const db = getFirestore(app);
  const [products, setProducts] = useState<{ id: string, desc: string, price: number }[]>([]);

  // 讀取產品
  useEffect(() => {
    async function fetchProducts() {
      const data: { id: string, desc: string, price: number }[] = [];
      const querySnapshot = await getDocs(collection(db, "product"));
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() as { desc: string, price: number } });
      });
      setProducts(data);
    }
    fetchProducts();
  }, [db]);

  // 新增產品
  const addProduct = async (newProduct: { desc: string, price: number }) => {
    const docRef = await addDoc(collection(db, "product"), newProduct);
    setProducts((prev) => [...prev, { id: docRef.id, ...newProduct }]);
  };

  // 刪除產品
  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "product", id));
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  // 更新產品
  const updateProduct = async (id: string, updatedProduct: { desc: string, price: number }) => {
    await updateDoc(doc(db, "product", id), updatedProduct);
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product))
    );
  };

  return { products, addProduct, deleteProduct, updateProduct } as const;
}
