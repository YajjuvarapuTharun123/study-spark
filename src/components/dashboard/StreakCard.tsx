import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const StreakCard = () => {
  const streak = 12;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const completed = [true, true, true, true, true, false, false];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-primary rounded-2xl p-5 text-primary-foreground shadow-glow"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-80 font-medium">Current Streak</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-4xl font-extrabold">{streak}</span>
            <span className="text-sm opacity-80">days</span>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center"
        >
          <Flame size={28} className="text-primary-foreground" />
        </motion.div>
      </div>
      <div className="flex justify-between">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                completed[i]
                  ? "bg-primary-foreground text-primary"
                  : "bg-primary-foreground/20 text-primary-foreground/60"
              }`}
            >
              {completed[i] ? "✓" : d}
            </div>
            <span className="text-[10px] opacity-60">{d}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StreakCard;
