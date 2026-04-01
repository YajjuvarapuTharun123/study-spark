import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import KiraAgent from "@/components/kira/KiraAgent";
import { useNavigate } from "react-router-dom";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <KiraAgent
        studentName="Alex"
        grade="8th Grade"
        streak={7}
        onCreateExam={() => navigate("/study-hub/exam")}
        onNavigate={(path) => navigate(path)}
      />
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
