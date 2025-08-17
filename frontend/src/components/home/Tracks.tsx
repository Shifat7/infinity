import React, { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LanternAlleyGraphic,
  KeepersClueGraphic,
  GateOfJarsGraphic,
  BlueprintBenchGraphic,
  WobblyBridgeCartGraphic,
  SplitDecisionGraphic,
} from "./Graphics";

// Comic-style track display with mobile carousel and desktop grid layout
export function Tracks() {
  const issues = useMemo(() => buildIssues(), []);
  return (
    <section className="w-full max-w-7xl px-4 md:px-6">
      {issues.map((issue, idx) => (
        <ComicIssue key={issue.id} index={idx} {...issue} />
      ))}
    </section>
  );
}

// Issue wrapper with header, panels, and CTA
function ComicIssue({
  id,
  label,
  title,
  ctaHref,
  ctaText,
  panels,
}: IssueSpec & { index: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Mobile scroll navigation
  const scrollTo = (i: number) => {
    const el = trackRef.current?.querySelector<HTMLElement>(
      `[data-panel='${i}']`
    );
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!trackRef.current) return;
    const children = Array.from(
      trackRef.current.querySelectorAll<HTMLElement>("[data-panel]")
    );
    if (!children.length) return;
    const mid = Math.round(
      trackRef.current.scrollLeft + trackRef.current.clientWidth / 2
    );
    const idx = children.findIndex(
      (c) => c.offsetLeft <= mid && c.offsetLeft + c.clientWidth >= mid
    );
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollTo(Math.min(children.length - 1, idx < 0 ? 0 : idx + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollTo(Math.max(0, idx < 0 ? 0 : idx - 1));
    }
  };
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mb-16">
      {/* Header: label, title, share button */}
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="uppercase tracking-[0.25em] opacity-80">{label}</p>
          <h3
            id={`${id}-title`}
            className="text-2xl my-4 font-black uppercase tracking-widest"
          >
            {title}
          </h3>
        </div>
        <ShareButtons title={title} anchor={`#${id}`} />
      </header>
      {/* Panel carousel (mobile) / grid (desktop) */}
      <div
        ref={trackRef}
        role="list"
        aria-roledescription="carousel"
        aria-label={`${title} panels`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 md:grid md:overflow-visible md:gap-8 md:[grid-auto-rows:minmax(260px,auto)] md:grid-cols-3"
      >
        {panels.map((p, i) => (
          <PanelCard
            key={i}
            index={i}
            {...p}
            isLast={i === panels.length - 1}
            ctaHref={ctaHref}
            ctaText={ctaText}
          />
        ))}
      </div>
      {/* Navigation dots (mobile only) */}
      <div className="mt-3 flex items-center justify-center gap-2 md:hidden">
        {panels.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to panel ${i + 1}`}
            onClick={() => scrollTo(i)}
            className="size-2 rounded-full border border-black data-[on=true]:bg-black"
            data-on={i === 0}
          />
        ))}
      </div>
    </section>
  );
}

// Panel card with hover effects and caption
function PanelCard({
  index,
  title,
  caption,
  speaker,
  line,
  cue,
  Graphic,
  tone,
  isLast,
  ctaHref,
  ctaText,
}: PanelSpec & {
  index: number;
  isLast?: boolean;
  ctaHref?: string;
  ctaText?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      role="listitem"
      data-panel={index}
      initial={reduce ? false : { y: 8, opacity: 0 }}
      whileInView={reduce ? {} : { y: 0, opacity: 1 }}
      viewport={{ amount: 0.4, once: true }}
      whileHover={reduce ? {} : { y: -4, rotate: -1, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className={[
        "group panel p-4 min-w-[86%] snap-center md:min-w-0",
        `${index === 2 ? "bd-yellow" : ""}`,
      ].join(" ")}
    >
      <div className="text-lg font-extrabold uppercase tracking-wide">
        {title}
      </div>
      <figure className="mt-4">
        <Graphic />
        <figcaption className="mt-6 leading-snug">
          <div className="font-bold">Caption:</div>
          <p>{caption}</p>
          {speaker && (
            <>
              <div className="mt-2 italic font-semibold">{speaker}:</div>
              <p className="relative">
                <span>{line}</span>
                {/* Glow effect on hover */}
                <span className="pointer-events-none absolute -inset-1 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-20 group-focus-within:opacity-20 shadow-[0_0_0_8px_rgba(255,255,255,0.6)]" />
              </p>
            </>
          )}
          <div className="mt-2 opacity-80">Scene cue:</div>
          <p>{cue}</p>
          {/* CTA for last panel */}
          {isLast && ctaHref && ctaText && (
            <div className="mt-6 flex justify-center">
              <a
                href={ctaHref}
                className="cta-chip animate-bounce"
                aria-label={ctaText}
                tabIndex={0}
              >
                {ctaText}
              </a>
            </div>
          )}
        </figcaption>
      </figure>
    </motion.article>
  );
}

// Share button with native API fallback
function ShareButtons({ title, anchor }: { title: string; anchor: string }) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}${anchor}`
      : anchor;
  const share = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(url);
        toast("Link copied ✓");
      }
    } catch {}
  };
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={share}
        className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-wide shadow-[3px_3px_0_#000] active:translate-x-[1px] active:translate-y-[1px]"
      >
        <span>Share</span>
      </button>
    </div>
  );
}

