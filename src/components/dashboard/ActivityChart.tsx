import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Math", value: 35, color: "hsl(246, 80%, 60%)" },
  { name: "Science", value: 25, color: "hsl(174, 72%, 46%)" },
  { name: "English", value: 20, color: "hsl(340, 75%, 55%)" },
  { name: "History", value: 20, color: "hsl(38, 92%, 58%)" },
];

const ActivityChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="glass-card rounded-2xl p-5"
  >
    <h3 className="text-sm font-bold text-foreground mb-4">Recent Activity</h3>
    <div className="flex items-center gap-4">
      <div className="w-28 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
            <span className="text-xs font-bold text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default ActivityChart;
