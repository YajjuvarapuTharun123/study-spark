import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Brain, ChevronDown, ImagePlus, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { streamChat, type Msg } from "@/lib/streamChat";
import { toast } from "@/hooks/use-toast";

const AskAI = ({ subjectFilter }: { subjectFilter?: string }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Msg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: newMessages,
        subjectFilter,
        onDelta: upsertAssistant,
        onDone: () => setIsTyping(false),
        onError: (err) => {
          setIsTyping(false);
          toast({ title: "Error", description: err, variant: "destructive" });
        },
      });
    } catch {
      setIsTyping(false);
      toast({ title: "Error", description: "Failed to connect to AI", variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
        {/* Header */}
        <div className="px-5 pt-12 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <ArrowLeft size={18} className="text-foreground" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">
              <span className="text-[hsl(var(--primary))]">AI</span>{" "}
              {subjectFilter ? `${subjectFilter}` : "Chat"}
            </h1>
          </div>
          <div className="h-[2px] w-full bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.5)] to-transparent rounded-full" />
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 space-y-4 py-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary)/0.1)] border-2 border-[hsl(var(--primary)/0.3)] flex items-center justify-center">
                <Brain size={28} className="text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {subjectFilter ? `Ask about ${subjectFilter}` : "How can I help?"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {subjectFilter ? `I can only answer ${subjectFilter} questions` : "Ask me anything about your studies"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {(subjectFilter
                  ? [`Explain ${subjectFilter} basics`, `${subjectFilter} formulas`, `${subjectFilter} tips`]
                  : ["Explain photosynthesis", "Help with algebra", "Summarize WW2"]
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-4 py-2 rounded-full border border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))] font-medium hover:bg-[hsl(var(--primary)/0.05)] transition-colors"
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
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "items-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary)/0.1)] border-2 border-[hsl(var(--primary)/0.3)] flex-shrink-0 flex items-center justify-center mt-1">
                    <Brain size={16} className="text-[hsl(var(--primary))]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-secondary/80 text-foreground border border-border/50 rounded-br-md"
                      : "bg-[hsl(var(--primary)/0.08)] text-foreground border border-[hsl(var(--primary)/0.15)] rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-purple max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary)/0.1)] border-2 border-[hsl(var(--primary)/0.3)] flex-shrink-0 flex items-center justify-center">
                <Brain size={16} className="text-[hsl(var(--primary))]" />
              </div>
              <div className="flex gap-1.5 items-center pt-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]"
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-5 py-4">
          <div className="border border-border/60 rounded-2xl overflow-hidden shadow-sm">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask AI assistant..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-4 pt-4 pb-2"
            />
            <div className="flex items-center justify-between px-3 pb-3">
              <button className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-[hsl(var(--primary))] hover:bg-secondary/50 transition-colors">
                <ImagePlus size={16} />
              </button>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 text-xs font-medium text-[hsl(var(--primary))] hover:bg-secondary/50 transition-colors">
                  <ChevronDown size={14} />
                  This Session
                </button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={send}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center disabled:opacity-40 shadow-md"
                >
                  <ArrowUp size={16} className="text-primary-foreground" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AskAI;
