"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Send,
  ShieldCheck,
  LogOut,
  LogIn,
  LayoutDashboard,
  X,
  Lock,
  User as UserIcon,
  Loader2,
  PlusCircle,
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  const { user, isAdmin, logout, loginWithGoogle, openAuthModal } = useAuth();

  // Auth Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Email/Password Login & Signup
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (res.user && name) {
          await updateProfile(res.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setIsAuthModalOpen(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace("Firebase: ", ""));
      } else {
        setError("An error occurred during authentication.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in with Google.");
      }
    }
  };

  return (
    <footer className="w-full bg-primary text-slate-300 relative overflow-hidden border-t border-slate-800">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* --- Main Footer Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand Info & Newsletter */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2">
                {/* <div className="bg-white p-1.5 rounded-xl"> */}
                  <Image
                    src="/princepaullogowhite-r.png"
                    alt="PrincePaul"
                    width={70}
                    height={70}
                    className="w-auto h-auto object-contain"
                  />
                {/* </div> */}
                {/* <span className="text-xl font-extrabold text-white tracking-tight">
                  Prince<span className="text-blue-500">Paul</span>
                </span> */}
              </Link>

              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                Your ultimate destination for 100% authentic gadgets, smartphones, 
                gaming consoles, and premium tech accessories nationwide.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-6 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Subscribe for exclusive tech deals
              </h4>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 shadow-md shadow-blue-900/30"
                >
                  <span className="hidden sm:inline">Join</span>
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Shop Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { label: "Smartphones & Tablets", href: "/categories/smartphones" },
                { label: "Laptops & Computers", href: "/categories/laptops" },
                { label: "Gaming Consoles", href: "/categories/gaming" },
                { label: "Audio & Headphones", href: "/categories/accessories" },
                { label: "Smart Wearables", href: "/categories/smart-gadgets" },
                { label: "Flash Deals & Offers", href: "/deals" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { label: "Help Center & FAQs", href: "/help" },
                { label: "Track Your Order", href: "/track-order" },
                { label: "Return & Refund Policy", href: "/return-policy" },
                { label: "Warranty Policy", href: "/warranty-policy" },
                { label: "Shipping & Delivery", href: "/shipping-delivery" },
                { label: "Contact Us", href: "/contact-us" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Get in Touch
            </h3>
            
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>123 Tech Hub Avenue, Ikeja, Lagos State, Nigeria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <a href="tel:+2348000000000" className="hover:text-blue-400">
                  +234 800 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a href="mailto:support@princepaul.com" className="hover:text-blue-400">
                  support@princepaul.com
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-2">
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Follow Us
              </h4>
              <div className="flex items-center gap-2">
                {[
                  { icon: FaTiktok, href:"https://www.tiktok.com/@pp_tech0" },
                  { icon: FaInstagram, href: "https://www.instagram.com/pp_tech_ng/" },
                  { icon: FaFacebookF, href: "https://web.facebook.com/profile.php?id=100064082623693" },
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200"
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* --- Bottom Footer Bar --- */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          {/* Copyright & Legal Links */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {new Date().getFullYear()} PrincePaul Tech. All rights reserved.</span>
            
            <div className="flex items-center gap-3 font-medium text-slate-400">
              <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms-conditions" className="hover:text-blue-400 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Dynamic Auth / Admin / Scroll to Top Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Admin Quick Action Button */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-bold text-[11px] transition-all"
                  >
                    <PlusCircle size={13} />
                    <span>Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-semibold text-[11px] transition-all"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all shadow-sm"
              >
                <LogIn size={13} />
                <span>Login / Register</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Encrypted</span>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-sm active:scale-95"
            >
              <ArrowUp size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* --- INLINE AUTH MODAL --- */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 text-slate-900">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 relative shadow-2xl border border-slate-100 dark:border-slate-800 transition-all">
            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isSignUp
                  ? "Sign up to track orders and save your favorite gadgets"
                  : "Log in to your account to continue shopping"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 text-center font-medium">
                {error}
              </div>
            )}

            {/* 1-Click Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2.5 transition-all mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-medium uppercase">
                or email
              </span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {isSignUp && (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 active:scale-98 disabled:opacity-50"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>

            {/* Footer Toggle */}
            <div className="mt-5 text-center text-xs text-slate-500">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-500 font-bold hover:underline ml-1"
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}