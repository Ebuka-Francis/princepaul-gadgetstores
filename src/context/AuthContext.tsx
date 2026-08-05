"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
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

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//     setUser(currentUser);

//     if (currentUser) {
//       try {
//         const userDocRef = doc(db, "users", currentUser.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists() && userDoc.data()?.role === "admin") {
//           setIsAdmin(true);
//         } else {
//           setIsAdmin(false);
//         }
//       } catch (err) {
//         console.warn("Could not fetch admin status (offline/network issue):", err);
//         setIsAdmin(false);
//       }
//     } else {
//       setIsAdmin(false);
//     }

//     setLoading(false);
//   });

//   return () => unsubscribe();
// }, []);

async function loadAdminStatus(uid: string) {
  try {
    console.log("Checking admin status...");
    const userDoc = await getDoc(doc(db, "users", uid));
    console.log("Checking admin status...");
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
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    if (currentUser) {
      loadAdminStatus(currentUser.uid);
    } else {
      setIsAdmin(false);
    }
  });

  return unsubscribe;
}, []);



  const logout = () => signOut(auth);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
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