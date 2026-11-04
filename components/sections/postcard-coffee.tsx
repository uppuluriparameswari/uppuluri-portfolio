"use client";

import { useState, useId, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, RefreshCw, X, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendPostcard } from "@/app/actions/postcard";

// -------------------------------------------------------------
// Illustrated postage stamp collection
// Twelve original mini-scenes with distinct subjects and palettes.
// -------------------------------------------------------------
const STAMP_PALETTES = [
  { bg: "#8C4A35", accent: "#E9A65A", paper: "#FFF1D9", detail: "#52766A" },
  { bg: "#315C57", accent: "#E7B85C", paper: "#F5F1DF", detail: "#A7C5A5" },
  { bg: "#405A78", accent: "#E9B86E", paper: "#F4EBDD", detail: "#A7B8C8" },
  { bg: "#76516F", accent: "#E7A9A1", paper: "#F8EDE7", detail: "#B6C7A4" },
  { bg: "#9A633D", accent: "#F0C66D", paper: "#FFF0D5", detail: "#6C8061" },
  { bg: "#35536B", accent: "#E5A56F", paper: "#F4EDE1", detail: "#A8C4C1" },
  { bg: "#6D5948", accent: "#D99B83", paper: "#F6EBDD", detail: "#8BA58A" },
  { bg: "#466B55", accent: "#E9C878", paper: "#F4F0D9", detail: "#D58E76" },
  { bg: "#8A4F56", accent: "#E8B96D", paper: "#F8EEE3", detail: "#78958B" },
  { bg: "#4F5D83", accent: "#E7B77D", paper: "#F3EBDD", detail: "#A8B8A1" },
  { bg: "#52716B", accent: "#E7AD8C", paper: "#F7F0E3", detail: "#D5C17A" },
  { bg: "#765D3E", accent: "#E9C36D", paper: "#F8EEDC", detail: "#9BAE9A" },
];

const STAMP_NAMES = [
  "Little lovebird", "Wildflower study", "Evening sail", "Garden butterfly",
  "Desert bloom", "Mountain sunrise", "Moonlit cat", "Mushroom garden",
  "Seaside shell", "Hot-air journey", "Koi pond", "The tiny lighthouse",
];

