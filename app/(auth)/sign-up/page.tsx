import type { Metadata } from "next";
import { AuthPage } from "../../components/auth-page";

export const metadata: Metadata = {
  title: "Sign up | Aaplio",
  description: "Create a Aaplio account to manage your job search pipeline.",
};

export default function SignUpPage() {
  return <AuthPage mode="sign-up" />;
}
