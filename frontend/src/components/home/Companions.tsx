import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useMemo, useState } from "react";

type XY = { x: 0 | 1 | 2; y: 0 | 1 | 2 };
type Cell = `${0 | 1},${0 | 1 | 2 | 3 | 4}`;

// Shared bubble wrapper component
function CompanionBubble({
  children,
  title,
  name,
  tagline,
  description,
  direction = "left",
  bgColor = "bg-playful-pink",
  rotation = "rotate-[-2deg]",
}: {
  children: React.ReactNode;
  title: string;
  name: string;
  tagline: string;
  description: string;
  direction?: "left" | "right";
  bgColor?: string;
  rotation?: string;
}) {
  return (
    <div className="relative w-full md:w-1/2">
      <div
        className={`comic-bubble comic-bubble-${direction} ${rotation} ${bgColor}`}
      >
        <span className="inline-block bg-puffy-yellow border-2 border-black rounded-md px-2 py-0.5 text-xs font-black puffy-shadow uppercase tracking-widest">
          {title}
        </span>
        <h3 className="mt-2 text-3xl font-black uppercase tracking-wider">
          {name}
        </h3>
        <p className="mt-2 text-lg leading-snug italic">{tagline}</p>

        {/* Speech swap */}
        <p className="mt-3 text-base font-semibold swap">
          <span className="idle">{description}</span>
          <span className="active">Ready to play?</span>
        </p>

        {/* Game content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

// Enhanced dot grid with hover effects and success animation
function DotGrid({
  pattern,
  isCorrect,
  onClick,
  isClickable = false,
  showSuccess = false,
}: {
  pattern: XY[];
  isCorrect?: boolean;
  onClick?: () => void;
  isClickable?: boolean;
  showSuccess?: boolean;
}) {
  const filled = new Set(pattern.map((p) => `${p.x},${p.y}`));

  const baseClasses =
    "grid grid-cols-3 gap-2 p-3 bg-white border-4 border-black rounded-xl shadow-[6px_6px_0_#000] transition-all duration-200";
  const interactiveClasses = isClickable
    ? "cursor-pointer hover:shadow-[8px_8px_0_#000] hover:scale-105 active:scale-95"
    : "";
  const successClasses = showSuccess
    ? "animate-pulse border-soft-green shadow-[6px_6px_0_#d9f7e6]"
    : "";
  const correctClasses =
    isCorrect === true
      ? "border-soft-green shadow-[6px_6px_0_#d9f7e6]"
      : isCorrect === false
      ? "border-red-500 shadow-[6px_6px_0_#fca5a5]"
      : "";

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${successClasses} ${correctClasses}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {[0, 1, 2].flatMap((y) =>
        [0, 1, 2].map((x) => {
          const key = `${x},${y}`;
          const on = filled.has(key);
          return (
            <div
              key={key}
              className="size-6 grid place-items-center"
              aria-hidden
            >
              <div
                className={`size-4 rounded-full border-2 border-black transition-all duration-200 ${
                  on
                    ? showSuccess
                      ? "bg-soft-green animate-pulse"
                      : "bg-squish-me-purple"
                    : "bg-transparent hover:bg-gray-100"
                }`}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

// Enhanced ten frame with color feedback
function TenFrame({
  target,
  onComplete,
}: {
  target: Cell[];
  onComplete?: (success: boolean) => void;
}) {
  const [filled, setFilled] = useState<Set<Cell>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const goal = useMemo(() => new Set(target), [target]);

  useEffect(() => {
    const isSuccess =
      filled.size === goal.size && [...goal].every((k) => filled.has(k));
    if (isSuccess && !isComplete) {
      setIsComplete(true);
      onComplete?.(true);

      // Reset after celebration
      setTimeout(() => {
        setFilled(new Set());
        setIsComplete(false);
      }, 2000);
    }
  }, [filled, goal, isComplete, onComplete]);

  return (
    <div
      className={`inline-grid grid-rows-2 grid-cols-5 gap-2 p-2 bg-white border-4 border-black rounded-xl transition-all duration-300 ${
        isComplete
          ? "shadow-[8px_8px_0_#d9f7e6] border-green animate-pulse"
          : "shadow-[8px_8px_0_#000]"
      }`}
    >
      {[0, 1].map((r) =>
        [0, 1, 2, 3, 4].map((c) => {
          const key = `${r as 0 | 1},${c as 0 | 1 | 2 | 3 | 4}` as Cell;
          const isOn = filled.has(key);
          const isTarget = goal.has(key);
          const toggle = () =>
            setFilled((s) => {
              const next = new Set(s);
              isOn ? next.delete(key) : next.add(key);
              return next;
            });

          return (
            <button
              key={key}
              onClick={toggle}
              aria-pressed={isOn}
              className={`size-10 rounded-md border-2 border-black grid place-items-center transition-all duration-200 active:scale-95 hover:scale-105 ${
                isComplete && isTarget
                  ? "bg-green animate-pulse"
                  : isOn
                  ? "bg-blue shadow-inner"
                  : isTarget
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {isOn && (
                <div
                  className={`size-6 rounded-full ${
                    isComplete && isTarget ? "bg-white" : "bg-purple"
                  } transition-all duration-200`}
                />
              )}
            </button>
          );
        })
      )}
    </div>
  );
}

// Milo bubble: flash dots → 3 choices with interactive feedback
export function MiloBubble() {
  const [flash, setFlash] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setFlash(false), 1200);
    return () => clearTimeout(id);
  }, []);

  const correct: XY[] = useMemo(
    () => [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    []
  );

  const choices: XY[][] = useMemo(
    () => [
      correct,
      [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ],
      [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    ],
    [correct]
  );

  const handleChoice = (index: number) => {
    setSelectedChoice(index);
    if (index === 0) {
      // Correct answer
      setShowSuccess(true);
      setTimeout(() => {
        setFlash(true);
        setSelectedChoice(null);
        setShowSuccess(false);
        setTimeout(() => setFlash(false), 1200);
      }, 2000);
    } else {
      setTimeout(() => setSelectedChoice(null), 1000);
    }
  };

  return (
    <CompanionBubble
      title="The Shape Magician"
      name="Milo"
      tagline="Spot it fast. Don't count."
      description="I see patterns in a blink."
      direction="left"
      bgColor="bg-playful-pink"
      rotation="rotate-[-2deg]"
    >
      <div className="flex items-center gap-3">
        {flash ? (
          <div className="relative">
            <DotGrid pattern={correct} showSuccess={showSuccess} />
            {flash && !showSuccess && (
              <div className="absolute inset-0 bg-white/80 animate-pulse rounded-xl" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {choices.map((pat, i) => (
              <div key={i} className="relative">
                <DotGrid
                  pattern={pat}
                  isClickable={selectedChoice === null}
                  isCorrect={selectedChoice === i ? i === 0 : undefined}
                  onClick={() => selectedChoice === null && handleChoice(i)}
                />
                {selectedChoice === i && i === 0 && (
                  <div className="absolute -top-2 -right-2 bg-green border-2 border-black rounded-full px-2 py-1 text-xs font-black animate-bounce">
                    ✓
                  </div>
                )}
                {selectedChoice === i && i !== 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-400 border-2 border-black rounded-full px-2 py-1 text-xs font-black animate-pulse">
                    ✗
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alt text */}
      <p className="sr-only">
        Milo, a playful guide with dotted constellations, helps you spot
        quantities at a glance. Click the matching pattern!
      </p>
    </CompanionBubble>
  );
}

