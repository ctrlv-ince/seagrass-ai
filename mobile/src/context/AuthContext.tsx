import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = "seagrass_mobile_demo_user";

async function getStoredDemoUser(): Promise<User | null> {
  try {
    let stored: string | null = null;
    if (Platform.OS === "web") {
      stored = localStorage.getItem(DEMO_USER_KEY);
    } else {
      stored = await SecureStore.getItemAsync(DEMO_USER_KEY);
    }
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

async function setStoredDemoUser(user: User | null): Promise<void> {
  try {
    if (user === null) {
      if (Platform.OS === "web") {
        localStorage.removeItem(DEMO_USER_KEY);
      } else {
        await SecureStore.deleteItemAsync(DEMO_USER_KEY);
      }
    } else {
      const serialized = JSON.stringify(user);
      if (Platform.OS === "web") {
        localStorage.setItem(DEMO_USER_KEY, serialized);
      } else {
        await SecureStore.setItemAsync(DEMO_USER_KEY, serialized);
      }
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      getStoredDemoUser().then((stored) => {
        if (stored) {
          setUser(stored);
        }
        setLoading(false);
      });
      return;
    }

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

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: "demo-mobile-" + Date.now(),
        email,
        user_metadata: { full_name: email.split("@")[0] },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      await setStoredDemoUser(mockUser);
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
      const mockUser = {
        id: "demo-mobile-" + Date.now(),
        email,
        user_metadata: { full_name: fullName },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      await setStoredDemoUser(mockUser);
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: "demo-google-" + Date.now(),
        email: "alex@example.com",
        user_metadata: { full_name: "Alex Mercer" },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      await setStoredDemoUser(mockUser);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      await setStoredDemoUser(null);
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
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
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
