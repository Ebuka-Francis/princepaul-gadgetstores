"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCartStore, CartItem } from "@/store/useCartStore";
import Navbar from "@/features/homepage/Navbar";
import {
  Search,
  Share2,
  Heart,
  Star,
  ShoppingCart,
  Loader2,
  PackageX,
  User,
  ArrowRightLeft,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Truck,
  Lock,
  RefreshCw,
  Smartphone,
  Cpu,
  Camera,
  Battery,
} from "lucide-react";

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  images?: string[];
  imageUrl?: string;
  stock?: number;
  storageOptions?: string[];
  colors?: { name: string; hex: string }[];
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("Description");

  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cart);
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as ProductDetail;
          setProduct(data);

          if (data.storageOptions && data.storageOptions.length > 0) {
            setSelectedStorage(data.storageOptions[0]);
          }
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#0044FF] mr-2" />
        <span>Loading gadget details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-sm text-center space-y-4 shadow-sm">
          <PackageX className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-xl font-bold">Product Not Found</h2>
          <p className="text-sm text-gray-500">
            This item might have been removed or is temporarily unavailable.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-[#0044FF] hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  // Fallback data for the UI to match the exact mockup
  const images = product.images && product.images.length > 0
    ? product.images
    : Array(5).fill(product.imageUrl || "/placeholder.jpg");

  const storageList = product.storageOptions || ["128GB", "256GB", "512GB", "1TB"];
  const colorList = product.colors || [
    { name: "Deep Purple", hex: "#4B4453" },
    { name: "Space Black", hex: "#2E2E2E" },
    { name: "Gold", hex: "#D4AF37" },
    { name: "Silver", hex: "#E0E0E0" },
  ];

  const activeStorage = selectedStorage || storageList[0];
  const activeColor = selectedColor || colorList[0];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: `${product.name} (${activeStorage}, ${activeColor.name})`,
      price: product.price,
      image: images[currentImgIndex],
      stock: product.stock,
    } as Omit<CartItem, "quantity">);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 pb-12 font-sans">
      <Navbar />
      {/* --- TOP NAVBAR --- */}
   

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-6">
        
        {/* --- BREADCRUMBS --- */}
        <div className="flex items-center gap-2 py-6 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* --- MAIN PRODUCT SPLIT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 relative">
            
            {/* Action Icons Top Right */}
            <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
              <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                <Share2 size={16} />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center transition-colors"
              >
                <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : "fill-red-500 text-red-500"} />
              </button>
            </div>

            {/* Vertical Thumbnails */}
            <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImgIndex(idx)}
                  className={`w-full aspect-square rounded-xl overflow-hidden border-2 flex items-center justify-center bg-gray-50 p-1 ${
                    currentImgIndex === idx ? "border-[#0044FF]" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} width={60} height={60} className="object-contain" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
              <Image
                src={images[currentImgIndex]}
                alt={product.name}
                fill
                priority
                className="object-contain p-8"
              />
            </div>

            {/* Pagination & Arrows Bottom */}
            <div className="absolute bottom-6 left-6 bg-gray-50 text-gray-700 text-xs font-medium px-4 py-1.5 rounded-full">
              {currentImgIndex + 1} / {images.length}
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2">
              <button 
                onClick={() => setCurrentImgIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentImgIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col">
            <div className="space-y-6">
              
              <div className="space-y-3">
                <span className="inline-block bg-[#FF5B5B] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  {product.badge || "Hot Deal"}
                </span>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Star size={16} className="fill-[#FFB800] text-[#FFB800]" />
                  <span className="font-bold text-gray-800">{product.rating || "4.9"}</span>
                  <span>({product.reviewsCount || "128"} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-[#0044FF]">
                  ₦{(product.price || 1250000).toLocaleString()}
                </span>
                
                {(product.originalPrice || 1400000) > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-medium">
                      ₦{(product.originalPrice || 1400000).toLocaleString()}
                    </span>
                    <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded-md">
                      -{product.discountPercentage || 11}%
                    </span>
                  </>
                )}
              </div>

              {/* Storage Selection */}
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Storage:
                </label>
                <div className="flex flex-wrap gap-3">
                  {storageList.map((storage) => {
                    const isSelected = activeStorage === storage;
                    return (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-white text-[#0044FF] border-[#0044FF]"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {storage}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Color: <span className="font-normal text-gray-600 ml-1">{activeColor.name}</span>
                </label>
                <div className="flex items-center gap-4">
                  {colorList.map((col) => {
                    const isSelected = activeColor.name === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-[#0044FF] ring-offset-2 ring-offset-white"
                            : "ring-1 ring-gray-200 hover:ring-gray-300"
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-full border border-black/5"
                          style={{ backgroundColor: col.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-8 mt-auto">
                <button
                  onClick={handleAddToCart}
                  className="w-14 h-14 flex shrink-0 items-center justify-center bg-white text-gray-700 rounded-xl transition-all cursor-pointer border border-gray-200 hover:bg-gray-50"
                >
                  <ShoppingCart size={22} />
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 h-14 bg-[#0044FF] hover:bg-blue-700 text-white font-bold text-base rounded-xl transition-all cursor-pointer flex items-center justify-center"
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* --- FEATURES BANNER --- */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="flex items-center gap-4 flex-1 px-4 w-full">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0044FF] shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">100% Authentic</h4>
              <p className="text-xs text-gray-500 mt-0.5">Genuine Apple Products</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 px-4 w-full pt-4 md:pt-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0044FF] shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Fast Nationwide Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">Delivery to all 36 states</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 px-4 w-full pt-4 md:pt-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0044FF] shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Secure Payment</h4>
              <p className="text-xs text-gray-500 mt-0.5">100% secure payment</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 px-4 w-full pt-4 md:pt-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0044FF] shrink-0">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">7 Days Return</h4>
              <p className="text-xs text-gray-500 mt-0.5">Easy return & refund</p>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION (Tabs + Related) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tabs Section */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-8 border-b border-gray-100 pb-4">
              {['Description', 'Specifications', 'Reviews (128)', 'Shipping & Delivery'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-semibold pb-4 -mb-4 relative ${
                    activeTab === tab ? "text-[#0044FF]" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0044FF] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-8 space-y-6">
              {activeTab === 'Description' && (
                <>
                  <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                    <p className="font-medium text-gray-900">{product.name}. The ultimate iPhone.</p>
                    <p>
                      {product.description || "A magical new way to interact with iPhone. Groundbreaking safety features designed to save lives. An innovative 48MP camera for stunning detail. All powered by the ultimate smartphone chip."}
                    </p>
                  </div>
                  
                  {/* <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Smartphone size={18} className="text-gray-400" />
                      <span>6.7-inch Super Retina XDR display</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu size={18} className="text-gray-400" />
                      <span>A16 Bionic chip</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera size={18} className="text-gray-400" />
                      <span>48MP Main camera</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery size={18} className="text-gray-400" />
                      <span>Up to 29 hours video playback</span>
                    </div>
                  </div> */}
                </>
              )}
              {activeTab !== 'Description' && (
                <div className="text-sm text-gray-500">Content for {activeTab} will go here.</div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">You may also like</h3>
              <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {/* Dummy Related Products mapping exact visual details */}
              {[
                { name: "iPhone 14 Pro 128GB", price: 1080000, img: "/placeholder.jpg" },
                { name: "iPhone 13 Pro Max 256GB", price: 930000, img: "/placeholder.jpg" },
                { name: "iPhone 15 Pro 256GB", price: 1620000, img: "/placeholder.jpg" },
                { name: "iPhone 14 128GB", price: 780000, img: "/placeholder.jpg" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 cursor-pointer group">
                  <div className="bg-gray-50 rounded-xl p-3 aspect-square flex items-center justify-center relative overflow-hidden">
                    <Image src={product.images?.[0] || item.img} alt={item.name} fill className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs font-bold text-[#0044FF] mt-0.5">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}