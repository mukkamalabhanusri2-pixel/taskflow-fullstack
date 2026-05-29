import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // INIT AUTH (safe + debug-friendly)
  // ============================================================
  useEffect(() => {
    let isMounted = true;

    const token = localStorage.getItem("taskflow_token");
    const savedUser = localStorage.getItem("taskflow_user");

    if (!token) {
      setLoading(false);
      return;
    }

    if (savedUser) {
      try {
        if (isMounted) {
          setUser(JSON.parse(savedUser));
        }
      } catch {
        localStorage.removeItem("taskflow_user");
      }
    }

    authAPI
      .getMe()
      .then(({ data }) => {
        if (isMounted) {
          setUser(data.user);

          localStorage.setItem(
            "taskflow_user",
            JSON.stringify(data.user)
          );
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.log("GET ME FAILED:", err);

          setUser(null);
          localStorage.removeItem("taskflow_user");
          localStorage.removeItem("taskflow_token");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================================
  // REGISTER
  // ============================================================
  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData);

    console.log("REGISTER RESPONSE:", data);

    if (!data?.token) {
      throw new Error("Token missing from register response");
    }

    localStorage.setItem("taskflow_token", data.token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));

    setUser(data.user);

    toast.success(`Welcome ${data.user.name}! 🎉`);

    return data;
  }, []);

  // ============================================================
  // LOGIN (DEBUG SAFE)
  // ============================================================
  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials);

    console.log("LOGIN RESPONSE:", data);

    // 🔥 CRITICAL CHECK
    const token = data?.token;

    if (!token) {
      console.error("❌ No token received from backend:", data);
      throw new Error("Login failed: token missing");
    }

    localStorage.setItem("taskflow_token", token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));

    setUser(data.user);

    toast.success(`Welcome back, ${data.user.name}!`);

    return data;
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = useCallback(() => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");

    setUser(null);

    toast.success("Logged out successfully");
  }, []);

  // ============================================================
  // UPDATE USER
  // ============================================================
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "taskflow_user",
      JSON.stringify(updatedUser)
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// HOOK
// ============================================================
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};