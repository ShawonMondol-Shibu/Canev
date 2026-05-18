import { ReactNode } from "react";
import AuthBackground3D from "@/components/auth-background-3d";

function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-background/10">
      <AuthBackground3D />
      {children}
    </main>
  );
}

export default Layout;