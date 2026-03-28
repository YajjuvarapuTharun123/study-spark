import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Calculator, FlaskConical, BookText, Landmark, Globe, Palette, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const subjectIcons: Record<string, LucideIcon> = {
  Math: Calculator, Science: FlaskConical, English: BookText,
  History: Landmark, Geography: Globe, Art: Palette,
};

const subjectGradients: Record<string, string> = {
  Math: "gradient-primary", Science: "gradient-accent", English: "bg-subject-english",
  History: "gradient-warm", Geography: "bg-subject-geography", Art: "bg-subject-art",
};

const weekPlan = [
  { day: "Monday", short: "Mon", tasks: [{ subject: "Math", topic: "Algebra Equations", done: true }, { subject: "English", topic: "Essay Writing", done: true }] },
  { day: "Tuesday", short: "Tue", tasks: [{ subject: "Science", topic: "Cell Biology", done: true }, { subject: "History", topic: "Ancient Civilizations", done: false }] },
  { day: "Wednesday", short: "Wed", tasks: [{ subject: "Math", topic: "Geometry Basics", done: false }, { subject: "Art", topic: "Color Theory", done: false }] },
  { day: "Thursday", short: "Thu", tasks: [{ subject: "English", topic: "Grammar Rules", done: false }, { subject: "Science", topic: "Chemical Reactions", done: false }] },
  { day: "Friday", short: "Fri", tasks: [{ subject: "Geography", topic: "World Maps", done: false }, { subject: "Math", topic: "Statistics", done: false }] },
  { day: "Saturday", short: "Sat", tasks: [{ subject: "History", topic: "World Wars", done: false }, { subject: "Art", topic: "Sketching", done: false }] },
  { day: "Sunday", short: "Sun", tasks: [{ subject: "Science", topic: "Electricity", done: false }, { subject: "English", topic: "Poetry Analysis", done: false }] },
];

const DayCard = ({ day, isSelected, onClick, tasksComplete }: { day: typeof weekPlan[0]; isSelected: boolean; onClick: () => void; tasksComplete: number }) => {
  const total = day.tasks.length;
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`relative flex flex-col items-center min-w-[56px] py-3 px-2 rounded-2xl transition-all ${
        isSelected ? "gradient-primary shadow-glow" : "bg-secondary"
      }`}
    >
      <span className={`text-[10px] font-semibold ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {day.short}
      </span>
      <span className={`text-lg font-extrabold mt-0.5 ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
        {day.day.slice(0, 2)}
      </span>
      {tasksComplete === total && total > 0 && (
        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? "bg-primary-foreground" : "bg-success"}`} />
      )}
      {tasksComplete > 0 && tasksComplete < total && (
        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? "bg-primary-foreground/50" : "bg-warning"}`} />
      )}
    </motion.button>
  );
};

const SubjectFlipCard = ({ subject, topic, done, onToggle, index }: {
  subject: string; topic: string; done: boolean; onToggle: () => void; index: number;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = subjectIcons[subject] || BookText;
  const gradient = subjectGradients[subject] || "gradient-primary";

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90, x: 40 }}
      animate={{ opacity: 1, rotateY: 0, x: 0 }}
      exit={{ opacity: 0, rotateY: 90, x: -40 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 20 }}
      className="perspective w-full"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full h-40 preserve-3d cursor-pointer"
      >
        {/* Front */}
        <div className={`absolute inset-0 backface-hidden rounded-2xl p-5 flex flex-col justify-between shadow-elevated ${gradient}`}>
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Icon size={22} className="text-primary-foreground" />
            </div>
            {done && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-7 h-7 rounded-full bg-primary-foreground/30 flex items-center justify-center"
              >
                <Check size={14} className="text-primary-foreground" />
              </motion.div>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-primary-foreground">{subject}</h3>
            <p className="text-xs text-primary-foreground/70 mt-0.5">{topic}</p>
          </div>
          <div className="absolute bottom-3 right-4 text-primary-foreground/20 text-[9px] font-semibold tracking-wider">
            TAP TO FLIP
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-5 bg-card border border-border shadow-elevated flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground">{topic}</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Study session for {subject}. Tap the button below to mark as complete.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onToggle(); setIsFlipped(false); }}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
              done
                ? "bg-success/10 text-success"
                : "gradient-primary text-primary-foreground shadow-glow"
            }`}
          >
            {done ? "✓ Completed" : "Mark Complete"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StudyPlanner = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);
  const [plan, setPlan] = useState(weekPlan);

  const toggle = (taskIdx: number) => {
    const copy = [...plan];
    copy[selectedDay] = {
      ...copy[selectedDay],
      tasks: copy[selectedDay].tasks.map((t, i) => i === taskIdx ? { ...t, done: !t.done } : t),
    };
    setPlan(copy);
  };

  const currentDay = plan[selectedDay];

  return (
    <AppLayout>
      <div className="px-5 pt-12 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Study Planner</h1>
            <p className="text-xs text-muted-foreground">Your weekly schedule</p>
          </div>
        </div>

        {/* Week day selector - horizontal scroll flash cards */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {plan.map((day, i) => (
            <DayCard
              key={day.day}
              day={day}
              isSelected={selectedDay === i}
              onClick={() => setSelectedDay(i)}
              tasksComplete={day.tasks.filter((t) => t.done).length}
            />
          ))}
        </div>

        {/* Selected day header */}
        <motion.div key={selectedDay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{currentDay.day}</h2>
          <span className="text-xs text-muted-foreground font-medium">
            {currentDay.tasks.filter((t) => t.done).length}/{currentDay.tasks.length} done
          </span>
        </motion.div>

        {/* Subject flip cards */}
        <div className="space-y-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div key={selectedDay} className="space-y-4">
              {currentDay.tasks.map((task, i) => (
                <SubjectFlipCard
                  key={`${selectedDay}-${i}`}
                  subject={task.subject}
                  topic={task.topic}
                  done={task.done}
                  onToggle={() => toggle(i)}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudyPlanner;