// Toast notification helper
function toast(msg: string) {
  if (typeof window === "undefined") return;
  const id = "tracks-toast";
  const old = document.getElementById(id);
  if (old) old.remove();
  const el = document.createElement("div");
  el.id = id;
  el.textContent = msg;
  el.className =
    "fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-black bg-puffy-yellow px-3 py-1 text-xs font-black shadow-[4px_4px_0_#000]";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

// Issue and panel data
function buildIssues(): IssueSpec[] {
  const issue1: IssueSpec = {
    id: "issue-1",
    label: "comic 01",
    title: "Issue #1 — The Firefly Map • Milo",
    ctaHref: "/games/subitisation",
    ctaText: "Next page: Step into the tent →",
    panels: [
      {
        title: "Panel 1 — Lantern Alley",
        caption: "Night market. Map glows!",
        speaker: "Milo",
        line: "Treasure lights! Follow the clumps!",
        cue: "Lantern strings pop in small clumps over a frayed map scrap. Blink—shine!",
        Graphic: LanternAlleyGraphic,
        tone: "pink",
      },
      {
        title: "Panel 2 — The Keeper’s Clue",
        caption: "Two curtains. Same sparkle. New shapes.",
        speaker: "Keeper",
        line: "Match the glow. Door opens!",
        cue: "Behind the gauze, two shines. Same glow, new spots. Peek—pick the twin!",
        Graphic: KeepersClueGraphic,
        tone: "blue",
      },
      {
        title: "Panel 3 — Gate of Jars",
        caption: "Tent opens a sliver. Rune blinks.",
        speaker: "Milo",
        line: "Quick look. Step true!",
        cue: "Jars shimmer along a tiny trail mark. The rune blinks once—GO!",
        Graphic: GateOfJarsGraphic,
        tone: "pink",
      },
    ],
  };

  const issue2: IssueSpec = {
    id: "issue-2",
    label: "comic 02",
    title: "Issue #2 — The Workshop Cart • Nova",
    ctaHref: "/games/manipulatives",
    ctaText: "Next page: Enter the build lab →",
    panels: [
      {
        title: "Panel 1 — Blueprint Bench",
        caption: "Crest sketch on the bench.",
        speaker: "Nova",
        line: "Build the picture. Then roll!",
        cue: "A pattern card and a chalk tray outline wait. Big counters clink—place them!",
        Graphic: BlueprintBenchGraphic,
        tone: "green",
      },
      {
        title: "Panel 2 — Wobbly Bridge Cart",
        caption: "Bridge wobbles. Left dips.",
        speaker: "Mechanic",
        line: "Make it even. Then go!",
        cue: "The plank tilts left. Slide the crates. Level it!",
        Graphic: WobblyBridgeCartGraphic,
        tone: "blue",
      },
      {
        title: "Panel 3 — The Split Decision",
        caption: "Two bags. One chest. Dawn soon.",
        speaker: "Nova",
        line: "Share it fair. Move out!",
        cue: "Two soft bags and a glowing chest. Split the load. Cart ready!",
        Graphic: SplitDecisionGraphic,
        tone: "green",
      },
    ],
  };

  return [issue1, issue2];
}

type IssueSpec = {
  id: string;
  label: string;
  title: string;
  ctaHref: string;
  ctaText: string;
  panels: PanelSpec[];
};

type PanelSpec = {
  title: string;
  caption: string;
  speaker?: string;
  line?: string;
  cue: string;
  Graphic: React.FC;
  tone: "pink" | "blue" | "green";
};
