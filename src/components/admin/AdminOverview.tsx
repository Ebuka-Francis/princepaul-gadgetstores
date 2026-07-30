"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/components/admin/AdminProductTable";
import { Order } from "@/components/admin/AdminOrdersTable";
import {
  AlertTriangle,
  ShoppingBag,
  Package,
  ArrowRight,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";

interface AdminOverviewProps {
  onNavigateTab: (tab: "products" | "orders" | "users") => void;
  onOpenAddProduct: () => void;
}

export default function AdminOverview({
  onNavigateTab,
  onOpenAddProduct,
}: AdminOverviewProps) {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch low stock or out of stock items
    const productsRef = collection(db, "products");
    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const items: Product[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Product, "id">),
      }));

      // Items with stock <= 3
      const lowStock = items.filter((p) => p.stock <= 3);
      setLowStockProducts(lowStock);
    });

    // 2. Fetch 5 most recent orders
    const ordersRef = collection(db, "orders");
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      const items: Order[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Order, "id">),
      }));

      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRecentOrders(items.slice(0, 5));
      setLoading(false);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Action Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onOpenAddProduct}
          className="flex items-center justify-between p-4 bg-blue-600/10 border border-blue-500/20 hover:border-blue-500/50 rounded-2xl transition-all group text-left cursor-pointer"
        >
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
              Add New Product
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Publish a new item to store catalog</p>
          </div>
          <ArrowRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateTab("orders")}
          className="flex items-center justify-between p-4 bg-emerald-600/10 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl transition-all group text-left cursor-pointer"
        >
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
              Manage Orders
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Fulfill and update customer orders</p>
          </div>
          <ArrowRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateTab("products")}
          className="flex items-center justify-between p-4 bg-purple-600/10 border border-purple-500/20 hover:border-purple-500/50 rounded-2xl transition-all group text-left cursor-pointer"
        >
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
              Inventory Check
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Review stock levels and update prices</p>
          </div>
          <ArrowRight size={18} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Stream */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm">Recent Orders</h3>
            </div>
            <button
              onClick={() => onNavigateTab("orders")}
              className="text-xs text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="animate-spin text-blue-500 w-5 h-5" />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No recent orders logged.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-xs truncate">
                      {order.customerName || "Guest User"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      #{order.id.slice(0, 8)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-emerald-400 text-xs">
                      ₦{(order.totalAmount || 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Low Stock Alerts</h3>
            </div>
            <button
              onClick={() => onNavigateTab("products")}
              className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Manage Stock
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="animate-spin text-amber-500 w-5 h-5" />
            </div>
          ) : lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              All product stock levels are healthy!
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-white text-xs truncate">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{product.category}</div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      product.stock === 0
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {product.stock === 0 ? "Out of Stock" : `${product.stock} units left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}