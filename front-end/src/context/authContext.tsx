import { createContext, useCallback, useState } from "react";
import { AuthService } from "../services/authService";

interface IAuthContextValue {
  signedIn: boolean;
  signIn(email: string, password: string): Promise<void>;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await AuthService.signIn({ email, password });

    localStorage.setItem("accessToken", response.token);

    setSignedIn(true);
  }, []);

  const value: IAuthContextValue = {
    signedIn,
    signIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
