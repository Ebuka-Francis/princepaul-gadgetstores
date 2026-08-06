"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  PackagePlus,
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
  Package,
  ArrowLeft,
  Store,
  LucideIcon,
  Loader2,
  Clock,
  X,
  CheckCircle2,
  Zap,
} from "lucide-react";

import AddProductForm from "@/components/admin/AddProductForm";
import AdminProductTable from "@/components/admin/AdminProductTable";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminOverview from "@/components/admin/AdminOverview";

type TabId = "overview" | "products" | "orders" | "users";

interface TabItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "users", label: "Users", icon: Users },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isFlashTimerOpen, setIsFlashTimerOpen] = useState(false);

  // Flash Sale Timer State
  const [endTime, setEndTime] = useState("");
  const [savingTimer, setSavingTimer] = useState(false);
  const [timerSuccess, setTimerSuccess] = useState(false);
  const [loadingTimer, setLoadingTimer] = useState(false);

  // Live Metrics State
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalStockCount: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Fetch current Flash Sale Timer on load
  useEffect(() => {
    const fetchFlashTimer = async () => {
      setLoadingTimer(true);
      try {
        const docRef = doc(db, "settings", "flashSale");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.endTime) {
            const dateObj = data.endTime?.seconds 
              ? new Date(data.endTime.seconds * 1000) 
              : new Date(data.endTime);
            const formatted = dateObj.toISOString().slice(0, 16);
            setEndTime(formatted);
          }
        }
      } catch (err) {
        console.error("Error fetching timer settings:", err);
      } finally {
        setLoadingTimer(false);
      }
    };

    fetchFlashTimer();
  }, []);

  // Save Flash Sale Timer Handler
  const handleSaveFlashTimer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endTime) return;

    setSavingTimer(true);
    setTimerSuccess(false);

    try {
      const targetDate = new Date(endTime);
      await setDoc(doc(db, "settings", "flashSale"), {
        endTime: targetDate.toISOString(),
        updatedAt: new Date(),
      }, { merge: true });

      setTimerSuccess(true);
      setTimeout(() => {
        setTimerSuccess(false);
        setIsFlashTimerOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Error saving timer:", err);
      alert("Failed to update timer");
    } finally {
      setSavingTimer(false);
    }
  };

  // Fetch Live Metrics
  useEffect(() => {
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      let stockCount = 0;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        stockCount += Number(data.stock || 0);
      });

      setMetrics((prev) => ({
        ...prev,
        totalProducts: snapshot.size,
        totalStockCount: stockCount,
      }));
    });

    const unsubscribeOrders = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        let revenue = 0;
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          revenue += Number(data.totalAmount || data.price || 0);
        });

        setMetrics((prev) => ({
          ...prev,
          totalOrders: snapshot.size,
          totalRevenue: revenue,
        }));
      },
      () => {}
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        setMetrics((prev) => ({
          ...prev,
          totalUsers: snapshot.size,
        }));
        setLoadingMetrics(false);
      },
      () => {
        setLoadingMetrics(false);
      }
    );

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeUsers();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 group transition-all">
            <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-2xl group-hover:bg-blue-600 transition-colors">
              <Store className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                GadgetStore
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Go to Main Store
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-800 transition-all active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>Back to Store Home</span>
          </Link>
        </div>

        {/* Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage product listings, track revenue, and view active customer orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Flash Deals Timer Button */}
            <button
              onClick={() => setIsFlashTimerOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Clock size={16} />
              <span>Flash Deals Timer</span>
            </button>

            {/* Add New Product Button */}
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <PackagePlus size={18} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Revenue",
              value: `₦${metrics.totalRevenue.toLocaleString()}`,
              subtext: "From completed orders",
              icon: DollarSign,
              color: "text-emerald-400",
            },
            {
              title: "Total Orders",
              value: metrics.totalOrders.toString(),
              subtext: "Customer orders",
              icon: ShoppingBag,
              color: "text-blue-400",
            },
            {
              title: "Active Inventory",
              value: `${metrics.totalProducts} Types`,
              subtext: `${metrics.totalStockCount} units in stock`,
              icon: Package,
              color: "text-amber-400",
            },
            {
              title: "Registered Users",
              value: metrics.totalUsers.toString(),
              subtext: "Active accounts",
              icon: Users,
              color: "text-indigo-400",
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-xl bg-slate-800/80 ${card.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  {loadingMetrics ? (
                    <Loader2 className="animate-spin text-slate-500 w-5 h-5 my-1" />
                  ) : (
                    <span className="text-xl sm:text-2xl font-black text-white">
                      {card.value}
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-slate-400">
                    {card.subtext}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Rendering */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 min-h-[300px]">
          {activeTab === "overview" && (
            <AdminOverview
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddProduct={() => setIsAddProductOpen(true)}
            />
          )}

          {activeTab === "products" && <AdminProductTable />}

          {activeTab === "orders" && <AdminOrdersTable />}

          {activeTab === "users" && <AdminUsersTable />}
        </div>

      </div>

      {/* Add Product Modal */}
      <AddProductForm
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />

      {/* Flash Deals Timer Settings Modal */}
      {isFlashTimerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Zap size={20} className="fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Flash Deals Campaign Timer</h3>
                  <p className="text-xs text-slate-400">Set expiration for homepage deals.</p>
                </div>
              </div>
              <button
                onClick={() => setIsFlashTimerOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {loadingTimer ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              </div>
            ) : (
              <form onSubmit={handleSaveFlashTimer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-400" />
                    Expiration Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {timerSuccess ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Timer updated!
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Syncs automatically to homepage.
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFlashTimerOpen(false)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingTimer}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      {savingTimer && <Loader2 size={14} className="animate-spin" />}
                      Save Timer
                    </button>
                  </div>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}