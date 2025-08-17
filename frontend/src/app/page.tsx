"use client";

import { ArrowRight, BookOpen, Heart, GraduationCap } from "lucide-react";
import Image from "next/image";
import UserCard from "@/components/home/UserCard";
import LoginModal from "@/components/home/LoginModal";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getModelRecommendations } from "@/lib/api";
import Link from "next/link";

// Mock feedback text for a student
const mockFeedbackText =
  "The student is struggling with subitisation and addition facts.";

// If you later import real images, set heroSrc to the imported file's .src
const heroSrc: string | null = null;

export default function OnboardingClient() {
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<"therapist" | "student" | null>(
    null
  );
  const [recommendations, setRecommendations] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getModelRecommendations(mockFeedbackText);
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const openLogin = (type: "therapist" | "student") => {
    setLoginType(type);
    setLoginOpen(true);
  };

  const afterLogin = ({
    type,
  }: {
    email: string;
    password: string;
    type: "teacher" | "therapist" | "student";
  }) => {
    // Navigate anywhere you want after auth:
    router.push(`/onboarding/start?type=${type}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow/15 via-white to-blue/10">
      {/* Hero */}
      <section className="relative overflow-hidden border-b-8 border-black">
        <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none halftone-wash" />
        <div className="absolute inset-0 -z-10 opacity-35 pointer-events-none speed-lines" />

        {heroSrc ? (
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            className="object-cover opacity-25 -z-20"
            sizes="100vw"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 -z-20 opacity-30"
            style={{
              background: `
                radial-gradient(520px 240px at 15% 15%, var(--green) 0%, transparent 60%),
                radial-gradient(520px 240px at 85% 20%, var(--yellow) 0%, transparent 60%),
                radial-gradient(680px 280px at 50% 100%, var(--blue) 0%, transparent 65%)
              `,
            }}
          />
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-[1.1fr,0.9fr] items-center gap-8">
            <div>
              <span className="inline-block bg-yellow border-4 border-black rounded-xl px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0_#000]">
                Welcome
              </span>

              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
                Build learning adventures with{" "}
                <span className="bg-pink p-2 inline-block my-2 rounded-md border-4 border-black shadow-[6px_6px_0_#000]">
                  SuperNova
                </span>
              </h1>

              <p className="mt-4 text-lg sm:text-xl text-gray-800 max-w-2xl">
                Interactive comics for classrooms, therapy, and curious minds.
                Create stories, play learning games, and track progress—all in a
                bold, friendly space.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openLogin("student")}
                  className="text-base sm:text-lg px-6 py-4 border-4 border-black rounded-xl bg-white shadow-[6px_6px_0_#000] active:translate-y-0.5"
                >
                  Discover Your Journey <ArrowRight className="ml-2 inline" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-white border-8 border-black shadow-[16px_16px_0_#000] p-6 md:p-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green border-4 border-black rounded-2xl p-4 text-center shadow-[6px_6px_0_#000]">
                    <BookOpen className="mx-auto mb-2" />
                    <div className="text-sm font-black">Create</div>
                  </div>
                  <div className="bg-yellow border-4 border-black rounded-2xl p-4 text-center shadow-[6px_6px_0_#000]">
                    <GraduationCap className="mx-auto mb-2" />
                    <div className="text-sm font-black">Learn</div>
                  </div>
                  <div className="bg-pink border-4 border-black rounded-2xl p-4 text-center shadow-[6px_6px_0_#000]">
                    <Heart className="mx-auto mb-2" />
                    <div className="text-sm font-black">Support</div>
                  </div>
                </div>

                <p className="mt-5 text-gray-800">
                  “It feels like a comic book you can step into.” — Clinical
                  Psychologist
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User types */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12 md:mb-16">
            <span className="inline-block bg-yellow border-4 border-black rounded-xl px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0_#000]">
              Pick your guide
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
              Choose Your Path
            </h2>
            <p className="mt-2 text-lg text-gray-700 max-w-2xl mx-auto">
              Educator, therapist, or student—start with tools tuned to you.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="transform hover:-translate-y-0.5 transition">
              <UserCard
                title="Therapists & Teachers"
                description="Therapeutic storytelling meets classroom craft—plan sessions, guide learning, and reflect with ease."
                features={[
                  "Observation notes that shape AI story prompts",
                  "Adapt to a child's interests & strengths",
                  "Comic-based modules, drills, and games",
                  "Bridge therapy with at-home practice",
                  "Foster independent learning",
                ]}
                buttonText="Support Your Child Today!"
                variant="therapist"
                imageSrc={null}
                userType="therapist"
                onGetStarted={() => openLogin("therapist")}
              />
            </div>

            <div className="transform hover:-translate-y-0.5 transition">
              <UserCard
                title="Students"
                description="Jump into interactive adventures, unlock badges, and create your own stories."
                features={[
                  "Engaging comic adventures",
                  "Therapy-aligned games with adaptive tracks",
                  "Feedback and guidance from your helpers",
                ]}
                buttonText="Start Your Adventure Here!"
                variant="student"
                imageSrc={null}
                userType="student"
                onGetStarted={() => openLogin("student")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-blue/5 border-y-8 border-black">
        {/* … your existing feature cards … */}
        <div className="text-center mt-14">
          <button
            onClick={() => openLogin("student")}
            className="px-8 py-4 text-lg font-black border-4 border-black rounded-xl bg-blue text-black shadow-[8px_8px_0_#000] active:translate-y-0.5"
          >
            Get Started Free <ArrowRight className="ml-2 inline" />
          </button>
        </div>
      </section>

      {/* The modal lives at the end so it sits above everything */}
      <LoginModal
        open={loginOpen}
        type={loginType}
        onClose={() => setLoginOpen(false)}
        onSubmit={afterLogin}
      />
    </main>
  );
}
