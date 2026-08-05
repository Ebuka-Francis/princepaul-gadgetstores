"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeFromCart, getSubtotal } =
    useCartStore();

  const subtotal = getSubtotal();

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Panel */}
        <div
          className={`w-screen max-w-md bg-white border-l border-gray-200 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-blue-700" />
              <h2 className="text-base font-bold text-gray-900">Your Shopping Cart</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <ShoppingBag size={48} className="text-gray-300" />
                <p className="text-sm font-semibold text-gray-900">Your cart is empty</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  Looks like you haven&apos;t added any gadgets yet. Explore the shop to add items.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white rounded-xl transition-all cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-2xl p-3"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-blue-700 font-extrabold mt-0.5">
                      ₦{item.price.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Sticky Checkout Bar */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600 font-semibold">Subtotal</span>
                <span className="text-base font-extrabold text-gray-900">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Taxes and shipping calculated during checkout.
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-700/20 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}