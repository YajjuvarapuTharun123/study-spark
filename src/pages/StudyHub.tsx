import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { CalendarDays, BookOpenCheck, ClipboardList, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sections = [
  { icon: CalendarDays, label: "Study Planner", desc: "Weekly study plans", gradient: "gradient-primary", path: "/study-hub/planner" },
  { icon: BookOpenCheck, label: "Homework Help", desc: "Get AI-powered help", gradient: "gradient-warm", path: "/study-hub/homework" },
  { icon: ClipboardList, label: "Exam Prep", desc: "Practice MCQs", gradient: "gradient-accent", path: "/study-hub/exam" },
];

const StudyHub = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <div className="px-5 pt-12 space-y-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-extrabold text-foreground">Study Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Your complete study toolkit</p>
        </motion.div>

        <div className="space-y-3">
          {sections.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(s.path)}
              className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 text-left"
            >
              <div className={`w-12 h-12 rounded-2xl ${s.gradient} flex items-center justify-center shadow-elevated`}>
                <s.icon size={22} className="text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">{s.label}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default StudyHub;
