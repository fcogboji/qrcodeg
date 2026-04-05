import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a QR Brand Studio account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