function PerforatedStamp({
  seed = 0,
  className,
}: {
  seed: number;
  className?: string;
}) {
  const index = ((seed % STAMP_PALETTES.length) + STAMP_PALETTES.length) % STAMP_PALETTES.length;
  const palette = STAMP_PALETTES[index];
  const ink = palette.bg;
  const paper = palette.paper;
  const accent = palette.accent;
  const detail = palette.detail;

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden border border-black/10 bg-white p-[5px] shadow-sm dark:border-white/15 dark:bg-[#202124]",
        className
      )}
    >
      <svg viewBox="0 0 160 160" className="block h-full w-full" role="img" aria-label={`${STAMP_NAMES[index]} postage stamp`}>
        <rect width="160" height="160" fill={paper} />
        <rect x="5" y="5" width="150" height="150" fill="none" stroke={ink} strokeOpacity=".35" strokeWidth="1.3" />
        <path d="M12 12h136v136H12z" fill="none" stroke={ink} strokeOpacity=".13" strokeWidth="1" />

        {/* 01 — Two lovebirds on a branch */}
        {index === 0 && <g>
          <path d="M22 119 Q75 105 139 119" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          <path d="M45 115 Q35 91 51 70 Q66 53 81 72 Q92 89 76 110Z" fill={detail} />
          <path d="M84 112 Q75 89 91 68 Q106 51 121 70 Q132 88 116 108Z" fill={ink} />
          <circle cx="65" cy="78" r="3" fill={paper} /><circle cx="105" cy="76" r="3" fill={paper} />
          <path d="M51 83l-11 5 12 3 M119 81l12 5-12 3" fill={accent} />
          <path d="M80 45c-12-17-30 0 0 26 30-26 12-43 0-26Z" fill={accent} />
          <path d="M44 119l-9 13m79-13 9 13" stroke={ink} strokeWidth="3" />
        </g>}

        {/* 02 — Wildflower botanical study */}
        {index === 1 && <g>
          <path d="M80 133Q77 91 83 42" stroke={ink} strokeWidth="4" fill="none" />
          <path d="M80 102Q43 65 33 91Q48 116 80 102ZM82 84Q116 46 130 70Q119 96 82 84Z" fill={detail} />
          <g transform="translate(84 43)">
            {Array.from({length: 8}).map((_, i) => <ellipse key={i} cx="0" cy="-15" rx="8" ry="15" fill={i % 2 ? accent : "#D98C79"} transform={`rotate(${i * 45})`} />)}
            <circle r="8" fill={ink} /><circle r="3" fill={paper} />
          </g>
          <path d="M28 132h104" stroke={ink} strokeOpacity=".35" />
        </g>}

        {/* 03 — Sailboat at dusk */}
        {index === 2 && <g>
          <circle cx="119" cy="39" r="17" fill={accent} />
          <path d="M0 104Q35 91 69 104T160 102V160H0Z" fill={detail} />
          <path d="M0 121Q40 109 80 121T160 119" fill="none" stroke={paper} strokeWidth="2" opacity=".8" />
          <path d="M77 43v68" stroke={ink} strokeWidth="4" />
          <path d="M72 50L35 99H72Z" fill={paper} />
          <path d="M82 60L119 101H82Z" fill={accent} />
          <path d="M29 111H126Q112 132 48 128Z" fill={ink} />
        </g>}

        {/* 04 — Butterfly over a garden */}
        {index === 3 && <g>
          <path d="M80 75Q51 30 27 53Q13 78 65 88Q24 105 45 128Q68 135 80 91Q92 135 115 128Q136 105 95 88Q147 78 133 53Q109 30 80 75Z" fill={accent} stroke={ink} strokeWidth="3" />
          <path d="M80 70v45" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          <path d="M80 70Q62 42 54 48M80 70Q98 42 106 48" fill="none" stroke={ink} strokeWidth="2.5" />
          <circle cx="45" cy="71" r="5" fill={paper} /><circle cx="115" cy="71" r="5" fill={paper} />
          <path d="M20 137q20-20 40 0t40 0t40 0" fill="none" stroke={detail} strokeWidth="4" />
        </g>}

        {/* 05 — Desert cactus and sun */}
        {index === 4 && <g>
          <circle cx="116" cy="42" r="20" fill={accent} />
          <path d="M0 117Q45 100 80 116T160 112V160H0Z" fill="#DDA66F" />
          <path d="M73 123V66Q73 52 84 52Q95 52 95 66V123M73 88H61Q51 88 51 77V69M95 99H108Q119 99 119 88V80" fill="none" stroke={ink} strokeWidth="11" strokeLinecap="round" />
          <path d="M84 60v6m-16 17h-8m44 14h8" stroke={paper} strokeWidth="2" />
          <path d="M22 124l10-19 10 19m76 0 9-17 9 17" fill={detail} />
        </g>}

        {/* 06 — Layered mountain sunrise */}
        {index === 5 && <g>
          <circle cx="111" cy="52" r="23" fill={accent} />
          <path d="M0 115L43 57 66 87 94 42 160 119V160H0Z" fill={ink} />
          <path d="M26 80L43 57 57 75 48 72 42 78 36 71Z M77 66L94 42 113 68 100 62 94 69 87 59Z" fill={paper} />
          <path d="M0 125Q43 108 80 126T160 122V160H0Z" fill={detail} />
          <path d="M16 137q25-10 50 0t50 0" fill="none" stroke={paper} strokeWidth="2" opacity=".7" />
        </g>}

        {/* 07 — Curious cat beneath a crescent moon */}
        {index === 6 && <g>
          <path d="M111 27a23 23 0 1 0 22 34 20 20 0 0 1-22-34Z" fill={accent} />
          <path d="M43 117V76L58 88Q80 74 102 88L117 76V117Q117 137 80 137T43 117Z" fill={ink} />
          <path d="M49 84L46 54 68 76M91 76l22-22-3 30" fill={ink} />
          <ellipse cx="67" cy="104" rx="4" ry="6" fill={paper} /><ellipse cx="93" cy="104" rx="4" ry="6" fill={paper} />
          <path d="M76 116l4 4 4-4M80 120v6m-7-3-12 2m26-2 12 2" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          <circle cx="31" cy="38" r="2" fill={detail} /><circle cx="135" cy="87" r="3" fill={detail} />
        </g>}

        {/* 08 — Tiny mushroom garden */}
        {index === 7 && <g>
          <path d="M0 121Q40 104 80 120T160 117V160H0Z" fill={detail} />
          <path d="M69 87h23l8 43H61Z" fill={paper} stroke={ink} strokeWidth="2" />
          <path d="M42 88Q43 48 80 45Q117 48 118 88Z" fill="#C96F5D" stroke={ink} strokeWidth="3" />
          <circle cx="66" cy="67" r="6" fill={paper} /><circle cx="91" cy="59" r="5" fill={paper} /><circle cx="103" cy="77" r="4" fill={paper} />
          <path d="M31 125q-4-19 8-23 13 7 8 23m67 2q-4-15 8-20 12 8 7 20" fill={accent} />
          <path d="M17 137h126" stroke={paper} strokeWidth="2" opacity=".7" />
        </g>}

        {/* 09 — Seashell and curling tide */}
        {index === 8 && <g>
          <path d="M19 117Q46 91 80 105Q114 91 141 117Q119 145 80 139Q41 145 19 117Z" fill={detail} />
          <path d="M43 111Q37 69 80 37Q123 69 117 111Q100 128 80 128Q60 128 43 111Z" fill={accent} stroke={ink} strokeWidth="3" />
          <path d="M80 42L80 126M80 53L54 112M80 53L106 112M80 70L65 120M80 70L95 120" stroke={paper} strokeWidth="2.5" fill="none" />
          <path d="M17 91q15-14 29 0t29 0m41 0q15-14 29 0" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>}

        {/* 10 — Hot-air balloon over rolling hills */}
        {index === 9 && <g>
          <path d="M0 119Q39 92 78 119T160 113V160H0Z" fill={detail} />
          <path d="M80 24Q37 24 43 68Q47 91 80 105Q113 91 117 68Q123 24 80 24Z" fill={accent} stroke={ink} strokeWidth="3" />
          <path d="M80 26V101M55 36Q67 56 68 96M105 36Q93 56 92 96" stroke={paper} strokeWidth="3" fill="none" />
          <path d="M68 104l-5 12h34l-5-12" fill={ink} />
          <path d="M63 116v8m34-8v8" stroke={ink} strokeWidth="2" />
          <circle cx="27" cy="42" r="3" fill={detail} /><circle cx="132" cy="55" r="3" fill={detail} />
        </g>}

        {/* 11 — Two koi circling in a pond */}
        {index === 10 && <g>
          <circle cx="80" cy="83" r="52" fill={detail} opacity=".55" />
          <path d="M38 76Q54 45 88 57Q105 64 111 83Q92 103 67 96Q47 91 38 76Z" fill={paper} stroke={ink} strokeWidth="2.5" />
          <path d="M38 76l-17-15 3 20-5 17 20-8" fill={accent} stroke={ink} strokeWidth="2" />
          <path d="M122 92Q106 122 73 111Q56 105 50 86Q69 66 94 73Q113 78 122 92Z" fill={accent} stroke={ink} strokeWidth="2.5" />
          <path d="M122 92l17 15-3-20 5-17-20 8" fill={paper} stroke={ink} strokeWidth="2" />
          <circle cx="54" cy="72" r="2.5" fill={ink} /><circle cx="106" cy="96" r="2.5" fill={ink} />
          <path d="M80 28v10m-5-5h10M80 125v9m-5-4h10" stroke={paper} strokeWidth="2" />
        </g>}

        {/* 12 — Lighthouse on a rocky coast */}
        {index === 11 && <g>
          <circle cx="119" cy="38" r="17" fill={accent} />
          <path d="M0 116Q34 97 65 116T160 111V160H0Z" fill={detail} />
          <path d="M61 119L69 53H91L99 119Z" fill={paper} stroke={ink} strokeWidth="3" />
          <path d="M66 78h28M64 99h32" stroke={ink} strokeWidth="5" />
          <path d="M65 53h30l-5-12H70Z" fill={ink} />
          <path d="M70 41V31h20v10" fill={accent} stroke={ink} strokeWidth="2" />
          <path d="M68 31L35 19m57 12 30-12" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <path d="M0 132q18-12 36 0t36 0 36 0 52 0" stroke={paper} strokeWidth="2" fill="none" />
        </g>}

        <text x="12" y="20" fill={ink} fontFamily="monospace" fontSize="7" fontWeight="700" letterSpacing="1.1">POST</text>
        <text x="148" y="147" fill={ink} fontFamily="monospace" fontSize="7" textAnchor="end" letterSpacing=".5">№ {String(index + 1).padStart(2, "0")}</text>
      </svg>
    </div>
  );
}


