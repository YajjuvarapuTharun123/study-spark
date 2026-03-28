import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background max-w-lg mx-auto relative">
    <main className="pb-20">{children}</main>
    <BottomNav />
  </div>
);

export default AppLayout;
