"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Search,
  Trash2,
  Tag,
  Star,
  Loader2,
  PackageX,
  Pencil,
  X,
  Check,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  stock: number;
  images: string[];
  isHotDeal?: boolean;
  isFeatured?: boolean;
  createdAt?: { seconds: number };
}

export default function AdminProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingStockId, setTogglingStockId] = useState<string | null>(null);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Real-time Firestore Subscription
  useEffect(() => {
    const productsRef = collection(db, "products");

    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Product, "id">),
        }));

        items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setProducts(items);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Quick Stock Toggle (In Stock <-> Out of Stock)
  const handleToggleStock = async (product: Product) => {
    setTogglingStockId(product.id);
    const newStock = product.stock > 0 ? 0 : 1;

    try {
      await updateDoc(doc(db, "products", product.id), {
        stock: newStock,
      });
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert("Failed to update stock status.");
    } finally {
      setTogglingStockId(null);
    }
  };

  // Handle Product Deletion
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      brand: product.brand || "",
      price: product.price,
      originalPrice: product.originalPrice || null,
      category: product.category,
      stock: product.stock,
      isHotDeal: product.isHotDeal || false,
      isFeatured: product.isFeatured || false,
    });
  };

  // Save Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "products", editingProduct.id), {
        name: editFormData.name,
        brand: editFormData.brand || "",
        price: Number(editFormData.price),
        originalPrice: editFormData.originalPrice ? Number(editFormData.originalPrice) : null,
        category: editFormData.category,
        stock: Number(editFormData.stock),
        isHotDeal: Boolean(editFormData.isHotDeal),
        isFeatured: Boolean(editFormData.isFeatured),
      });

      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium px-1">
          Showing <span className="text-white font-bold">{filteredProducts.length}</span> of{" "}
          <span className="text-white font-bold">{products.length}</span> products
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock Status</th>
              <th className="py-3.5 px-4">Badges</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-blue-500" />
                    <span>Loading real-time product data...</span>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageX size={32} className="text-slate-600" />
                    <span>{searchTerm ? "No matching products found." : "No products listed yet."}</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const mainImage = product.images?.[0] || "/placeholder.png";
                const isOutOfStock = product.stock <= 0;

                return (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Product Name & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden shrink-0">
                          <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                            {product.name}
                          </h4>
                          {product.brand && (
                            <p className="text-[11px] text-slate-400 truncate">{product.brand}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-300 text-xs font-medium whitespace-nowrap">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-white text-xs sm:text-sm">
                        ₦{product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-[10px] text-slate-500 line-through">
                          ₦{product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Stock Status & Out-of-Stock Toggle */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <label
                          className="relative inline-flex items-center cursor-pointer"
                          title={isOutOfStock ? "Click to set In Stock" : "Click to set Out of Stock"}
                        >
                          <input
                            type="checkbox"
                            checked={!isOutOfStock}
                            disabled={togglingStockId === product.id}
                            onChange={() => handleToggleStock(product)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            !isOutOfStock
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              !isOutOfStock ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          {!isOutOfStock ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {product.isHotDeal && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-semibold">
                            <Tag size={10} /> Hot Deal
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                            <Star size={10} /> Featured
                          </span>
                        )}
                        {!product.isHotDeal && !product.isFeatured && (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all cursor-pointer"
                          title="Edit Product"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deletingId === product.id}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deletingId === product.id ? (
                            <Loader2 size={16} className="animate-spin text-red-400" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={editFormData.brand || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.category || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, category: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    value={editFormData.price || 0}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, price: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    value={editFormData.originalPrice || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        originalPrice: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={editFormData.stock ?? 0}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, stock: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={editFormData.isHotDeal || false}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, isHotDeal: e.target.checked })
                    }
                    className="rounded-md border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                  />
                  <span>Hot Deal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={editFormData.isFeatured || false}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, isFeatured: e.target.checked })
                    }
                    className="rounded-md border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}