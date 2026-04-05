import type { Metadata } from "next";
import { StudioApp } from "@/components/studio-app";

export const metadata: Metadata = {
  title: "QR code generator studio",
  description:
    "Generate QR codes for links, Wi‑Fi, contacts, phone, SMS, and email. Adjust size, error correction, colours, download or copy.",
};

export default function StudioPage() {
  return <StudioApp />;
}
