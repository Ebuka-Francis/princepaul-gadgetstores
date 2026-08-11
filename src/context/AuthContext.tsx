"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function ensureUserDocument(user: User) {
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        displayName: user.displayName || "",
        email: user.email || "",
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to create/update user document:", error);
  }
}

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

  useEffect(() => {
    let isMounted = true;

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

    try {
      const result = await signInWithPopup(auth, provider);
      await ensureUserDocument(result.user);
      closeAuthModal();
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