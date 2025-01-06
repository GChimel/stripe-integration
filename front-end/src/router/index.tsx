import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../pages/home";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { AuthGuard } from "./authGuard";

export function Router() {
  return (
    <Routes>
      <Route element={<AuthGuard isPrivate />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<AuthGuard isPrivate={false} />}>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
