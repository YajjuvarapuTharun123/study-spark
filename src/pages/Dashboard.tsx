import AppLayout from "@/components/layout/AppLayout";
import StreakCard from "@/components/dashboard/StreakCard";
import QuickActions from "@/components/dashboard/QuickActions";
import ActivityChart from "@/components/dashboard/ActivityChart";
import Achievements from "@/components/dashboard/Achievements";
import { motion } from "framer-motion";

const Dashboard = () => (
  <AppLayout>
    <div className="px-5 pt-12 space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">Good morning 👋</p>
          <h1 className="text-2xl font-extrabold text-foreground">Alex</h1>
        </div>
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
          A
        </div>
      </motion.div>
      <StreakCard />
      <QuickActions />
      <ActivityChart />
      <Achievements />
    </div>
  </AppLayout>
);

export default Dashboard;
