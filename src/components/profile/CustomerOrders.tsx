"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Loader2, PackageX, Calendar } from "lucide-react";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items?: OrderItem[];
  createdAt?: { seconds: number };
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeOrders: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      // Clean up existing orders listener if auth state changes
      if (unsubscribeOrders) {
        unsubscribeOrders();
        unsubscribeOrders = null;
      }

      if (!currentUser) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid)
      );

      unsubscribeOrders = onSnapshot(
        ordersQuery,
        (snapshot) => {
          const items: CustomerOrder[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<CustomerOrder, "id">),
          }));

          items.sort(
            (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
          );

          setOrders(items);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching customer orders:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
        <span>Loading your order history...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center space-y-3">
        <PackageX className="w-12 h-12 text-slate-600 mx-auto" />
        <h4 className="font-bold text-white text-base">No orders found</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          You haven&apos;t placed any orders yet. Once you make a purchase, your full invoice and status history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const orderDate = order.createdAt?.seconds
          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently";

        return (
          <div
            key={order.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Order ID
                </span>
                <p className="font-mono text-xs text-white font-bold">
                  #{order.id}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={13} className="text-slate-500" />
                  <span>{orderDate}</span>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    order.status === "Delivered"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : order.status === "Cancelled"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}
                >
                  {order.status || "Processing"}
                </span>
              </div>
            </div>

            {/* Purchased Items List */}
            {order.items && order.items.length > 0 && (
              <div className="divide-y divide-slate-800/40">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="text-slate-200 font-medium">
                      {item.name}{" "}
                      <span className="text-slate-500">x{item.quantity}</span>
                    </div>
                    <div className="font-semibold text-slate-400">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Total */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">Total Amount</span>
              <span className="text-sm font-black text-emerald-400">
                ₦{(order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}