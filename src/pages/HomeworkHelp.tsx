import AppLayout from "@/components/layout/AppLayout";
import SubjectFlipCard from "@/components/study/SubjectFlipCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calculator, FlaskConical, BookText, Landmark, Globe, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AskAI from "./AskAI";

const subjects = [
  { name: "Mathematics", icon: Calculator, color: "gradient-primary", topics: ["Algebra", "Geometry", "Statistics", "Calculus", "Trigonometry"] },
  { name: "Science", icon: FlaskConical, color: "gradient-accent", topics: ["Biology", "Chemistry", "Physics", "Earth Science"] },
  { name: "English", icon: BookText, color: "bg-subject-english", topics: ["Grammar", "Literature", "Writing", "Vocabulary"] },
  { name: "History", icon: Landmark, color: "gradient-warm", topics: ["Ancient", "Medieval", "Modern", "World Wars"] },
  { name: "Geography", icon: Globe, color: "bg-subject-geography", topics: ["Maps", "Climate", "Populations", "Landforms"] },
  { name: "Art", icon: Palette, color: "bg-subject-art", topics: ["Drawing", "Color Theory", "Art History", "Sculpture"] },
];

const HomeworkHelp = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (selectedSubject) {
    return <AskAI subjectFilter={selectedSubject} />;
  }

  return (
    <AppLayout>
      <div className="px-5 pt-12 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Homework Help</h1>
            <p className="text-xs text-muted-foreground">Tap a subject to get AI help</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {subjects.map((s, i) => (
              <SubjectFlipCard
                key={s.name}
                subject={s.name}
                icon={s.icon}
                color={s.color}
                topics={s.topics}
                delay={0.08 * i}
                onClick={() => setSelectedSubject(s.name)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomeworkHelp;
