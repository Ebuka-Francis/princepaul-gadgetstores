"use client";

import { ShieldCheck, Truck, CreditCard, RotateCcw, MapPin } from "lucide-react";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa6";
import Container from "@/components/layout/Container";

export default function AnnouncementBar() {
  return (
<div className="hidden lg:flex h-9 bg-primary text-white text-[13px] font-semibold">
      <Container className="flex items-center justify-between">

        <div className="flex items-center gap-8">

          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>100% Authentic Products</span>
          </div>

          <div className="flex items-center gap-2">
            <Truck size={14} />
            <span>Fast Delivery Nationwide</span>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard size={14} />
            <span>Secure Payment</span>
          </div>

          <div className="flex items-center gap-2">
            <RotateCcw size={14} />
            <span>7 Days Easy Returns</span>
          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2 text-[12px]">
            <MapPin size={13} />
            <span>Store Location: 3 Babatola Close, Ikeja, Lagos</span>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-white/30">
            <a href="#" aria-label="Instagram" className="hover:text-white/80">
              <FaInstagram size={14} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-white/80">
              <FaFacebookF size={14} />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-white/80">
              <FaTiktok size={14} />
            </a>
          </div>

        </div>

      </Container>
    </div>
  );
}