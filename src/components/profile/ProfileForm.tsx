"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { UserProfile } from "@/types/user";
import { User, Phone, MapPin, Loader2, Save, CheckCircle2 } from "lucide-react";

export default function ProfileForm() {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    displayName: "",
    email: "",
    phoneNumber: "",
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setProfile({
            displayName: data.displayName || currentUser.displayName || "",
            email: currentUser.email || "",
            phoneNumber: data.phoneNumber || "",
            shippingAddress: {
              street: data.shippingAddress?.street || "",
              city: data.shippingAddress?.city || "",
              state: data.shippingAddress?.state || "",
              postalCode: data.shippingAddress?.postalCode || "",
              country: data.shippingAddress?.country || "Nigeria",
            },
          });
        } else {
          setProfile((prev) => ({
            ...prev,
            displayName: currentUser.displayName || "",
            email: currentUser.email || "",
          }));
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setSaving(true);
    setSuccessMsg(false);

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        displayName: profile.displayName,
        phoneNumber: profile.phoneNumber,
        shippingAddress: profile.shippingAddress,
      });

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
        <span>Loading account details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs sm:text-sm">
          <CheckCircle2 size={16} />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Personal Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <User size={16} className="text-blue-400" />
          Personal Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.displayName || ""}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              placeholder="e.g. Alex Johnson"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Email Address (Read Only)
            </label>
            <input
              type="email"
              value={profile.email || ""}
              disabled
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="tel"
                value={profile.phoneNumber || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phoneNumber: e.target.value })
                }
                placeholder="+234 800 000 0000"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-800/80" />

      {/* Shipping Address Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin size={16} className="text-blue-400" />
          Default Shipping Address
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={profile.shippingAddress?.street || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  shippingAddress: {
                    ...profile.shippingAddress!,
                    street: e.target.value,
                  },
                })
              }
              placeholder="123 Commerce Way, Suite 4B"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              City
            </label>
            <input
              type="text"
              value={profile.shippingAddress?.city || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  shippingAddress: {
                    ...profile.shippingAddress!,
                    city: e.target.value,
                  },
                })
              }
              placeholder="Lagos"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              State / Province
            </label>
            <input
              type="text"
              value={profile.shippingAddress?.state || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  shippingAddress: {
                    ...profile.shippingAddress!,
                    state: e.target.value,
                  },
                })
              }
              placeholder="Lagos State"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}