import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, GraduationCap, FileText, Mic, MicOff } from "lucide-react";
import kiraAvatar from "@/assets/kira-avatar.png";

interface KiraAgentProps {
  studentName?: string;
  grade?: string;
  streak?: number;
  onCreateExam?: () => void;
  onNavigate?: (path: string) => void;
}

const KiraAgent = ({ studentName = "Alex", grade = "8th Grade", streak = 7, onCreateExam, onNavigate }: KiraAgentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [handWave, setHandWave] = useState(false);
  const recognitionRef = useRef<any>(null);
  const peekTimerRef = useRef<NodeJS.Timeout>();

  // Peek every 30 seconds
  useEffect(() => {
    const startPeekCycle = () => {
      peekTimerRef.current = setInterval(() => {
        if (!isVisible) {
          setIsPeeking(true);
          setHandWave(true);
          setTimeout(() => { setIsPeeking(false); setHandWave(false); }, 3000);
        }
      }, 30000);
    };
    // Initial peek after 5s
    const initial = setTimeout(() => {
      setIsPeeking(true);
      setHandWave(true);
      setTimeout(() => { setIsPeeking(false); setHandWave(false); }, 3000);
      startPeekCycle();
    }, 5000);
    return () => { clearTimeout(initial); clearInterval(peekTimerRef.current); };
  }, [isVisible]);

  // Voice recognition for "Hey Kira"
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        if (transcript.includes("hey kira") || transcript.includes("hi kira") || transcript.includes("hello kira")) {
          setIsVisible(true);
          setIsPeeking(false);
          setMessage(`Hi ${studentName}! 👋 How can I help you today?`);
          setIsSpeaking(true);
          setHandWave(true);
          setTimeout(() => { setIsSpeaking(false); setHandWave(false); }, 3000);
        }
      }
    };

    recognition.onerror = () => { setIsListening(false); };
    recognition.onend = () => {
      if (isListening) recognition.start();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [studentName, isListening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const showKira = () => {
    setIsVisible(true);
    setIsPeeking(false);
    setMessage(`Hi ${studentName}! 👋 I'm Kira, your study buddy!`);
    setIsSpeaking(true);
    setHandWave(true);
    setTimeout(() => { setIsSpeaking(false); setHandWave(false); }, 3000);
  };

  const actions = [
    { label: "My Stats", icon: Flame, action: () => { setMessage(`🔥 You're on a ${streak}-day streak, ${studentName}! ${grade} is going great!`); setIsSpeaking(true); setTimeout(() => setIsSpeaking(false), 2500); }},
    { label: "Create Exam", icon: FileText, action: () => { onCreateExam?.(); setMessage("Let's create a practice exam! 📝"); setIsSpeaking(true); setTimeout(() => setIsSpeaking(false), 2000); }},
    { label: "Study Hub", icon: GraduationCap, action: () => { onNavigate?.("/study-hub"); }},
  ];

  return (
    <>
      {/* Peek avatar from top-right */}
      <AnimatePresence>
        {isPeeking && !isVisible && (
          <motion.div
            initial={{ y: -80, x: 10 }}
            animate={{ y: -10, x: 10 }}
            exit={{ y: -80 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-0 right-4 z-50 cursor-pointer"
            onClick={showKira}
          >
            <motion.div
              animate={handWave ? { rotate: [0, 14, -8, 14, -4, 10, 0] } : {}}
              transition={{ duration: 1.5, repeat: handWave ? Infinity : 0 }}
            >
              <img src={kiraAvatar} alt="Kira" className="w-16 h-16 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic toggle button */}
      <button
        onClick={toggleListening}
        className={`fixed top-4 right-4 z-40 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
          isListening ? "bg-red-500 text-white animate-pulse" : "bg-secondary text-muted-foreground"
        } ${isPeeking || isVisible ? "opacity-0 pointer-events-none" : ""}`}
      >
        {isListening ? <Mic size={14} /> : <MicOff size={14} />}
      </button>

      {/* Full Kira sidebar panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 max-w-lg mx-auto"
          >
            <div className="bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.85)] rounded-b-3xl shadow-2xl px-5 pt-4 pb-6">
              {/* Close */}
              <button onClick={() => setIsVisible(false)} className="absolute top-3 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>

              {/* Avatar + Speech */}
              <div className="flex items-start gap-4">
                <motion.div
                  animate={handWave ? {
                    rotate: [0, 10, -5, 10, -5, 0],
                    y: [0, -3, 0, -3, 0],
                  } : {}}
                  transition={{ duration: 1.2, repeat: handWave ? 2 : 0 }}
                  className="relative flex-shrink-0"
                >
                  <img src={kiraAvatar} alt="Kira" className="w-20 h-20 drop-shadow-xl" />
                  {/* Lip sync animation */}
                  <AnimatePresence>
                    {isSpeaking && (
                      <motion.div
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 w-5 overflow-hidden"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: [0.3, 1, 0.5, 1, 0.3] }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                      >
                        <div className="w-5 h-2 bg-red-400 rounded-full" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="flex-1 pt-1">
                  <h3 className="text-white font-bold text-lg">Kira</h3>
                  <p className="text-white/70 text-xs">Your AI Study Buddy</p>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 bg-white/15 rounded-xl px-3 py-2"
                    >
                      <p className="text-white text-sm">{message}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Student info badges */}
              <div className="flex gap-2 mt-4">
                <div className="bg-white/15 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{studentName}</p>
                    <p className="text-white/60 text-[10px]">{grade}</p>
                  </div>
                </div>
                <div className="bg-white/15 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Flame size={18} className="text-orange-300" />
                  <div>
                    <p className="text-white text-xs font-semibold">{streak} Days</p>
                    <p className="text-white/60 text-[10px]">Streak</p>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-3">
                {actions.map((a) => (
                  <button
                    key={a.label}
                    onClick={a.action}
                    className="flex-1 bg-white/15 hover:bg-white/25 transition-colors rounded-xl py-2.5 flex flex-col items-center gap-1"
                  >
                    <a.icon size={18} className="text-white" />
                    <span className="text-white text-[10px] font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KiraAgent;
