import { motion } from "framer-motion";
import { Trophy, Zap, BookOpen, Target, Star } from "lucide-react";

const badges = [
  { icon: Trophy, label: "First Win", earned: true, color: "bg-warning/15 text-warning" },
  { icon: Zap, label: "Speed Star", earned: true, color: "bg-streak/15 text-streak" },
  { icon: BookOpen, label: "Bookworm", earned: true, color: "bg-primary/15 text-primary" },
  { icon: Target, label: "Bullseye", earned: false, color: "bg-muted text-muted-foreground" },
  { icon: Star, label: "All Star", earned: false, color: "bg-muted text-muted-foreground" },
];

const Achievements = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="glass-card rounded-2xl p-5"
  >
    <h3 className="text-sm font-bold text-foreground mb-4">Recent Achievements</h3>
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i, type: "spring" }}
          className={`flex flex-col items-center gap-1.5 min-w-[60px] ${!badge.earned && "opacity-40"}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${badge.color}`}>
            <badge.icon size={20} />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground text-center">{badge.label}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default Achievements;
