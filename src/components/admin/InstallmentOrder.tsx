"use client";

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CreditCard, Search, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface InstallmentOrder {
  id: string;
  userName: string;
  userEmail: string;
  productName: string;
  productImage: string;
  totalGadgetPrice: number;
  installmentDuration: number;
  monthlyPayment: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
createdAt: Timestamp | Date | null;
}

export default function InstallmentPaymentsTable() {
  const [orders, setOrders] = useState<InstallmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Query orders where isInstallment is true
    const q = query(
      collection(db, "orders"), 
      where("isInstallment", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const installmentList: InstallmentOrder[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InstallmentOrder[];

      setOrders(installmentList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching installment orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(order => 
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white">Installment Payments (BNPL)</h2>
          <p className="text-xs text-slate-400">Monitor active &quot;Pay Small Small&quot; customer repayment tracking.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/80">
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Product / Plan</th>
                <th className="py-4 px-6">Total Price</th>
                <th className="py-4 px-6">Paid / Remaining</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 animate-pulse">
                    Loading installment records...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No active installment payments found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const progressPercent = Math.round((order.amountPaid / order.totalGadgetPrice) * 100);

                  return (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Customer Details */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{order.userName || "N/A"}</div>
                        <div className="text-[11px] text-slate-400">{order.userEmail}</div>
                      </td>

                      {/* Product Name */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-200">{order.productName}</div>
                        <div className="text-[10px] text-blue-400 font-medium">Monthly: ₦{order.monthlyPayment?.toLocaleString()}</div>
                      </td>

                      {/* Total Gadget Price */}
                      <td className="py-4 px-6 font-extrabold text-white">
                        ₦{order.totalGadgetPrice?.toLocaleString()}
                      </td>

                      {/* Paid vs Remaining breakdown */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-emerald-400 font-bold">Paid: ₦{order.amountPaid?.toLocaleString()}</span>
                            <span className="text-amber-400 font-medium">Bal: ₦{order.amountRemaining?.toLocaleString()}</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-6 font-semibold text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                          <span>{order.installmentDuration} Months</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {order.status === 'Completed' ? <CheckCircle2 size={12} /> : <CreditCard size={12} />}
                          {order.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}