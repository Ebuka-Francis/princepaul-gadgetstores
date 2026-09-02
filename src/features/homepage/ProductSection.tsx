"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Container from '@/components/layout/Container';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useCartStore, CartItem } from '@/store/useCartStore';

export default function ProductSection() {
  const addToCart = useCartStore((state) => state.addToCart);

  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      
      setProducts(productList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
    } as CartItem);
  };

  return (
    // <Container>
      <section className="mt-8 ">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-extrabold text-gray-900">
            Featured Products
          </h2>
          <Link 
            href="/products" 
            className="text-xs font-bold text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Loading State / Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-1">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white border border-gray-100 rounded-2xl p-3.5 animate-pulse flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Image Skeleton */}
                  <div className="w-full h-32 md:h-36 bg-slate-100 rounded-xl mb-3" />
                  
                  {/* Title Skeleton */}
                  <div className="space-y-2 mb-3">
                    <div className="h-3 bg-slate-100 rounded-full w-full" />
                    <div className="h-3 bg-slate-100 rounded-full w-2/3" />
                  </div>

                  {/* Price Skeleton */}
                  <div className="space-y-1.5">
                    <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-1/3" />
                  </div>
                </div>

                {/* Footer Skeleton (Rating & Button) */}
                <div className="flex items-center justify-between mt-4 pt-1">
                  <div className="h-3 bg-slate-100 rounded-full w-16" />
                  <div className="w-8 h-8 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No products available at the moment.
          </div>
        ) : (
          /* Static Grid Layout: 5 columns, multiple rows */
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 ">
            {products.map((product) => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;
              const discountPercent = hasDiscount
                ? `-${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%`
                : null;

              const displayPrice = `₦${product.price?.toLocaleString() || 0}`;
              const displayOriginalPrice = product.originalPrice
                ? `₦${product.originalPrice.toLocaleString()}`
                : null;

              const productImage = product.images?.[0] || '';

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="relative bg-white rounded-2xl p-3.5 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between group/card cursor-pointer"
                >
                  {discountPercent && (
                    <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                      {discountPercent}
                    </span>
                  )}

                  <div>
                    <div className="relative w-full h-32 md:h-36 bg-slate-50/60 rounded-xl overflow-hidden p-2 flex items-center justify-center mb-3">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          className="object-contain p-1 group-hover/card:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <h3 className="text-xs lg:text-sm font-bold text-gray-900 truncate group-hover/card:text-primary transition-colors">
                      {product.name}
                    </h3>

                    <div className="mt-2">
                      <div className="text-sm lg:text-base font-extrabold text-primary">
                        {displayPrice}
                      </div>
                      {displayOriginalPrice && (
                        <div className="text-[11px] text-gray-400 line-through font-medium">
                          {displayOriginalPrice}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-800">4.8</span>
                      <span>(24)</span>
                    </div>

                    <button
                      className="bg-primary hover:bg-primary/90 text-white p-2 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                      aria-label="Add to cart"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    // </Container>
  );
}