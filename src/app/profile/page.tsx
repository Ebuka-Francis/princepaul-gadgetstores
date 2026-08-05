"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

import ProfileForm from "@/components/profile/ProfileForm";
import CustomerOrders from "@/components/profile/CustomerOrders";
import { 
  User as UserIcon, 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  LogOut,
  Camera,
  ChevronRight
} from "lucide-react";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "orders">("details");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setUploadingImage(true);
      
      // 1. Prepare FormData for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      
      // IMPORTANT: Replace these with your actual Cloudinary details
      // You must enable "unsigned" uploads in your Cloudinary upload presets settings
      const uploadPreset = "YOUR_UPLOAD_PRESET"; 
      const cloudName = "YOUR_CLOUD_NAME";
      
      formData.append("upload_preset", uploadPreset);

      // 2. Upload to Cloudinary using their REST API
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        // 3. Update the user's profile in Firebase Auth with the new Cloudinary URL
        await updateProfile(currentUser, { photoURL: data.secure_url });
        
        // 4. Update local state to reflect the new image instantly
        setCurrentUser({ ...currentUser, photoURL: data.secure_url } as User);
      } else {
        console.error("Cloudinary upload failed:", data);
        alert("Failed to upload image. Please check your Cloudinary configuration.");
      }
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setUploadingImage(false);
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        <span className="text-sm font-medium">Loading your profile...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm w-full text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
            <UserIcon className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
            <p className="text-sm text-gray-500 mt-2">
              Please log in to your account to view your profile and order history.
            </p>
          </div>
          <Link
            href="/"
            className="block w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-700/20"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          {/* Sidebar Navigation & Profile Card */}
          <aside className="w-full md:w-72 lg:w-80 shrink-0 space-y-6">
            
            {/* User Info Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              
              {/* Profile Picture with Upload Overlay */}
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center font-bold text-blue-700 text-3xl overflow-hidden relative">
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
                  ) : currentUser.photoURL ? (
                    <Image 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    currentUser.displayName?.charAt(0).toUpperCase() || <UserIcon size={32} />
                  )}
                </div>
                
                {/* Hover Camera Icon Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white w-6 h-6" />
                </div>
                
                {/* Permanent little camera badge */}
                <div className="absolute bottom-0 right-0 bg-blue-700 p-1.5 rounded-full border-2 border-white shadow-sm">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div className="mt-4">
                <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">
                  {currentUser.displayName || "My Account"}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{currentUser.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex items-center justify-between w-full p-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "details"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserIcon size={18} className={activeTab === "details" ? "text-blue-700" : "text-gray-400"} />
                    <span>Account Details</span>
                  </div>
                  {activeTab === "details" && <ChevronRight size={16} />}
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center justify-between w-full p-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className={activeTab === "orders" ? "text-blue-700" : "text-gray-400"} />
                    <span>Order History</span>
                  </div>
                  {activeTab === "orders" && <ChevronRight size={16} />}
                </button>
              </nav>
              
              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => auth.signOut()}
                  className="flex items-center gap-3 w-full p-3.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <LogOut size={18} className="text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">
                {activeTab === "details" ? "Account Details" : "Order History"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {activeTab === "details" 
                  ? "Manage your personal information, address, and security." 
                  : "View and track your past and current gadget orders."}
              </p>
            </div>
            
            <div className="p-6">
              {activeTab === "details" && <ProfileForm />}
              {activeTab === "orders" && <CustomerOrders />}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}