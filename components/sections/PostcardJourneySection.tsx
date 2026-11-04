"use client";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Loader2,
  MapPin,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sendPostcard } from "@/app/actions/postcard";

// Dynamically import the Globe. Disable SSR since WebGL relies on the window object.
const Globe3D = dynamic(
  () => import("@/components/ui/3d-globe").then((mod) => mod.Globe3D),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex flex-col items-center justify-center text-muted gap-3">
        <Loader2 className="h-5 w-5 animate-spin opacity-50" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Calibrating space...</span>
      </div>
    )
  }
);

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

type PostcardDraft = {
  name: string;
  message: string;
  country: string;
  website: string;
};

type PostcardStage = "compose" | "folding" | "travelling" | "arrived";

const EMPTY_DRAFT: PostcardDraft = {
  name: "",
  message: "",
  country: "",
  website: "",
};

const DESTINATION = {
  name: "Bengaluru",
  country: "India",
  lat: 12.9716,
  lng: 77.5946,
  coordinates: "12.9716° N · 77.5946° E",
};

const FOLD_DURATION_MS = 1550;
const JOURNEY_DURATION_MS = 5200;

export function PostcardJourneySection() {
  const [studioOpen, setStudioOpen] = useState(false);

  return (
    <section
      id="correspondence-experiment"
      className="flex min-h-screen min-h-[100dvh] w-full snap-start flex-col items-center justify-between px-6 pb-8 pt-24 font-sans"
    >
      <div aria-hidden="true" />

      <div className="my-auto w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between border-b border-border pb-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              A little connection
            </span>
            <h2 className="mt-2 text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              Correspondence
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] text-muted sm:block">
            OPEN TO HELLOS
          </span>
        </div>

        <motion.button
          type="button"
          onClick={() => setStudioOpen(true)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          className="group w-full overflow-hidden rounded-xl border border-border bg-surface/50 text-left transition-colors duration-300 hover:border-accent/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="flex flex-col justify-center p-7 sm:p-10 md:p-12">
              <span className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                You&apos;ve got a place to say hello
              </span>
              <h3 className="max-w-lg text-3xl font-medium leading-[1.12] tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-4xl lg:text-5xl">
                A tiny corner of the internet for little hellos.
              </h3>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                No fancy introductions needed. Share a thought, a story, or
                simply say hi. I&apos;d love to know who&apos;s on the other side,
                but names are optional, hellos aren&apos;t!
              </p>
              <div className="mt-9 flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground">
                  Make a postcard
                </span>
                <ArrowRight className="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-t border-border p-7 sm:p-8 md:border-l md:border-t-0">
              <span className="mb-7 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                The stamp collection
              </span>
              <div className="flex items-center justify-center -space-x-3 sm:-space-x-2">
                <div className="h-[76px] w-[76px] -rotate-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-3 sm:h-[88px] sm:w-[88px]">
                  <PerforatedStamp seed={0} className="h-full w-full" />
                </div>
                <div className="relative z-10 h-[88px] w-[88px] rotate-2 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-0 sm:h-[100px] sm:w-[100px]">
                  <PerforatedStamp seed={5} className="h-full w-full" />
                </div>
                <div className="h-[76px] w-[76px] rotate-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3 sm:h-[88px] sm:w-[88px]">
                  <PerforatedStamp seed={10} className="h-full w-full" />
                </div>
              </div>
              <p className="mt-7 max-w-[190px] text-center font-mono text-[10px] leading-relaxed tracking-wide text-muted">
                Little pieces of art, ready to travel.
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      <footer className="mt-16 w-full max-w-4xl border-t border-border pb-1 pt-5">
        <div className="flex flex-col items-start justify-between gap-4 font-mono text-xs text-muted md:flex-row md:items-center">
          <div>
            <span className="font-medium text-foreground">{PERSONAL_INFO.name}</span>
            <span className="block sm:inline sm:before:mx-2 sm:before:content-['—']">
              {PERSONAL_INFO.title}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="flex items-center gap-1">
              <Compass className="h-3 w-3 text-accent" />
              {PERSONAL_INFO.location}
            </span>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="transition-colors hover:text-foreground">Email</a>
            <a href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">LinkedIn</a>
            <a href={PERSONAL_INFO.socials.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>

      <PostcardStudio isOpen={studioOpen} onClose={() => setStudioOpen(false)} />
    </section>
  );
}

function PostcardStudio({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<PostcardDraft>(EMPTY_DRAFT);
  const [stampSeed, setStampSeed] = useState(0);
  const [stage, setStage] = useState<PostcardStage>("compose");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const nameId = useId();
  const messageId = useId();
  const countryId = useId();
  const websiteId = useId();

  const isLocked = isSubmitting || stage === "folding" || stage === "travelling";
  const selectedStampName = STAMP_NAMES[stampSeed % STAMP_NAMES.length];
  const previewLineCount = Math.max(
    1,
    draft.message.split("\\n").reduce(
      (total, line) => total + Math.max(1, Math.ceil(line.length / 42)),
      0,
    ),
  );
  const previewHeight = Math.min(460, Math.max(360, 330 + previewLineCount * 28));
  const messageRows = Math.min(
    8,
    Math.max(
      5,
      draft.message.split("\\n").reduce(
        (total, line) => total + Math.max(1, Math.ceil(line.length / 58)),
        0,
      ),
    ),
  );

  useEffect(() => {
    if (!isOpen) return;

    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const frame = window.requestAnimationFrame(() => nameInputRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      const returnFocus = returnFocusRef.current;
      if (returnFocus?.isConnected) {
        window.requestAnimationFrame(() => returnFocus.focus());
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLocked) {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          element.getClientRects().length > 0 &&
          !element.closest("[inert]"),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusIsOutside = !dialog.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutside)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLocked, onClose]);

  useEffect(() => {
    if (isOpen && stage !== "compose") dialogRef.current?.focus();
  }, [isOpen, stage]);

  useEffect(() => {
    if (stage !== "travelling") return;

    const timer = window.setTimeout(() => {
      setStage("arrived");
    }, JOURNEY_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (isOpen) return;
    setDraft(EMPTY_DRAFT);
    setStampSeed(0);
    setStage("compose");
    setIsSubmitting(false);
    setErrorMessage(null);
  }, [isOpen]);

  const updateDraft = (field: keyof PostcardDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const closeStudio = () => {
    if (isLocked) return;
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.message.trim() || isSubmitting || stage !== "compose") return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await sendPostcard({
        name: draft.name.trim() || "Visitor",
        message: draft.message.trim(),
        country: draft.country.trim(),
        website: draft.website.trim(),
        stampSeed,
      });

      if (!result?.success) {
        setErrorMessage(result?.error || "Your postcard could not be sent. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setStage("folding");
      setIsSubmitting(false);
    } catch (error) {
      console.error("Postcard dispatch failed:", error);
      setErrorMessage("Something went wrong while sending your postcard. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleFoldComplete = () => {
    if (stage === "folding") setStage("travelling");
  };

  const sendAnother = () => {
    setDraft(EMPTY_DRAFT);
    setStampSeed(0);
    setErrorMessage(null);
    setStage("compose");
  };

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const stampChoices = Array.from({ length: STAMP_NAMES.length }, (_, index) => index);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-2 sm:p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close postcard studio"
            aria-hidden="true"
            tabIndex={-1}
            disabled={isLocked}
            onClick={closeStudio}
            className="absolute inset-0 cursor-default bg-[#171717]/40 backdrop-blur-md disabled:cursor-wait"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 my-auto h-[min(760px,calc(100dvh-1rem))] min-h-0 w-full max-w-[1080px] overflow-hidden rounded-2xl border border-border bg-background shadow-[0_30px_100px_rgba(0,0,0,.24)]"
            role="dialog"
            aria-modal="true"
            aria-label="Postcard studio"
            tabIndex={-1}
            ref={dialogRef}
          >
            <button
              type="button"
              onClick={closeStudio}
              aria-label="Close postcard studio"
              disabled={isLocked}
              className="absolute right-3 top-3 z-30 rounded-full p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-wait disabled:opacity-50 sm:right-4 sm:top-4"
            >
              <X className="h-4 w-4" />
            </button>

            <AnimatePresence mode="sync" initial={false}>
              {(stage === "travelling" || stage === "arrived") ? (
                <motion.div
                  key={`delivery-screen-${stage}`}
                  className="absolute inset-0 h-full w-full"
                  initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DeliveryView
                    stage={stage}
                    stampSeed={stampSeed}
                    onSendAnother={sendAnother}
                    onClose={closeStudio}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="compose-screen"
                  className="absolute inset-0 h-full w-full"
                  initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                  animate={
                    stage === "folding"
                      ? { opacity: 0, y: -4, filter: "blur(2px)" }
                      : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                  transition={
                    stage === "folding"
                      ? { duration: 1.35, ease: [0.4, 0, 0.2, 1] }
                      : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                  }
                >
              <div className="grid h-full min-h-0 grid-rows-[minmax(210px,0.78fr)_minmax(0,1.22fr)] lg:grid-cols-[minmax(0,1.04fr)_minmax(390px,.96fr)] lg:grid-rows-1">
                {/* LIVE POSTCARD PREVIEW — no globe during composition */}
                <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden bg-background px-5 py-5 transition-colors duration-300 sm:px-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.23] [--postcard-dot:#8b806e] dark:[--postcard-dot:#77717f]"
                    style={{
                      backgroundImage: "radial-gradient(var(--postcard-dot, #8b806e) .7px, transparent .7px)",
                      backgroundSize: "8px 8px",
                    }}
                  />
                  <div className="relative z-10 mb-3 flex w-full max-w-[440px] items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[.17em] text-muted">
                    {stage === "folding" && <span>Preparing for dispatch</span>}
                  </div>

                  <div className="relative z-10 w-full max-w-[440px] [perspective:1500px]">
                    <motion.div
                      key="postcard-paper"
                      initial={{ opacity: 0, y: 12, rotate: -1.2 }}
                      animate={
                        stage === "folding"
                          ? {
                              opacity: [1, 1, 0],
                              y: [0, -5, -42],
                              rotate: [-1.2, 0, 3],
                              scale: [1, 0.98, 0.78],
                            }
                          : {
                              opacity: 1,
                              y: 0,
                              rotate: -1.2,
                              scale: 1,
                            }
                      }
                      transition={
                        stage === "folding"
                          ? {
                              duration: FOLD_DURATION_MS / 1000,
                              ease: [0.22, 0.72, 0.25, 1],
                              times: [0, 0.55, 1],
                            }
                          : { duration: 0.32, ease: "easeOut" }
                      }
                      onAnimationComplete={handleFoldComplete}
                      style={{ transformOrigin: "50% 50%", height: `${previewHeight}px` }}
                      className="relative flex min-h-[360px] w-full flex-col overflow-hidden border border-border bg-background p-5 text-foreground transition-colors duration-300 sm:p-6 shadow-[0_20px_55px_rgba(0,0,0,.1)] dark:shadow-[0_20px_55px_rgba(0,0,0,.3)]"
                    >
                      <div className="pointer-events-none absolute inset-[10px] border border-dashed border-border/60" />

                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div>
                          <span className="mt-1 block font-mono text-[9px] tracking-[.12em] text-muted/80">{formattedDate}</span>
                          {draft.name.trim() && (
                            <span className="mt-2 block max-w-[220px] break-words font-mono text-[10px] tracking-[.04em] text-muted">
                              {draft.name.trim()}
                            </span>
                          )}
                        </div>
                        <div className="h-[68px] w-[68px] shrink-0 rotate-[2deg] border-[5px] border-background bg-background shadow-[0_2px_8px_rgba(0,0,0,.16)] sm:h-[82px] sm:w-[82px]">
                          <PerforatedStamp seed={stampSeed} className="h-full w-full" />
                        </div>
                      </div>

                      <div className="relative z-10 mt-4 mb-4 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pr-2 [scrollbar-width:thin]">
                        <p className="whitespace-pre-wrap break-words text-[clamp(10px,1.6vw,13px)] italic leading-[1.55] tracking-[0.005em] text-foreground [font-family:'Georgia','Times_New_Roman',serif]">
                          {draft.message || "A little canvas for your heartfelt notes."}
                        </p>
                      </div>

                      {(draft.country.trim() || draft.website.trim()) && (
                        <div className="relative z-10 mt-auto grid grid-cols-2 items-end gap-4 border-t border-border/50 pt-3">
                          <div className="min-w-0">
                            {draft.country.trim() && (
                              <>
                                <span className="block font-mono text-[8px] uppercase tracking-[.17em] text-muted/70">Location</span>
                                <span className="mt-1 block break-words font-mono text-[10px] leading-[1.45] text-muted">
                                  {draft.country.trim()}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="min-w-0 text-right">
                            {draft.website.trim() && (
                              <>
                                <span className="block font-mono text-[8px] uppercase tracking-[.17em] text-muted/70">Website</span>
                                <span className="mt-1 block break-all font-mono text-[10px] leading-[1.45] text-muted">
                                  {draft.website.trim().replace(/^https?:\/\//, "")}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <p className="relative z-10 mt-7 max-w-[440px] text-center font-mono text-[9px] uppercase tracking-[.15em] text-muted">
                    A little paper. A few words. A long way to go.
                  </p>
                </div>

                {/* COMPOSER */}
                <div className="flex min-h-0 flex-col overflow-y-auto px-5 py-5 sm:px-8 sm:py-6 lg:px-9 lg:py-7">
                  <div className="mb-4 pr-8">
                    <span className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">
                      A little note goes a long way
                    </span>
                    <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                      Send a postcard
                    </h3>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-muted sm:text-sm">
                      write whatever feels right.
                    </p>
                  </div>

                  {errorMessage && (
                    <div role="alert" className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={nameId} className="font-mono text-xs text-muted">Your Name <span className="text-muted/60">(optional)</span></label>
                      <input
                        id={nameId}
                        ref={nameInputRef}
                        type="text"
                        maxLength={60}
                        value={draft.name}
                        onChange={(event) => updateDraft("name", event.target.value)}
                        placeholder="What should I call you?"
                        disabled={stage !== "compose"}
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-50"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={messageId} className="font-mono text-xs text-muted">Your Message</label>
                      <textarea
                        id={messageId}
                        required
                        rows={messageRows}
                        value={draft.message}
                        onChange={(event) => updateDraft("message", event.target.value)}
                        placeholder="Not sure what to write? Honestly, neither do I sometimes. Share a place that stayed with you, a moment that made you smile, a thought you've been holding onto, or a little piece of your world. I'd love to hear it all."
                        disabled={stage !== "compose"}
                        className="min-h-[128px] max-h-[190px] w-full resize-none overflow-y-auto rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <label htmlFor={countryId} className="font-mono text-xs leading-5 text-muted">Location <span className="text-muted/60">(optional)</span></label>
                        <input
                          id={countryId}
                          type="text"
                          maxLength={80}
                          value={draft.country}
                          onChange={(event) => updateDraft("country", event.target.value)}
                          placeholder="City or country"
                          disabled={stage !== "compose"}
                          className="h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-50"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <label htmlFor={websiteId} className="font-mono text-xs leading-5 text-muted">Website <span className="text-muted/60">(optional)</span></label>
                        <input
                          id={websiteId}
                          type="url"
                          value={draft.website}
                          onChange={(event) => updateDraft("website", event.target.value)}
                          placeholder="https://…"
                          disabled={stage !== "compose"}
                          className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Choose your stamp</h4>
                          <p className="mt-1 text-xs text-muted">A tiny illustration for the journey.</p>
                        </div>
                        <span className="font-mono text-[10px] text-muted">{String(stampSeed + 1).padStart(2, "0")} / 12</span>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
                        {stampChoices.map((choice) => (
                          <button
                            key={choice}
                            type="button"
                            disabled={stage !== "compose"}
                            onClick={() => setStampSeed(choice)}
                            aria-label={`Choose ${STAMP_NAMES[choice]} stamp`}
                            aria-pressed={stampSeed === choice}
                            title={STAMP_NAMES[choice]}
                            className={cn(
                              "group relative flex h-[62px] w-[56px] shrink-0 flex-col items-center justify-start gap-1 rounded-md p-[3px] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
                              stampSeed === choice
                                ? "-translate-y-1 scale-[1.04] opacity-100"
                                : "opacity-65 hover:-translate-y-1 hover:rotate-[-2deg] hover:scale-[1.03] hover:opacity-100",
                            )}
                          >
                            <PerforatedStamp
                              seed={choice}
                              className={cn(
                                "h-[48px] w-[48px] transition-shadow duration-200",
                                stampSeed === choice
                                  ? "shadow-[0_5px_12px_rgba(75,57,34,.2)]"
                                  : "shadow-sm group-hover:shadow-md",
                              )}
                            />
                            <span
                              aria-hidden="true"
                              className={cn(
                                "h-1 w-1 rounded-full transition-all duration-200",
                                stampSeed === choice
                                  ? "scale-100 bg-accent"
                                  : "scale-0 bg-transparent",
                              )}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-muted">Selected: {selectedStampName}</p>
                    </div>

                    <div className="mt-auto pt-1">
                      <button
                        type="submit"
                        disabled={!draft.message.trim() || isSubmitting || stage !== "compose"}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3.5 font-mono text-xs font-medium uppercase tracking-[.14em] text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Sending your note…</>
                        ) : (
                          <>Send postcard <Send className="h-3.5 w-3.5" /></>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DeliveryView({
  stage,
  stampSeed,
  onSendAnother,
  onClose,
}: {
  stage: "travelling" | "arrived";
  stampSeed: number;
  onSendAnother: () => void;
  onClose: () => void;
}) {
  const arrived = stage === "arrived";

  return (
    <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden bg-background px-5 py-6 text-foreground transition-colors duration-300 sm:px-10 sm:py-7">
      {/* Theme-aware background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at 50% 38%,
              color-mix(in srgb, var(--brand-accent) 13%, transparent),
              transparent 45%
            ),
            radial-gradient(
              ellipse at 50% 100%,
              color-mix(in srgb, var(--brand-accent) 6%, transparent),
              transparent 48%
            )
          `,
        }}
      />

      {/* Globe */}
      <div className="relative z-10 flex h-[min(43%,340px)] min-h-[220px] w-full max-w-[470px] shrink-0 items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe3D
            key={arrived ? "bengaluru-arrival" : "global-flight"}
            className="!h-full !w-full"
            markers={
              arrived
                ? [
                    {
                      lat: DESTINATION.lat,
                      lng: DESTINATION.lng,
                      label: "Bengaluru, India",
                    },
                  ]
                : []
            }
            config={{
              showAtmosphere: false,
              bumpScale: 5,
              autoRotateSpeed: arrived ? 0.72 : 1.15,
              initialRotation: { x: 0, y: -2.9251 },
              backgroundColor: null, // Allow transparent background
              enableZoom: false,
              enablePan: false,
            }}
          />
        </div>

        {!arrived && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <motion.div
              initial={{ offsetDistance: "0%", opacity: 0, scale: 0.55 }}
              animate={{
                offsetDistance: ["0%", "100%"],
                opacity: [0, 1, 1, 0],
                scale: [0.55, 1, 1, 0.65],
              }}
              transition={{
                duration: JOURNEY_DURATION_MS / 1000 - 0.2,
                ease: "linear",
              }}
              style={{
                offsetPath: "ellipse(43% 43% at 50% 50%)",
                offsetRotate: "auto",
              } as CSSProperties}
              className="absolute left-1/2 top-1/2"
            >
              <Send className="h-5 w-5 -rotate-12 fill-background text-accent drop-shadow-md" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Destination badge */}
      <div className="relative z-10 mt-1 mb-4 shrink-0">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-medium tracking-wide text-foreground shadow-sm transition-colors duration-300">
          <MapPin className="h-4 w-4 text-accent" />
          {arrived
            ? "Bengaluru, India"
            : `Destination · ${DESTINATION.name}, ${DESTINATION.country}`}
        </span>
      </div>

      {/* Stamp and heading */}
      <motion.div
        key={`heading-${stage}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 flex w-full max-w-xl items-center justify-center gap-5 text-left"
      >
        <div className="h-[86px] w-[86px] shrink-0 rotate-[3deg] border-[5px] border-background bg-background shadow-[0_5px_16px_rgba(55,43,26,.17)] sm:h-[98px] sm:w-[98px]">
          <PerforatedStamp seed={stampSeed} className="h-full w-full" />
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.2em] text-accent sm:text-[10px]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                arrived ? "bg-emerald-500" : "animate-pulse bg-amber-500"
              }`}
            />
            {arrived ? "Postcard received" : "A note in motion"}
          </div>

          <h3 className="text-[clamp(23px,3vw,34px)] font-medium leading-tight tracking-tight text-foreground transition-colors duration-300">
            {arrived
              ? "A little note of thanks"
              : "Your words are on their way."}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
            {arrived
              ? "A little hello has made its way here."
              : `Travelling across the globe to ${DESTINATION.name}, ${DESTINATION.country}.`}
          </p>
        </div>
      </motion.div>

      {/* Thank-you message and actions */}
      <motion.div
        key={`note-${stage}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="relative z-10 mt-4 flex min-h-[118px] w-full max-w-xl shrink-0 flex-col items-center justify-center text-center"
      >
        {arrived ? (
          <>
            <p className="mx-auto max-w-md text-sm leading-7 text-muted sm:text-base">
              Thank you for stopping by and leaving a little sunshine in my inbox. I&apos;ll treasure this little hello!
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onSendAnother}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-background transition-all duration-200 hover:opacity-85 active:scale-95"
              >
                Send another note
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-muted transition-all duration-200 hover:bg-accent-soft hover:text-foreground active:scale-95"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="font-mono text-[9px] uppercase tracking-[.16em] text-muted">
            Following the journey
          </p>
        )}
      </motion.div>
    </div>
  );
}
