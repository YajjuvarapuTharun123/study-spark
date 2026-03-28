import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SubjectFlipCardProps {
  subject: string;
  icon: LucideIcon;
  color: string;
  topics: string[];
  delay?: number;
  onClick?: () => void;
}

const SubjectFlipCard = ({ subject, icon: Icon, color, topics, delay = 0, onClick }: SubjectFlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className="perspective cursor-pointer"
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          setIsFlipped(!isFlipped);
        }
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full h-44 preserve-3d"
      >
        {/* Front */}
        <div className={`absolute inset-0 backface-hidden rounded-2xl p-5 flex flex-col justify-between shadow-elevated ${color}`}>
          <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <Icon size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-foreground">{subject}</h3>
            <p className="text-xs text-primary-foreground/70 mt-0.5">{topics.length} topics</p>
          </div>
          <div className="absolute top-4 right-4 text-primary-foreground/30 text-[10px] font-medium">TAP TO FLIP</div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-5 bg-card border border-border shadow-elevated flex flex-col">
          <h4 className="text-sm font-bold text-foreground mb-3">{subject} Topics</h4>
          <div className="flex-1 space-y-1.5 overflow-hidden">
            {topics.slice(0, 4).map((topic) => (
              <div key={topic} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                <span className="text-xs text-muted-foreground">{topic}</span>
              </div>
            ))}
            {topics.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{topics.length - 4} more</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubjectFlipCard;
