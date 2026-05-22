import type { Metadata } from "next";
import { AuthPage } from "../../components/auth-page";

export const metadata: Metadata = {
  title: "Sign in | Trackdesk",
  description: "Sign in to your Trackdesk job tracker workspace.",
};

export default function SignInPage() {
  return <AuthPage mode="sign-in" />;
}
