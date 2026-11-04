import { TypingAnimation } from "@/components/ui/typing-animation";

export function Introduction() {
  return (
    <section
      id="introduction"
      className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-center items-center px-6 py-20 snap-start"
    >
      <div className="w-full max-w-3xl flex flex-col gap-6 font-sans text-[clamp(1.05rem,0.4vw+0.95rem,1.2rem)] leading-[1.75] text-foreground">

        {/* Animated Introduction Label */}
        <div className="text-muted text-xs font-mono uppercase tracking-[0.2em] mb-2">
          <TypingAnimation
            words={[
              "Designer / Developer / Curious Mind",
              "Creative Thinker / Problem Solver",
              "Exploring Design & Technology",
              "Building Ideas into Experiences",
            ]}
            typeSpeed={50}
            deleteSpeed={35}
            pauseDelay={1800}
            loop
          />
        </div>

        <p>
          I'm a creative thinker who loves exploring the space where design,
          technology, and artificial intelligence come together. I enjoy
          taking an idea, playing around with it, sketching things out,
          experimenting with designs, and seeing where it goes. Lately, I've
          also been exploring the development side, bringing my designs to
          life with code. I'm still learning and figuring things out along
          the way, but that's what makes it fun. Basically, I like being
          involved in the whole process.
        </p>

        <p>
          With a background in Artificial Intelligence and Data Science,
          I like understanding what's happening behind the screen just as
          much as what happens on it. I'm drawn to complex ideas, interesting
          problems, and finding ways to turn them into experiences that feel
          simple, intuitive, and enjoyable.
        </p>

        <p>
          I'm fascinated by what happens when creativity meets technology.
          I experiment, break things (occasionally on purpose), learn, and
          build things that make complex technology feel a little more human.
          There's always another idea brewing, and I'm usually curious enough
          to chase it.
        </p>

        <p>
          Say hi by{" "}
          <a
            href="mailto:parameswari.u@outlook.com"
            className="underline decoration-border hover:decoration-foreground hover:text-foreground transition-colors underline-offset-4"
          >
            email
          </a>
          . I'm also on{" "}
          <a
            href="https://www.linkedin.com/in/uppuluriparameswari/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-border hover:decoration-foreground hover:text-foreground transition-colors underline-offset-4"
          >
            LinkedIn
          </a>
          , and{" "}
          <a
            href="https://github.com/uppuluriparameswari/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-border hover:decoration-foreground hover:text-foreground transition-colors underline-offset-4"
          >
            GitHub.
          </a>
        </p>
      </div>
    </section>
  );
}