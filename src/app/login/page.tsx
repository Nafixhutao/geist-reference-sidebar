import type { Metadata } from "next";
import "@fontsource-variable/inter";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return <LoginForm />;
}
