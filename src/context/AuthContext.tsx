"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  async function loadAdminStatus(uid: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      setIsAdmin(
        userDoc.exists() &&
        userDoc.data()?.role === "admin"
      );
    } catch (error) {
      console.error("Admin check failed:", error);
      setIsAdmin(false);
    }
  }

  // Handle redirect result properly on mount and ensure loading stays true until resolved
  useEffect(() => {
    let isMounted = true;

    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user && isMounted) {
          setUser(result.user);
          loadAdminStatus(result.user.uid);
        }
      } catch (error) {
        console.error("Redirect sign-in error:", error);
      }
    };

    handleRedirect();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          loadAdminStatus(currentUser.uid);
        } else {
          setIsAdmin(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const logout = () => signOut(auth);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    try {
      if (isMobile) {
        // This will redirect the page away, saving session state in IndexedDB/LocalStorage
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
        closeAuthModal();
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === "auth/popup-closed-by-user") {
        console.log("The sign-in popup was closed before completing.");
      } else {
        console.error("Google Auth Error:", err.message || err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);