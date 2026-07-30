"use client";

import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";
import { Loader2, ShoppingBag } from "lucide-react";

export default function ProductGrid() {
  const { products, loading } = useProducts(false);

  if (loading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        No products available right now. Check back soon!
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Explore Products</h2>
          <p className="text-xs text-gray-500">Discover all latest gadgets and devices</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square w-full rounded-xl bg-gray-50 overflow-hidden mb-3">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {product.brand || product.category}
                </span>
                <h3 className="text-xs font-bold text-gray-800 line-clamp-1 mt-0.5">
                  {product.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-sm font-extrabold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}