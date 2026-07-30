"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Loader2, ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary credentials missing in .env.local!");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("Failed to upload image. Please check your Cloudinary configuration.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(images.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Product Images
      </label>

      {/* Grid Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((url, idx) => (
          <div
            key={url + idx}
            className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs"
          >
            <Image
              src={url}
              alt={`Product preview ${idx + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Upload Box Trigger */}
        <label className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary bg-gray-50 hover:bg-gray-100/50 flex flex-col items-center justify-center cursor-pointer transition-all">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 p-2 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-[11px] font-medium text-gray-600">
                Uploading...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 p-2 text-center text-gray-500 hover:text-primary">
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs font-semibold">Add Images</span>
              <span className="text-[10px] text-gray-400">PNG, JPG via Cloudinary</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}