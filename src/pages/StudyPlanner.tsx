import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const weekPlan = [
  { day: "Monday", tasks: [{ subject: "Math", topic: "Algebra Equations", done: true }, { subject: "English", topic: "Essay Writing", done: true }] },
  { day: "Tuesday", tasks: [{ subject: "Science", topic: "Cell Biology", done: true }, { subject: "History", topic: "Ancient Civilizations", done: false }] },
  { day: "Wednesday", tasks: [{ subject: "Math", topic: "Geometry Basics", done: false }, { subject: "Art", topic: "Color Theory", done: false }] },
  { day: "Thursday", tasks: [{ subject: "English", topic: "Grammar Rules", done: false }, { subject: "Science", topic: "Chemical Reactions", done: false }] },
  { day: "Friday", tasks: [{ subject: "Geography", topic: "World Maps", done: false }, { subject: "Math", topic: "Statistics", done: false }] },
];

const subjectColors: Record<string, string> = {
  Math: "bg-subject-math",
  Science: "bg-subject-science",
  English: "bg-subject-english",
  History: "bg-subject-history",
  Geography: "bg-subject-geography",
  Art: "bg-subject-art",
};

const StudyPlanner = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(weekPlan);

  const toggle = (dayIdx: number, taskIdx: number) => {
    const copy = [...plan];
    copy[dayIdx] = { ...copy[dayIdx], tasks: copy[dayIdx].tasks.map((t, i) => i === taskIdx ? { ...t, done: !t.done } : t) };
    setPlan(copy);
  };

  return (
    <AppLayout>
      <div className="px-5 pt-12 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <h1 className="text-xl font-extrabold text-foreground">Weekly Plan</h1>
        </div>

        {plan.map((day, dayIdx) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * dayIdx }}
            className="glass-card rounded-2xl p-4"
          >
            <h3 className="text-sm font-bold text-foreground mb-3">{day.day}</h3>
            <div className="space-y-2">
              {day.tasks.map((task, taskIdx) => (
                <motion.button
                  key={taskIdx}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggle(dayIdx, taskIdx)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 text-left"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${task.done ? "gradient-primary" : "border border-border"}`}>
                    {task.done && <Check size={14} className="text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.topic}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${subjectColors[task.subject] || "bg-primary"}`} />
                      <span className="text-[10px] text-muted-foreground">{task.subject}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
};

export default StudyPlanner;
