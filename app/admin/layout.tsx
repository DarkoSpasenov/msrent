import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Admin MS Rent" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-paper">{children}</div>;
}
