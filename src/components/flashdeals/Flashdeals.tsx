"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Zap, Star, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useProducts, Product } from "@/hooks/useProducts";

export default function FlashDeals() {
  const router = useRouter();
  const { products: hotDeals, loading } = useProducts(true);
  const addToCart = useCartStore((state) => state.addToCart);

  // Global Flash Sale Timer State managed from Dashboard settings
  const [flashSaleEndTime, setFlashSaleEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Fetch Global Flash Sale Countdown from Firestore settings/flashSale
  useEffect(() => {
    const fetchFlashSaleSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "flashSale");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          const settingsData = settingsSnap.data();
          if (settingsData?.endTime) {
            const target = settingsData.endTime?.seconds 
              ? settingsData.endTime.seconds * 1000 
              : new Date(settingsData.endTime).getTime();
            setFlashSaleEndTime(target);
          }
        }
      } catch (err) {
        console.error("Error fetching flash sale settings:", err);
      }
    };

    fetchFlashSaleSettings();
  }, []);

  // Live Countdown Tick effect
  useEffect(() => {
    if (!flashSaleEndTime) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = flashSaleEndTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, mins, secs });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [flashSaleEndTime]);

  // Safely handle adding to cart without triggering navigation
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

  if (loading) {
    return (
      <div className="w-full my-6 lg:my-8 bg-slate-50/50 p-8 rounded-2xl border border-slate-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (hotDeals.length === 0) {
    return null;
  }

  return (
    <section className="w-full my-6 lg:my-8 bg-slate-50/50 p-3 sm:p-4 lg:p-6 rounded-2xl border border-slate-100 overflow-hidden">
      
      {/* --- Section Header --- */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
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

        <div className="flex items-center gap-4">
          {/* Dashboard-Controlled Global Flash Sale Timer */}
          {flashSaleEndTime && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600 font-medium">
              <span>Ending in:</span>
              <div className="flex items-center gap-1">
                {[
                  { val: String(timeLeft.days).padStart(2, '0'), label: "Days" },
                  { val: String(timeLeft.hours).padStart(2, '0'), label: "Hours" },
                  { val: String(timeLeft.mins).padStart(2, '0'), label: "Mins" },
                  { val: String(timeLeft.secs).padStart(2, '0'), label: "Secs" },
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
          )}

          {/* <Link
            href="/deals"
            className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-primary hover:underline"
          >
            <span className="md:hidden">View all</span>
            <span className="hidden md:inline">View all deals</span>
            <ArrowRight size={14} className="hidden md:inline" />
          </Link> */}
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
            <div
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)}
              className="snap-start shrink-0 w-[160px] xs:w-[175px] bg-white rounded-2xl p-3 border border-gray-100 flex flex-col justify-between shadow-2xs group cursor-pointer"
            >
              <div>
                <div className="relative w-full aspect-square mb-2 bg-slate-50/50 rounded-xl overflow-hidden flex items-center justify-center p-2">
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

                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug min-h-[32px]">
                  {product.name}
                </h3>
              </div>

              <div className="mt-2 pt-1 flex items-end justify-between">
                <div>
                  <div className="text-sm font-extrabold text-primary leading-tight">
                    {displayPrice}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {displayOriginalPrice && (
                      <span className="text-[10px] text-gray-400 line-through font-medium">
                        {displayOriginalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  className="bg-blue-50 text-primary hover:bg-primary hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DESKTOP VIEW (>= md): Infinite Moving Marquee Row --- */}
      <div className="hidden md:flex overflow-hidden relative w-full group py-1">
        <div className="flex gap-4 animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] w-max">
          {/* Render hotDeals twice to create a seamless infinite loop effect */}
          {[...hotDeals, ...hotDeals].map((product, index) => {
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
                key={`${product.id}-${index}`}
                onClick={() => router.push(`/products/${product.id}`)}
                className="relative bg-white rounded-2xl p-3.5 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group/card cursor-pointer w-[280px] shrink-0"
              >
                {discountPercent && (
                  <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                    {discountPercent}
                  </span>
                )}

                <div className="relative w-28 h-28 lg:w-32 lg:h-32 shrink-0 bg-slate-50/60 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
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

                <div className="flex flex-col justify-between flex-1 min-w-0 h-full py-1">
                  <div>
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

                  <div className="flex items-center justify-between mt-3">
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Tailwind CSS Custom Keyframes for Marquee (if not already defined in globals.css) */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}