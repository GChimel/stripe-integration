import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./screens/home";
import { SignIn } from "./screens/SignIn";
import { SignUp } from "./screens/SignUp";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<Navigate to='/' />} />
    </Routes>
  );
}
