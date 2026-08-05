"use client";

import { usePaystackPayment } from "react-paystack";
import { CreditCard, Loader2 } from "lucide-react";

interface PaystackReference {
  reference: string;
  trxref: string;
  message: string;
  status: string;
  [key: string]: unknown;
}

interface PaystackButtonProps {
  email: string;
  amount: number;
  publicKey: string;
  onSuccess: (reference: PaystackReference) => void;
  onClose: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function PaystackCheckoutButton({
  email,
  amount,
  publicKey,
  onSuccess,
  onClose,
  loading,
  disabled,
}: PaystackButtonProps) {
  const config = {
    reference: new Date().getTime().toString(),
    email: email || "customer@example.com",
    amount: amount * 100,
    publicKey: publicKey || "",
  };

  const initializePaystack = usePaystackPayment(config);

  return (
    <button
      type="button"
      onClick={() => initializePaystack({ onSuccess, onClose })}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-700/20 transition-all cursor-pointer disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
      <span>Pay Online with Paystack</span>
    </button>
  );
}