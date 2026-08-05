"use client";
import { useState } from "react";
import { Search, PackageCheck } from "lucide-react";

export default function TrackOrderPage() {
  const [refId, setRefId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId) return;
    setStatus("Processing / Packaging in our Lagos Hub");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-6 font-sans">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6 text-center">
        <PackageCheck size={48} className="mx-auto text-blue-700" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-xs text-gray-500 mt-1">Enter your order reference or tracking ID below.</p>
        </div>
        <form onSubmit={handleTrack} className="space-y-4 text-left">
          <input 
            type="text" 
            placeholder="e.g. 1722604800000" 
            value={refId}
            onChange={(e) => setRefId(e.target.value)}
            className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-700"
          />
          <button type="submit" className="w-full py-3 bg-blue-700 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-all">
            Track Status
          </button>
        </form>
        {status && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 font-semibold">
            Status: {status}
          </div>
        )}
      </div>
    </div>
  );
}