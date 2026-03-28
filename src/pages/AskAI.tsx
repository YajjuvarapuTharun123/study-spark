import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, Bot, User } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const fakeResponses = [
  "That's a great question! Let me break it down for you...\n\nThe key concept here involves understanding the fundamental principles. Think of it like building blocks — each piece connects to form the larger picture.\n\n**Key Points:**\n1. Start with the basics\n2. Build understanding step by step\n3. Practice regularly\n\nWould you like me to explain any part in more detail?",
  "Here's a clear explanation:\n\nThis topic can be understood through a simple analogy. Imagine you're solving a puzzle — each piece represents a concept that fits together.\n\n**Remember:**\n- Break complex problems into smaller parts\n- Look for patterns\n- Don't hesitate to ask follow-up questions!\n\nLet me know if you need more examples! 📚",
];

const AskAI = ({ subjectFilter }: { subjectFilter?: string }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Msg = { role: "user", content: input };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate streaming response
    const response = fakeResponses[messages.length % fakeResponses.length];
    let idx = 0;
    const assistantMsg: Msg = { role: "assistant", content: "" };
    setMessages((p) => [...p, assistantMsg]);

    const interval = setInterval(() => {
      idx += 3;
      setMessages((p) => {
        const copy = [...p];
        copy[copy.length - 1] = { role: "assistant", content: response.slice(0, idx) };
        return copy;
      });
      if (idx >= response.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {subjectFilter ? `${subjectFilter} Help` : "Ask AI"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {subjectFilter ? `Ask anything about ${subjectFilter}` : "Your intelligent study companion"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full gap-4 text-center"
            >
              <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center shadow-glow animate-float">
                <Sparkles size={32} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">How can I help?</h2>
                <p className="text-sm text-muted-foreground mt-1">Ask me anything about your studies</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Explain photosynthesis", "Help with algebra", "Summarize WW2"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="text-xs px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-primary/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl gradient-primary flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot size={14} className="text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center mt-1">
                    <User size={14} className="text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="flex gap-2 items-center text-muted-foreground">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={send}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-40 shadow-glow"
            >
              <ArrowUp size={16} className="text-primary-foreground" />
            </motion.button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AskAI;
