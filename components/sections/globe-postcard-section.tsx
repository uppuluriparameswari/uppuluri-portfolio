"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Smile, Image as ImageIcon, CheckCircle2, RotateCcw } from "lucide-react";
import { sendPostcard } from "@/app/actions/postcard";
import { Globe3D } from "@/components/ui/3d-globe";

// -------------------------------------------------------------
// Main Section: Globe + Postcard Desk
// -------------------------------------------------------------
type SendStage = "idle" | "folding" | "orbiting" | "landed";

export function GlobePostcardSection() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("Uppuluri · Bengaluru");
  const [stage, setStage] = useState<SendStage>("idle");
  const [statusText, setStatusText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || stage !== "idle") return;

    setStage("folding");
    setStatusText("Folding airmail...");

    sendPostcard({
      name: "Visitor",
      message: message.trim(),
      country: recipient,
      website: "",
      stampSeed: 0,
    }).catch(console.error);

    setTimeout(() => {
      setStage("orbiting");
      setStatusText("On its way to Bengaluru...");
    }, 900);

    setTimeout(() => {
      setStage("landed");
      setStatusText("Landed in Bengaluru");
    }, 3800);
  };

  const handleReset = () => {
    setStage("idle");
    setMessage("");
    setStatusText("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <section
      id="globe-postcard"
      className="relative min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center bg-background px-4 py-12 snap-start select-none font-sans overflow-hidden"
    >
      {/* 1. CLEAN FLOATING EARTH — transparent canvas, no rings or avatars */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="relative w-[min(92vw,800px)] aspect-square flex items-center justify-center">
          <Globe3D
            className="!h-full !w-full"
            markers={[]}
            config={{
              showAtmosphere: false,
              showWireframe: false,
              bumpScale: 5,
              autoRotateSpeed: stage === "orbiting" ? 1.5 : 0.3,
              backgroundColor: null,
            }}
          />
        </div>
      </div>

      {/* 2. Flight Path Orbit Ring Animation */}
      <AnimatePresence>
        {stage === "orbiting" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.9, 0.4], scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.8, ease: "easeInOut" }}
              className="absolute w-[360px] sm:w-[540px] md:w-[650px] h-[180px] sm:h-[260px] md:h-[300px] rounded-[100%] border border-blue-400/60 shadow-[0_0_35px_rgba(59,130,246,0.3)] -rotate-12"
            />
            <motion.div
              initial={{ offsetDistance: "0%", opacity: 0, scale: 0.5 }}
              animate={{
                offsetDistance: ["0%", "100%"],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 0.9, 0.4],
              }}
              transition={{ duration: 2.8, ease: "easeInOut" }}
              style={{
                offsetPath: `ellipse(270px 130px at 50% 50%)`,
                offsetRotate: "auto",
              }}
              className="absolute hidden sm:block"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white stroke-blue-500 stroke-[1.5] drop-shadow-[0_4px_12px_rgba(59,130,246,0.7)]">
                <path d="M2 12l20-9-9 20-2-8-9-3z" />
              </svg>
            </motion.div>
            
            <motion.div
              initial={{ offsetDistance: "0%", opacity: 0, scale: 0.5 }}
              animate={{
                offsetDistance: ["0%", "100%"],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 0.8, 0.4],
              }}
              transition={{ duration: 2.8, ease: "easeInOut" }}
              style={{
                offsetPath: `ellipse(180px 90px at 50% 50%)`,
                offsetRotate: "auto",
              }}
              className="absolute sm:hidden"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white stroke-blue-500 stroke-[1.5] drop-shadow-[0_4px_12px_rgba(59,130,246,0.7)]">
                <path d="M2 12l20-9-9 20-2-8-9-3z" />
              </svg>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Foreground Interactive Stage (Postcard + Input) */}
      <div className="relative z-30 w-full max-w-md flex flex-col items-center mt-8">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="card-idle"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] bg-white text-zinc-900 rounded-lg shadow-2xl border border-zinc-200 p-6 pb-8 mb-4 overflow-hidden"
              style={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.25)" }}
            >
              <div className="absolute inset-2 border border-dashed border-zinc-300 pointer-events-none rounded-sm" />
              <div className="flex items-start justify-between relative z-10 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  {formattedDate}
                </span>
                <div className="relative w-12 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded p-1 flex flex-col items-center justify-between shadow-sm">
                  <div className="w-full flex justify-between px-0.5 pt-0.5">
                    <span className="text-[6px] font-mono text-white/80">AIR</span>
                    <span className="text-[6px] font-mono text-white/80">№01</span>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/90 stroke-white/90">
                    <path d="M2 12l20-9-9 20-2-8-9-3z" />
                  </svg>
                  <span className="text-[7px] font-mono font-bold text-white tracking-widest">
                    BLR MAIL
                  </span>
                  <div className="absolute -left-3 top-3 w-8 h-8 rounded-full border border-zinc-400/40 pointer-events-none" />
                </div>
              </div>
              <div className="relative z-10 min-h-[110px] font-serif text-sm sm:text-base leading-relaxed text-zinc-800 break-words">
                {message ? (
                  <p className="whitespace-pre-wrap">{message}</p>
                ) : (
                  <p className="text-zinc-400 italic">
                    Greetings from Kyoto! The temples are unreal and I ate far too much matcha. Saving you a seat at our café by the river when I'm back.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {stage === "folding" && (
            <motion.div
              key="card-folding"
              initial={{ scale: 1, rotateX: 0 }}
              animate={{
                scale: [1, 0.9, 0.4],
                rotateX: [0, 45, 90],
                y: [0, -30, -90],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="w-48 h-36 bg-white border border-zinc-200 rounded shadow-xl flex items-center justify-center mb-6"
            >
              <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-blue-600 fill-blue-50">
                <polygon points="50,10 90,90 50,70 10,90" />
                <line x1="50" y1="10" x2="50" y2="70" strokeWidth="2" />
              </svg>
            </motion.div>
          )}

          {stage === "landed" && (
            <motion.div
              key="card-landed"
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-8 flex items-center gap-2.5 px-4 py-2 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-medium text-foreground">
                Landed in Bengaluru
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-[390px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-3 flex flex-col gap-2 transition-all">
          <div className="flex items-center gap-2 px-1">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">To</span>
            <span className="text-xs font-medium text-foreground truncate max-w-[200px]">
              {recipient}
            </span>
          </div>

          <form onSubmit={handleSend} className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="text"
              disabled={stage !== "idle"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={stage === "idle" ? "Write a postcard..." : statusText}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 px-1 py-1 focus:outline-none disabled:opacity-75 font-sans"
            />

            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="p-1 hover:text-foreground transition-colors rounded">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 hover:text-foreground transition-colors rounded">
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRecipient(prev => prev.includes("Bengaluru") ? "Uppuluri · Tokyo" : "Uppuluri · Bengaluru")}
                  className="p-1 hover:text-foreground transition-colors rounded"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>

              {stage === "idle" && (
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              )}

              {stage === "folding" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/10 text-blue-500 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Folding...</span>
                </div>
              )}

              {stage === "orbiting" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-medium">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending</span>
                </div>
              )}

              {stage === "landed" && (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sent</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-surface rounded-full transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
