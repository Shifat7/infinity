"use client";

import { Companions } from "@/components/home/Companions";
import { Hero } from "@/components/home/Hero";
import { Tracks } from "@/components/home/Tracks";

export default function Home() {
  const colorWash = (
    <div
      className="absolute inset-0 -z-10 pointer-events-none opacity-55"
      style={{
        background: `
            radial-gradient(440px 220px at 12% 10%, var(--container-blue) 0%, transparent 60%),
            radial-gradient(500px 260px at 88% 24%, var(--playful-pink) 0%, transparent 60%),
            radial-gradient(640px 280px at 50% 98%, var(--soft-green) 0%, transparent 65%)
          `,
      }}
    />
  );

  const hero = <Hero />;
  const companions = (
    <section className="relative flex flex-col gap-12 items-center justify-center py-16 w-full overflow-hidden">
      {/* Section color wash */}
      {colorWash}
      <div
        className="inked inked-outline palette-loop text-center text-4xl md:text-5xl uppercase tracking-wide"
        style={{ ["--ink-x" as any]: "8px", ["--ink-y" as any]: "8px" }}
      >
        Meet Your Companions
      </div>

      <Companions />
    </section>
  );
  const tracks = (
    <section className="relative w-full flex items-center justify-center overflow-hidden">
      {colorWash}
      <Tracks />
    </section>
  );

  return (
    <main className="flex min-h-screen flex-col items-center">
      {hero}
      {companions}
      {tracks}
    </main>
  );
}
