"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { usePaystackPayment } from "react-paystack";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShoppingBag, CreditCard, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Paystack Configuration
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: formData.email || "customer@example.com",
    amount: subtotal * 100, // Paystack expects amount in kobo/cents
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePaystack = usePaystackPayment(paystackConfig);

  // Success handler for Paystack
 const handlePaystackSuccess = async (reference: { reference: string; trxref: string; message: string; status: string }) => {
    try {
      setLoading(true);
      // Save order to Firestore
      await addDoc(collection(db, "orders"), {
        customer: formData,
        items: cart,
        total: subtotal,
        paymentMethod: "Paystack",
        paymentReference: reference.reference,
        createdAt: serverTimestamp(),
        status: "Paid",
      });

      clearCart();
      router.push(`/checkout/success?ref=${reference.reference}`);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Payment was successful, but saving the order failed. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackClose = () => {
    alert("Payment window closed.");
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill in all delivery details before proceeding.");
      return;
    }
    initializePaystack({ onSuccess: handlePaystackSuccess, onClose: handlePaystackClose });
  };

  // 2. WhatsApp Checkout Handler
  const handleWhatsAppCheckout = () => {
    if (!formData.name || !formData.phone) {
      alert("Please enter at least your Name and Phone number for WhatsApp orders.");
      return;
    }

    const dealerPhoneNumber = "08133842387"; // Replace with the dealer's actual WhatsApp phone number
    
    let message = `*New Order Request*%0A%0A`;
    message += `*Customer Details:*%0A`;
    message += `Name: ${formData.name}%0A`;
    message += `Phone: ${formData.phone}%0A`;
    message += `Address: ${formData.address}, ${formData.city}%0A%0A`;
    message += `*Cart Items:*%0A`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.quantity}) - ₦${(item.price * (item.quantity || 1)).toLocaleString()}%0A`;
    });

    message += `%0A*Total Subtotal:* ₦${subtotal.toLocaleString()}`;

    const whatsappUrl = `https://wa.me/${dealerPhoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag size={48} className="text-gray-300 mb-3" />
        <h2 className="text-lg font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">Add some items to your cart to proceed to checkout.</p>
        <Link href="/" className="px-5 py-2.5 bg-blue-700 text-white font-bold text-xs rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Delivery Form */}
        <div className="lg:col-span-7 space-y-6">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-blue-700">
            <ArrowLeft size={14} className="mr-1" /> Continue Shopping
          </Link>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h1 className="text-lg font-bold text-gray-900">Delivery Information</h1>
            
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleInputChange}
                  placeholder="Prince Paul"
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-700" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="prince@example.com"
                    className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-700" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleInputChange}
                    placeholder="08012345678"
                    className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-700" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address</label>
                <textarea 
                  name="address" 
                  required 
                  rows={2}
                  value={formData.address} 
                  onChange={handleInputChange}
                  placeholder="Enter full street address"
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-700 resize-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City / State</label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange}
                  placeholder="Lagos"
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-700" 
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3">Order Summary</h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-10 h-10 relative bg-gray-50 rounded-lg overflow-hidden shrink-0 border">
                      <Image
  src={item.image || "/placeholder.jpg"}
  alt={item.name}
  fill
  className="object-contain p-1"
/>
                    </div>
                    <span className="font-semibold text-gray-800 truncate max-w-[150px]">{item.name} (x{item.quantity})</span>
                  </div>
                  <span className="font-bold text-gray-900">₦{(item.price * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-blue-700">₦{subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleSubmitPayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-700/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                <span>Pay Online with Paystack</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>Complete Order via WhatsApp</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}