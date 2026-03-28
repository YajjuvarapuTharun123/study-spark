import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import AskAI from "./pages/AskAI";
import StudyHub from "./pages/StudyHub";
import StudyPlanner from "./pages/StudyPlanner";
import HomeworkHelp from "./pages/HomeworkHelp";
import ExamPrep from "./pages/ExamPrep";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/study-hub" element={<StudyHub />} />
          <Route path="/study-hub/planner" element={<StudyPlanner />} />
          <Route path="/study-hub/homework" element={<HomeworkHelp />} />
          <Route path="/study-hub/exam" element={<ExamPrep />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