// Nova bubble: click-to-fill 10-frame target
export function NovaBubble() {
  // target = 5 counters: top row 3 + bottom row 2
  const target: Cell[] = useMemo(
    () => ["0,0", "0,1", "0,2", "1,0", "1,1"] as Cell[],
    []
  );

  return (
    <CompanionBubble
      title="The Number Navigator"
      name="Nova"
      tagline="Build. Balance. Split."
      description="Let’s make sets you can feel."
      direction="right"
      bgColor="bg-soft-green"
      rotation="rotate-[1.5deg]"
    >
      <TenFrame target={target} />
      <p className="sr-only">
        Nova, a calm navigator, guides you to build and balance sets with
        counters.
      </p>
    </CompanionBubble>
  );
}

export function Companions() {
  return (
    <>
      <div className="group relative flex flex-col md:flex-row items-center justify-between gap-8 w-full max-w-6xl">
        <div className="w-full md:w-1/2 grid place-items-center">
          <DotLottieReact
            style={{ height: 360 }}
            src="https://lottie.host/536c71ba-60be-4f09-b63e-323718414390/dI92NTB0bt.lottie"
            autoplay
            loop
            aria-label="Milo animation"
          />
        </div>
        <MiloBubble />
      </div>

      <div className="group relative flex flex-col md:flex-row-reverse items-center justify-between gap-8 w-full max-w-6xl">
        <div className="w-full md:w-1/2 grid place-items-center">
          <DotLottieReact
            style={{ height: 360 }}
            src="https://lottie.host/cafba380-4f33-4c25-b919-ae313bb3c001/AknyvTPcMU.lottie"
            autoplay
            loop
            aria-label="Nova animation"
          />
        </div>
        <NovaBubble />
      </div>
    </>
  );
}
