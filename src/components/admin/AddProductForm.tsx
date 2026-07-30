"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ImageUploader from "./ImageUploader";
import { Loader2, PlusCircle, CheckCircle, Tag, Layers, X } from "lucide-react";

const CATEGORIES = [
  "Smartphones & Tablets",
  "Laptops & Computers",
  "Gaming Consoles",
  "Audio & Headphones",
  "Smart Wearables",
  "Accessories",
];

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductForm({ isOpen, onClose }: AddProductFormProps) {
  // Basic Details
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // Product Flags / Badges
  const [isHotDeal, setIsHotDeal] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Dynamic Product Variants
  const [storageInput, setStorageInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (images.length === 0) {
      setError("Please upload at least one image for the product.");
      return;
    }

    setLoading(true);

    try {
      const parsedPrice = parseFloat(price);
      const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null;

      const storageOptions = storageInput
        ? storageInput.split(",").map((item) => item.trim()).filter(Boolean)
        : [];
      
      const colorOptions = colorInput
        ? colorInput.split(",").map((item) => item.trim()).filter(Boolean)
        : [];

      await addDoc(collection(db, "products"), {
        name,
        brand,
        description,
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        category,
        stock: parseInt(stock, 10),
        images,
        isHotDeal,
        isFeatured,
        storageOptions,
        colorOptions,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);

      // Reset Form State
      setName("");
      setBrand("");
      setDescription("");
      setPrice("");
      setOriginalPrice("");
      setCategory(CATEGORIES[0]);
      setStock("");
      setImages([]);
      setIsHotDeal(false);
      setIsFeatured(false);
      setStorageInput("");
      setColorInput("");

      // Auto close after 1.5s on success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill in the details to list a new gadget with full variant options.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-100 font-medium flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Product published successfully! Closing...</span>
            </div>
          )}

          {/* Image Uploader */}
          <ImageUploader images={images} onChange={setImages} />

          {/* Title & Brand Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 14 Pro Max"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Brand
              </label>
              <input
                type="text"
                placeholder="e.g. Apple, Samsung"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Selling Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                placeholder="1250000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Original Price (₦) <span className="text-gray-400 font-normal">(For Discount)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="1400000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Category & Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-primary transition-all bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stock Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Variants Section: Storage & Colors */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Layers size={14} className="text-primary" /> Product Variants (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-600">
                  Storage Sizes (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="128GB, 256GB, 512GB, 1TB"
                  value={storageInput}
                  onChange={(e) => setStorageInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-600">
                  Color Names (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Deep Purple, Space Black, Gold, Silver"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Badges & Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={isHotDeal}
                onChange={(e) => setIsHotDeal(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              />
              <span className="flex items-center gap-1 text-orange-600">
                <Tag size={13} /> Mark as &quot;Hot Deal&quot; Badge
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              />
              <span>Mark as Featured</span>
            </label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide product specifications and key highlights..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <PlusCircle size={16} />
              )}
              <span>Publish Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}