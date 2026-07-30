"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Search,
  ShoppingBag,
  Loader2,
  PackageX,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
  X,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  phone?: string;
  paymentMethod?: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt?: { seconds: number };
}

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Subscribe to real-time orders collection
  useEffect(() => {
    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        const items: Order[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Order, "id">),
        }));

        // Sort descending by creation date
        items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setOrders(items);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Update order status in Firestore
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders by search & status tab
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return {
          color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: Clock,
        };
      case "Processing":
        return {
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: Package,
        };
      case "Shipped":
        return {
          color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          icon: Truck,
        };
      case "Delivered":
        return {
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "Cancelled":
        return {
          color: "bg-red-500/10 text-red-400 border-red-500/20",
          icon: XCircle,
        };
      default:
        return {
          color: "bg-slate-800 text-slate-300 border-slate-700",
          icon: Clock,
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">Order Details</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-blue-500" />
                    <span>Loading real-time orders...</span>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageX size={32} className="text-slate-600" />
                    <span>{searchTerm ? "No matching orders found." : "No orders logged yet."}</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const BadgeIcon = badge.icon;
                const itemCount = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

                return (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Order ID & Item count */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-800 text-blue-400 border border-slate-700/60">
                          <ShoppingBag size={16} />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-white text-xs">
                            #{order.id.slice(0, 8)}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-xs sm:text-sm">
                        {order.customerName || "Guest Customer"}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {order.customerEmail || "No email provided"}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-white text-xs sm:text-sm">
                      ₦{(order.totalAmount || 0).toLocaleString()}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {updatingId === order.id ? (
                          <Loader2 size={14} className="animate-spin text-blue-500" />
                        ) : (
                          <select
                            value={order.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border focus:outline-none cursor-pointer bg-slate-900 ${badge.color}`}
                          >
                            <option value="Pending" className="bg-slate-900 text-amber-400">
                              Pending
                            </option>
                            <option value="Processing" className="bg-slate-900 text-blue-400">
                              Processing
                            </option>
                            <option value="Shipped" className="bg-slate-900 text-purple-400">
                              Shipped
                            </option>
                            <option value="Delivered" className="bg-slate-900 text-emerald-400">
                              Delivered
                            </option>
                            <option value="Cancelled" className="bg-slate-900 text-red-400">
                              Cancelled
                            </option>
                          </select>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all cursor-pointer"
                        title="View Order Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Order Details
                </span>
                <h3 className="text-lg font-bold text-white font-mono">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer & Shipping Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <User size={14} className="text-blue-400" />
                  <span>Customer Info</span>
                </div>
                <p className="text-sm font-semibold text-white">{selectedOrder.customerName}</p>
                <p className="text-xs text-slate-400">{selectedOrder.customerEmail}</p>
                {selectedOrder.phone && (
                  <p className="text-xs text-slate-400">{selectedOrder.phone}</p>
                )}
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <MapPin size={14} className="text-blue-400" />
                  <span>Shipping Address</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedOrder.shippingAddress || "No shipping address provided"}
                </p>
                {selectedOrder.paymentMethod && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                    <CreditCard size={12} />
                    <span>Payment: {selectedOrder.paymentMethod}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Items Purchased List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Items Purchased ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950/40 overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs sm:text-sm">{item.name}</h5>
                        <p className="text-[11px] text-slate-400">
                          ₦{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-white text-xs sm:text-sm">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-sm font-bold text-slate-300">Grand Total</span>
              <span className="text-xl font-extrabold text-emerald-400">
                ₦{(selectedOrder.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}