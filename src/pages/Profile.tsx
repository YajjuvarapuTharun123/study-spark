import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Settings, BookOpen, Trophy, Clock, ChevronRight, LogOut } from "lucide-react";

const stats = [
  { label: "Study Hours", value: "48h", icon: Clock, color: "gradient-primary" },
  { label: "Completed", value: "156", icon: BookOpen, color: "gradient-accent" },
  { label: "Badges", value: "12", icon: Trophy, color: "gradient-warm" },
];

const menuItems = [
  { label: "Edit Profile", icon: Settings },
  { label: "Study History", icon: Clock },
  { label: "Achievements", icon: Trophy },
  { label: "Logout", icon: LogOut },
];

const Profile = () => (
  <AppLayout>
    <div className="px-5 pt-12 space-y-6">
      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center text-2xl font-extrabold text-primary-foreground shadow-glow">
          A
        </div>
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-foreground">Alex Johnson</h1>
          <p className="text-sm text-muted-foreground">Grade 10 • Science Stream</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2"
          >
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold text-foreground">{s.value}</span>
            <span className="text-[10px] text-muted-foreground">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            whileTap={{ scale: 0.97 }}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 text-left"
          >
            <item.icon size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Profile;
