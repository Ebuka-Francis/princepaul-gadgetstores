"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShieldCheck } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/useCartStore';

interface PaySmallSmallModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number;
  productId?: string;
  productImage?: string;
  stock?: number;
}

export default function PaySmallSmallModal({ 
  isOpen, 
  onClose, 
  productName, 
  price,
  productId = "default-id",
  productImage = "/placeholder.jpg",
  stock = 10
}: PaySmallSmallModalProps) {
  const router = useRouter();
  const [months, setMonths] = useState<number>(3); // Default to 3 months
  const addToCart = useCartStore((state) => state.addToCart);

  if (!isOpen) return null;

  const monthlyPayment = Math.round(price / months);

  const handleProceed = () => {
    // Add item to cart with typed installment metadata fields
    addToCart({
      id: productId,
      name: productName,
      price: monthlyPayment, // Set initial payable amount in cart to the first installment
      image: productImage[0] || "/placeholder.jpg",
      stock: stock,   
      quantity: 1,
      isInstallment: true,
      installmentDuration: months,
      totalGadgetPrice: price,  
      monthlyPayment: monthlyPayment,
      amountPaid: monthlyPayment, // First payment made upon activation
      amountRemaining: price - monthlyPayment,
    } as CartItem);

    console.log(`Selected ${months} months installment for ${productName} at ₦${monthlyPayment}/mo`);
    onClose();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="text-[10px] bg-blue-50 text-[#0044FF] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Flexible BNPL Plan
          </span>
          <h3 className="text-base font-extrabold text-gray-900 mt-2">
            Pay Small Small (1 - 5 Months)
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {productName}
          </p>
        </div>

        {/* Month Selector Options */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Choose your repayment duration:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonths(m)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  months === m
                    ? 'bg-[#0044FF] text-white border-[#0044FF] shadow-xs'
                    : 'bg-slate-50 text-gray-700 border-slate-200 hover:border-[#0044FF]/50'
                }`}
              >
                {m} {m === 1 ? 'Mo' : 'Mos'}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 mb-6 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Total Gadget Price</span>
            <span className="font-bold text-gray-900">₦{price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Duration Selected</span>
            <span className="font-bold text-gray-900">{months} {months === 1 ? 'Month' : 'Months'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Amount Remaining After 1st Payment</span>
            <span className="font-bold text-gray-700">₦{(price - monthlyPayment).toLocaleString()}</span>
          </div>
          <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800">First Month Due Now</span>
            <span className="text-base font-extrabold text-[#0044FF]">
              ₦{monthlyPayment.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">/mo</span>
            </span>
          </div>
        </div>

        {/* Trust Note */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-6">
          <ShieldCheck size={16} className="text-[#0044FF] shrink-0" />
          <span>Secured installment tracking. First payment activates order processing.</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleProceed}
          className="w-full py-3 bg-[#0044FF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
        >
          Proceed with {months}-Month Plan
        </button>

      </div>
    </div>
  );
}