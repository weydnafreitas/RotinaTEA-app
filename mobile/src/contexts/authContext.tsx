import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "@/services/api";
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "@/types/auth";

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(credentials: LoginCredentials): Promise<void>;
  signUp(data: RegisterData): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await AsyncStorage.getItem("@RotinaTEA:user");
        const storedToken = await AsyncStorage.getItem("@RotinaTEA:token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Erro ao carregar dados do storage:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  async function signIn({ email, password }: LoginCredentials) {
    try {
      const response = await api.post<AuthResponse>("/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      setUser(user);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await AsyncStorage.setItem("@RotinaTEA:user", JSON.stringify(user));
      await AsyncStorage.setItem("@RotinaTEA:token", token);

      router.replace("/");
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao fazer login";
      throw new Error(message);
    }
  }

  async function signUp(data: RegisterData) {
    try {
      await api.post("/register", data);

      // Após registrar, faz login automaticamente
      await signIn({ email: data.email, password: data.password });
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao criar conta";
      throw new Error(message);
    }
  }

  async function signOut() {
    try {
      setUser(null);

      await AsyncStorage.removeItem("@RotinaTEA:user");
      await AsyncStorage.removeItem("@RotinaTEA:token");

      delete api.defaults.headers.common["Authorization"];

      router.replace("/signIn");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