const PERSONAL_INFO = {
  name: "Uppuluri Parameswari",
  title: "Scientific Visualist & Frontend Designer",
  location: "Bengaluru, IN (IST)",
  email: "parameswari.u@outlook.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/uppuluriparameswari/",
    github: "https://github.com/uppuluriparameswari/",
  },
};

export function PostcardSection() {
  const [isPostcardOpen, setIsPostcardOpen] = useState(false);

  return (
    <section
      id="correspondence"
      className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-between items-center px-6 pt-24 pb-8 snap-start font-sans"
    >
      <div />

      <div className="w-full max-w-4xl my-auto">

        {/* Section heading */}
        <div className="flex items-center justify-between border-b border-border pb-5 mb-8">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              A little connection
            </span>

            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground mt-2">
              Correspondence
            </h2>
          </div>

          <span className="font-mono text-[10px] text-muted hidden sm:block">
            OPEN TO HELLOS
          </span>
        </div>

        {/* Postcard card */}
        <motion.button
          type="button"
          onClick={() => setIsPostcardOpen(true)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          className="group w-full text-left overflow-hidden rounded-xl border border-border bg-surface/50 hover:border-accent/50 transition-colors duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]">

            {/* Text content */}
            <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center">

              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-5">
                You've got a place to say hello
              </span>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.12] text-foreground max-w-lg group-hover:text-accent transition-colors">
                A tiny corner of the internet for little hellos.
              </h3>

              <p className="text-sm sm:text-base text-muted leading-relaxed mt-6 max-w-md">
               No fancy introductions needed. Share a thought, a story, or simply say hi. I'd love to know who's on the other side, but names are optional, hellos aren't!
              </p>

              <div className="mt-9 flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                  Send me a postcard
                </span>

                <ArrowRight className="w-4 h-4 text-accent transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </div>

            {/* Stamp collection */}
            <div className="border-t md:border-t-0 md:border-l border-border p-7 sm:p-8 flex flex-col items-center justify-center">

              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-7">
                The stamp collection
              </span>

              <div className="flex items-center justify-center -space-x-3 sm:-space-x-2">

                <div className="w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] -rotate-6 transition-transform duration-300 group-hover:-rotate-3 group-hover:-translate-y-1">
                  <PerforatedStamp seed={0} className="h-full w-full" />
                </div>

                <div className="relative z-10 w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rotate-2 transition-transform duration-300 group-hover:rotate-0 group-hover:-translate-y-2">
                  <PerforatedStamp seed={5} className="h-full w-full" />
                </div>

                <div className="w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] rotate-6 transition-transform duration-300 group-hover:rotate-3 group-hover:-translate-y-1">
                  <PerforatedStamp seed={10} className="h-full w-full" />
                </div>

              </div>

              <p className="mt-7 max-w-[190px] text-center font-mono text-[10px] leading-relaxed tracking-wide text-muted">
                Three little pieces of art, ready to travel.
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl border-t border-border pt-5 pb-1 mt-16">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-xs text-muted">

          <div>
            <span className="text-foreground font-medium">
              {PERSONAL_INFO.name}
            </span>

            <span className="block sm:inline sm:before:content-['—'] sm:before:mx-2">
              {PERSONAL_INFO.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">

            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-accent" />
              {PERSONAL_INFO.location}
            </span>

            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="hover:text-foreground transition-colors"
            >
              Email
            </a>

            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>

            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>

          </div>
        </div>
      </footer>

      {/* Modal */}
      <PostcardModal
        isOpen={isPostcardOpen}
        onClose={() => setIsPostcardOpen(false)}
      />

    </section>
  );
}
// -------------------------------------------------------------
// Interactive Postcard Modal Component
// -------------------------------------------------------------

function PostcardModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    country: "",
    website: "",
  });

  const [stampSeed, setStampSeed] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nameId = useId();
  const messageId = useId();
  const countryId = useId();
  const websiteId = useId();

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(handleReset, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      message: "",
      country: "",
      website: "",
    });
    setErrorMessage(null);
    setStampSeed(0);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim() || isPending) return;

    setIsPending(true);
    setErrorMessage(null);

    try {
      const res = await sendPostcard({
        ...formData,
        stampSeed,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(
          res.error || "Unable to dispatch note. Please try again."
        );
      }
    } catch {
      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl p-5 sm:p-7 z-10 my-4 overflow-hidden font-sans"
            role="dialog"
            aria-modal="true"
            aria-labelledby="postcard-title"
          >
            {/* Close */}
            <button
              onClick={handleReset}
              disabled={isPending}
              className="absolute top-5 right-5 text-muted hover:text-foreground transition-colors p-1 rounded-full hover:bg-surface-hover focus:outline-none"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              /* Success Message */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={handleReset}
                className="py-6 sm:py-8 flex flex-col items-center text-center cursor-pointer select-none"
              >
                <motion.div
                  initial={{ scale: 0.8, rotate: -4 }}
                  animate={{ scale: 1, rotate: 2 }}
                  transition={{
                    type: "spring",
                    damping: 14,
                    stiffness: 200,
                  }}
                  className="w-24 h-24 sm:w-28 sm:h-28 mb-6 drop-shadow-md"
                >
                  <PerforatedStamp
                    seed={stampSeed}
                    className="w-full h-full"
                  />
                </motion.div>

                <div className="space-y-3 max-w-sm">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-accent font-medium block">
                    Postcard Received
                  </span>

                  <h3 className="text-xl sm:text-2xl font-serif italic text-foreground tracking-tight">
                    Thank you for stopping by
                    {formData.name ? `, ${formData.name}` : ""}.
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed pt-1">
                    Thank you for stopping by and leaving a little sunshine in my inbox. I'll treasure this little hello!
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/50 w-full flex justify-center">
                  <span className="font-mono text-[10px] text-muted/60 tracking-wider">
                    — tap anywhere to close —
                  </span>
                </div>
              </motion.div>
            ) : (
              /* Postcard Form */
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 sm:gap-5"
              >
                {/* Heading */}
                <div className="flex flex-col gap-2 pr-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    A little note goes a long way
                  </span>

                  <h3
                    id="postcard-title"
                    className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground"
                  >
                    Send a postcard
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg">
                    Not sure what to write? Honestly, neither do I sometimes. Share a place that stayed with you, a moment that made you smile, a thought you've been holding onto, or a little piece of your world. I'd love to hear it all.
                  </p>
                </div>

                {/* Error */}
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={nameId}
                    className="font-mono text-xs text-muted"
                  >
                    Your Name
                  </label>

                  <input
                    id={nameId}
                    type="text"
                    disabled={isPending}
                    value={formData.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    placeholder="What should I call you?"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted/40 font-sans text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={messageId}
                    className="font-mono text-xs text-muted"
                  >
                    Your Message
                  </label>

                  <textarea
                    id={messageId}
                    required
                    rows={4}
                    disabled={isPending}
                    value={formData.message}
                    onChange={(e) =>
                      updateField("message", e.target.value)
                    }
                    placeholder="Hello from..."
                    className="w-full min-h-28 px-3.5 py-3 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted/40 font-sans text-sm resize-y focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Optional details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={countryId}
                      className="font-mono text-xs text-muted"
                    >
                      Where are you from?
                      <span className="ml-2 text-accent/80">
                        (If you'd like)
                      </span>
                    </label>

                    <input
                      id={countryId}
                      type="text"
                      disabled={isPending}
                      value={formData.country}
                      onChange={(e) =>
                        updateField("country", e.target.value)
                      }
                      placeholder="Your city or country"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted/40 font-sans text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={websiteId}
                      className="font-mono text-xs text-muted"
                    >
                      Your Website
                      <span className="ml-2 text-accent/80">
                        (If you'd like)
                      </span>
                    </label>

                    <input
                      id={websiteId}
                      type="url"
                      disabled={isPending}
                      value={formData.website}
                      onChange={(e) =>
                        updateField("website", e.target.value)
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted/40 font-sans text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Stamp Selection */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="block text-sm font-medium text-foreground">
                        Choose your stamp
                      </span>

                      <span className="block mt-1 text-xs text-muted">
                        A little illustration for your postcard.
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-muted">
                      {String((stampSeed % 12) + 1).padStart(2, "0")} / 12
                    </span>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl border border-border bg-background/40 p-3 sm:p-4">
                    <div className="h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                      <PerforatedStamp
                        seed={stampSeed}
                        className="h-full w-full"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {STAMP_NAMES[stampSeed % STAMP_NAMES.length]}
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        A tiny illustrated scene, chosen just for your postcard.
                      </p>

                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          setStampSeed((prev) => (prev + 1) % 12)
                        }
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-accent" />
                        <span>Change stamp</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!formData.message.trim() || isPending}
                  className="w-full py-3 rounded-lg bg-foreground text-background font-mono text-xs uppercase tracking-wider font-medium hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 mt-1"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Stamping & Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Postcard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
