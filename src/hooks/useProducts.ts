"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Product {
  id: string;
  name: string;
  brand?: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  stock: number;
  images: string[];
  isHotDeal?: boolean;
  isFeatured?: boolean;
  storageOptions?: string[];
  colorOptions?: string[];
  createdAt?: Timestamp | null;
}

// Custom hook for real-time product feeds
export function useProducts(filterHotDeals = false) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, "products");
    
    // Filter hot deals if requested
    const q = filterHotDeals
      ? query(productsRef, where("isHotDeal", "==", true), orderBy("createdAt", "desc"))
      : query(productsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, "id">),
        }));
        setProducts(items);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filterHotDeals]);

  return { products, loading };
}