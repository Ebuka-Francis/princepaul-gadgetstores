"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ProfileForm from "@/components/profile/ProfileForm";
import CustomerOrders from "@/components/profile/CustomerOrders";
import { User as UserIcon, ShoppingBag, ArrowLeft, Loader2, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "orders">("details");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
        <span>Verifying account session...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm text-center space-y-4">
          <UserIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold">Access Restricted</h2>
          <p className="text-xs text-slate-400">
            Please log in to your account to view your profile and order history.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </Link>

          <button
            onClick={() => auth.signOut()}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User Greeting */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-lg shrink-0">
            {currentUser.displayName
              ? currentUser.displayName.charAt(0).toUpperCase()
              : <UserIcon size={20} />}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white">
              {currentUser.displayName || "My Account"}
            </h1>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "details"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <UserIcon size={16} />
            <span>Account Details</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <ShoppingBag size={16} />
            <span>Order History</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sm:p-6">
          {activeTab === "details" && <ProfileForm />}
          {activeTab === "orders" && <CustomerOrders />}
        </div>

      </div>
    </div>
  );
}