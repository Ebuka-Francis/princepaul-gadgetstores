"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Search,
  Users,
  Loader2,
  PackageX,
  ShieldCheck,
  UserCheck,
  Mail,
  Calendar,
  Edit2,
  Trash2,
  X,
  Check,
} from "lucide-react";

export interface UserAccount {
  id: string;
  displayName?: string;
  email?: string;
  role?: "admin" | "customer";
  createdAt?: { seconds: number };
}

export default function AdminUsersTable() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Subscribe to real-time users collection
  useEffect(() => {
    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const items: UserAccount[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<UserAccount, "id">),
        }));

        items.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setUsers(items);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Toggle user role between Admin and Customer
  const handleRoleToggle = async (userId: string, currentRole?: string) => {
    setUpdatingId(userId);
    const nextRole = currentRole === "admin" ? "customer" : "admin";
    try {
      await updateDoc(doc(db, "users", userId), { role: nextRole });
    } catch (err) {
      console.error("Failed to update user role:", err);
      alert("Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setEditName(user.displayName || "");
    setEditEmail(user.email || "");
  };

  // Save User Edit Changes
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", editingUser.id), {
        displayName: editName.trim(),
        email: editEmail.trim(),
      });
      setEditingUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete User Document
  const handleDeleteUser = async (userId: string, userName?: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${userName || userId}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setUpdatingId(userId);
    try {
      await deleteDoc(doc(db, "users", userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user record.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium px-1">
          Showing <span className="text-white font-bold">{filteredUsers.length}</span> of{" "}
          <span className="text-white font-bold">{users.length}</span> users
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-blue-500" />
                    <span>Loading registered users...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageX size={32} className="text-slate-600" />
                    <span>{searchTerm ? "No matching users found." : "No accounts registered yet."}</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isAdmin = user.role === "admin";
                const joinedDate = user.createdAt?.seconds
                  ? new Date(user.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A";

                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* User Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold text-blue-400 text-xs shrink-0">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : <Users size={16} />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                            {user.displayName || "Anonymous User"}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-mono truncate">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-300 text-xs font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-500" />
                        <span>{user.email || "No email linked"}</span>
                      </div>
                    </td>

                    {/* Date Joined */}
                    <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-500" />
                        <span>{joinedDate}</span>
                      </div>
                    </td>

                    {/* Role Badge / Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        disabled={updatingId === user.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                          isAdmin
                            ? "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20"
                            : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20"
                        }`}
                        title="Click to toggle Admin privilege"
                      >
                        {isAdmin ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
                        {isAdmin ? "Admin" : "Customer"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {updatingId === user.id ? (
                        <Loader2 size={16} className="animate-spin text-blue-500 inline-block" />
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit User Button */}
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                            title="Edit User Details"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Delete User Button */}
                          <button
                            onClick={() => handleDeleteUser(user.id, user.displayName)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                            title="Delete User Account"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit User Account</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3.5 py-2 text-slate-400 hover:text-white text-xs font-semibold rounded-xl border border-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}