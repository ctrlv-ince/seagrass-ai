import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export type UserRole = "admin" | "user";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setDemoRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for fallback simulated sessions when Supabase credentials aren't set
const DEMO_USER_KEY = "seagrass_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive role: binary admin vs user
  const role: UserRole = user?.user_metadata?.role === "admin" ? "admin" : "user";
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check for local demo user
      const stored = localStorage.getItem(DEMO_USER_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const rawRole = parsed.user_metadata?.role;
          const normalizedRole: UserRole = rawRole === "admin" ? "admin" : "user";
          parsed.user_metadata = { ...(parsed.user_metadata || {}), role: normalizedRole };
          setUser(parsed);
        } catch {
          localStorage.removeItem(DEMO_USER_KEY);
        }
      } else {
        // Auto-seed a default demo admin so the user can immediately test all features
        const defaultAdmin = {
          id: "demo-admin-01",
          email: "admin@seagrass.demo",
          user_metadata: { full_name: "Admin Demo User", role: "admin" },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(defaultAdmin);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultAdmin));
      }
      setLoading(false);
      return;
    }

    // Real Supabase session handler
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setDemoRole = (newRole: UserRole) => {
    if (user) {
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          role: newRole,
        },
      } as User;
      setUser(updatedUser);
      if (!isSupabaseConfigured) {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updatedUser));
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo authentication simulation
      const mockUser = {
        id: "demo-" + Date.now(),
        email,
        user_metadata: { full_name: email.split("@")[0], role: "admin" },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      // Demo registration simulation
      const mockUser = {
        id: "demo-" + Date.now(),
        email,
        user_metadata: { full_name: fullName, role: "user" },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "user",
        },
      },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: "demo-google-" + Date.now(),
        email: "demo.marine.scientist@ocean.org",
        user_metadata: { full_name: "Dr. Maya Lin (Demo)", role: "admin" },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      localStorage.removeItem(DEMO_USER_KEY);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isAdmin,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        setDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
