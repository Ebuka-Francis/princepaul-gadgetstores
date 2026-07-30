"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  GitCompareArrows,
  X,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import Container from "@/components/layout/Container";
import { navigation } from "@/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary sm:bg-white border-b border-gray-100">
        <Container>
          <div className="flex h-16 lg:h-20 items-center justify-between gap-3 lg:gap-5 min-w-0">
            
            {/* Left Side: Mobile Menu Button + Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-white sm:text-gray-700 hover:text-primary transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <Link 
                href="/" 
                className="shrink-0 flex items-center bg-white rounded-lg p-1.5 lg:bg-transparent lg:p-0 transition-all"
              >
                <Image
                  src="/princepaulogo.png"
                  alt="PrincePaul"
                  width={60}
                  height={55}
                  priority
                  className="w-auto h-9 lg:h-12 object-contain"
                />
              </Link>
            </div>

            {/* Categories Button (Desktop Only) */}
            <button className="hidden lg:flex shrink-0 h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm text-white font-medium hover:bg-primary/90 transition-colors">
              <Menu size={16} />
              <span>Categories</span>
              <ChevronDown size={14} />
            </button>

            {/* Navigation Links (Desktop Only) */}
            <nav className="hidden lg:flex items-center gap-6 overflow-x-auto no-scrollbar py-2 shrink min-w-0">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-[13px] font-semibold whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                      isActive
                        ? "text-primary border-primary"
                        : "text-foreground border-transparent hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex h-10 flex-1 max-w-[320px] shrink-0 overflow-hidden rounded-lg border border-gray-200 focus-within:border-primary transition-colors">
              <input
                className="w-full px-3 text-xs outline-none"
                placeholder="Search for products, brands..."
              />
              <button className="w-10 bg-primary flex items-center justify-center text-white shrink-0 hover:bg-primary/90 transition-colors">
                <Search size={16} />
              </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center justify-end gap-3 lg:gap-5 shrink-0">
              {/* Desktop Only Actions */}
              <div className="hidden lg:flex items-center gap-5">
                <NavIcon icon={<GitCompareArrows size={18} />} text="Compare" />
                <NavIcon icon={<Heart size={18} />} text="Wishlist" badge={0} />
              </div>

              {/* Cart Icon (Visible on Both Mobile & Desktop) */}
              <Link href="/cart" className="relative p-1 text-white sm:text-gray-800 hover:text-primary transition-colors">
                <ShoppingCart size={22} className="lg:w-[18px] lg:h-[18px]" />
                <span className="absolute -right-1.5 -top-1 lg:-right-2 lg:-top-1.5 flex h-4 w-4 lg:h-3.5 lg:w-3.5 items-center justify-center rounded-full bg-primary text-[10px] lg:text-[9px] font-bold text-white">
                  2
                </span>
                <span className="hidden lg:block text-[11px] font-medium text-center mt-1 text-foreground">
                  Cart
                </span>
              </Link>

              {/* Desktop Account / Auth Button */}
              {user ? (
                <Link
                  href="/profile"
                  className="hidden lg:flex relative flex-col items-center text-[11px] cursor-pointer leading-tight text-foreground hover:text-primary transition-colors shrink-0"
                >
                  <User size={18} />
                  <span className="mt-1 font-medium truncate max-w-[70px]">
                    {user.displayName || "Account"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Profile</span>
                </Link>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="hidden lg:flex relative flex-col items-center text-[11px] cursor-pointer leading-tight text-foreground hover:text-primary transition-colors shrink-0"
                >
                  <User size={18} />
                  <span className="mt-1 font-medium">Account</span>
                  <span className="text-[10px] text-primary font-semibold">Sign In</span>
                </button>
              )}
            </div>

          </div>
        </Container>
      </header>

      {/* Mobile Navigation Drawer / Slide-out Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-[280px] h-full bg-white p-5 flex flex-col justify-between shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-bold text-gray-900">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-gray-700 hover:text-primary py-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Bottom Links & Auth Controls */}
            <div className="border-t pt-4 flex flex-col gap-3 text-sm">
              <Link 
                href="/wishlist" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-700 font-medium hover:text-primary"
              >
                <Heart size={18} />
                Wishlist
              </Link>

              {user ? (
                <>
                  <Link 
                    href="/account" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 font-medium hover:text-primary"
                  >
                    <User size={18} />
                    My Profile ({user.displayName || "Account"})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 font-medium pt-2 border-t"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-xs shadow-sm hover:bg-primary/90 transition-all"
                >
                  <LogIn size={16} />
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavIcon({
  icon,
  text,
  badge,
}: {
  icon: React.ReactNode;
  text: string;
  badge?: number;
}) {
  return (
    <div className="relative flex flex-col items-center text-[11px] cursor-pointer text-foreground hover:text-primary transition-colors shrink-0">
      <div className="relative">
        {icon}
        {badge !== undefined && (
          <span className="absolute -right-2 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
            {badge}
          </span>
        )}
      </div>
      <span className="mt-1 font-medium hidden sm:inline">{text}</span>
    </div>
  );
}