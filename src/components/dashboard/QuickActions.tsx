import { motion } from "framer-motion";
import { MessageSquare, CalendarDays, BookOpenCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  { icon: MessageSquare, label: "Ask AI", gradient: "gradient-primary", path: "/ask-ai" },
  { icon: CalendarDays, label: "Study Planner", gradient: "gradient-accent", path: "/study-hub/planner" },
  { icon: BookOpenCheck, label: "Homework Help", gradient: "gradient-warm", path: "/study-hub/homework" },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i, type: "spring", stiffness: 300 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate(action.path)}
          className={`${action.gradient} rounded-2xl p-4 flex flex-col items-center gap-2 shadow-elevated`}
        >
          <action.icon size={24} className="text-primary-foreground" />
          <span className="text-xs font-semibold text-primary-foreground">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
