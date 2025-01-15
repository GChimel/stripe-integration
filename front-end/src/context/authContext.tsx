import { createContext, useCallback, useLayoutEffect, useState } from "react";
import { storageKeys } from "../config/storageKeys";
import { AuthService } from "../services/authService";
import { httpClient } from "../services/httpClient";

interface IAuthContextValue {
  signedIn: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(() => {
    return !!localStorage.getItem(storageKeys.token);
  });

  useLayoutEffect(() => {
    console.log("Add request interceptor");

    const interceptorId = httpClient.interceptors.request.use((config) => {
      const token = localStorage.getItem(storageKeys.token);

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return config;
    });

    return () => {
      httpClient.interceptors.request.eject(interceptorId);
    };
  }, []);

  useLayoutEffect(() => {
    console.log("Add response interceptor");

    const interceptorId = httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem(storageKeys.refreshToken);

        if (originalRequest.url === "/session/refresh") {
          setSignedIn(false);
          localStorage.clear();
          return Promise.reject(error);
        }

        if (error.response?.status !== 401 || !refreshToken) {
          return Promise.reject(error);
        }

        const { token, refreshToken: newRefreshToken } =
          await AuthService.refreshToken(refreshToken);

        localStorage.setItem(storageKeys.token, token);
        localStorage.setItem(storageKeys.refreshToken, newRefreshToken);

        return httpClient(originalRequest);
      }
    );

    return () => {
      httpClient.interceptors.response.eject(interceptorId);
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token, refreshToken } = await AuthService.signIn({
      email,
      password,
    });

    localStorage.setItem(storageKeys.token, token);
    localStorage.setItem(storageKeys.refreshToken, refreshToken);

    setSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    localStorage.clear();
    setSignedIn(false);
  }, []);

  const value: IAuthContextValue = {
    signedIn,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
