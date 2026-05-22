import type { Metadata } from "next";
import { AuthPage } from "../../components/auth-page";

export const metadata: Metadata = {
  title: "Sign in | Aaplio",
  description: "Sign in to your Aaplio job tracker workspace.",
};

export default function SignInPage() {
  return <AuthPage mode="sign-in" />;
}
