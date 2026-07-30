"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap, Star, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

export default function FlashDeals() {
  // Fetch real-time items where isHotDeal === true
  const { products: hotDeals, loading } = useProducts(true);

  if (loading) {
    return (
      <div className="w-full my-6 lg:my-8 bg-slate-50/50 p-8 rounded-2xl border border-slate-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  // If there are no live hot deal products in Firestore, hide the section
  if (hotDeals.length === 0) {
    return null;
  }

  return (
    <section className="w-full my-6 lg:my-8 bg-slate-50/50 p-3 sm:p-4 lg:p-6 rounded-2xl border border-slate-100">
      
      {/* --- Section Header --- */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        {/* Left Header Title */}
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500 hidden md:block" />
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
              <span className="md:hidden">Top Deals</span>
              <span className="hidden md:inline">Flash Deals</span>
            </h2>
            <p className="text-xs text-gray-500 hidden md:block">
              Limited time offers on top gadgets
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-4">
          {/* Desktop Timer Display */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600 font-medium">
            <span>Ending in:</span>
            <div className="flex items-center gap-1">
              {[
                { val: "02", label: "Days" },
                { val: "14", label: "Hours" },
                { val: "36", label: "Mins" },
                { val: "58", label: "Secs" },
              ].map((time, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg px-2 py-1 flex flex-col items-center min-w-[34px] shadow-2xs"
                >
                  <span className="font-bold text-gray-900 text-xs leading-none">
                    {time.val}
                  </span>
                  <span className="text-[8px] text-gray-400 scale-90">
                    {time.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* View All Link */}
          <Link
            href="/deals"
            className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-primary hover:underline"
          >
            <span className="md:hidden">View all</span>
            <span className="hidden md:inline">View all deals</span>
            <ArrowRight size={14} className="hidden md:inline" />
          </Link>
        </div>
      </div>

      {/* --- MOBILE VIEW (< md): Horizontal Touch Slider --- */}
      <div className="flex md:hidden items-stretch gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1">
        {hotDeals.map((product) => {
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;
          const discountPercent = hasDiscount
            ? `-${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%`
            : null;

          const displayPrice = `₦${product.price.toLocaleString()}`;
          const displayOriginalPrice = product.originalPrice
            ? `₦${product.originalPrice.toLocaleString()}`
            : null;

          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="snap-start shrink-0 w-[160px] xs:w-[175px] bg-white rounded-2xl p-3 border border-gray-100 flex flex-col justify-between shadow-2xs group"
            >
              <div>
                {/* Image & Badge Wrapper */}
                <div className="relative w-full aspect-square mb-2 bg-slate-50/50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                  {/* Badge Overlay */}
                  {discountPercent && (
                    <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs z-10">
                      {discountPercent}
                    </span>
                  )}

                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug min-h-[32px]">
                  {product.name}
                </h3>
              </div>

              {/* Price Block */}
              <div className="mt-2 pt-1">
                <div className="text-sm font-extrabold text-primary leading-tight">
                  {displayPrice}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {displayOriginalPrice && (
                    <span className="text-[10px] text-gray-400 line-through font-medium">
                      {displayOriginalPrice}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-[10px] font-bold text-red-500">
                      {discountPercent}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* --- DESKTOP VIEW (>= md): Grid with Horizontal Cards --- */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
        {hotDeals.map((product) => {
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;
          const discountPercent = hasDiscount
            ? `-${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%`
            : null;

          const displayPrice = `₦${product.price.toLocaleString()}`;
          const displayOriginalPrice = product.originalPrice
            ? `₦${product.originalPrice.toLocaleString()}`
            : null;

          return (
            <div
              key={product.id}
              className="relative bg-white rounded-2xl p-3.5 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group"
            >
              {/* Left Discount Badge */}
              {discountPercent && (
                <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                  {discountPercent}
                </span>
              )}

              {/* Product Image Container */}
              <Link
                href={`/product/${product.id}`}
                className="relative w-28 h-28 lg:w-32 lg:h-32 shrink-0 bg-slate-50/60 rounded-xl overflow-hidden p-2 flex items-center justify-center"
              >
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </Link>

              {/* Product Details (Right Side) */}
              <div className="flex flex-col justify-between flex-1 min-w-0 h-full py-1">
                <div>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-xs lg:text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

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

                {/* Bottom Rating + Add to Cart Button */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-800">4.8</span>
                    <span>(24)</span>
                  </div>

                  <button
                    className="bg-primary hover:bg-primary/90 text-white p-2 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}