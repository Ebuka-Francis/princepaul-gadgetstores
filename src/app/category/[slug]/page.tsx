"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, PackageX, ShoppingCart, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Navbar from "@/features/homepage/Navbar";

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  badge?: string;
  category?: string;
  images?: string[];
  imageUrl?: string;
  stock?: number;
}

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const categorySlug = decodeURIComponent(resolvedParams.slug); 
  
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  // Format slug into a clean title (e.g., "smart-gadgets" -> "Smart Gadgets")
  const pageTitle = categorySlug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "products");
        
        // Query products where the category matches the slug
        const q = query(productsRef, where("category", "==", categorySlug));
        const querySnapshot = await getDocs(q);
        
        const fetchedProducts: ProductDetail[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as ProductDetail);
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700 mr-3" />
        <span className="font-medium">Loading {pageTitle}...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12 font-sans">
        {/* <Navbar /> */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center text-xs font-semibold text-gray-500 gap-1 mb-2">
              <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-900">{pageTitle}</span>
            </div>
            {/* <Link 
              href="/" 
              className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-blue-700 transition-colors mb-2"
            >
              <ChevronLeft size={14} className="mr-1" /> Back to Home
            </Link> */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{pageTitle}</h1>
          
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm min-h-[400px]">
            <PackageX className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">No products found</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              We currently don&apos;t have any products listed in the <span className="font-semibold text-gray-700">{pageTitle}</span> category. Check back later!
            </p>
            <Link
              href="/"
              className="mt-6 inline-block px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Products Grid matching design layout */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all group flex flex-col relative">
                
                {product.badge && (
                  <span className="absolute z-10 top-6 left-6 bg-[#FF5B5B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {product.badge}
                  </span>
                )}

                <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden">
                  <Image 
                    src={product.images?.[0] || product.imageUrl || "/placeholder.jpg"} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
                  />
                </Link>

                <div className="flex flex-col flex-1">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-blue-700 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-4 flex items-end justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-blue-700 leading-none">
                        ₦{(product.price).toLocaleString()}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-xs text-gray-400 line-through mt-1">
                          ₦{(product.originalPrice).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images?.[0] || product.imageUrl || "",
                          stock: product.stock,
                        });
                      }}
                      className="w-10 h-10 shrink-0 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}