"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserCardProps {
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  variant: "teacher" | "therapist" | "student";
  imageSrc: string | null; // <- string or null (no undefined)
  userType: "teacher" | "therapist" | "student";
  onGetStarted?: () => void; // optional; will fallback to router
}

const variants: Record<
  UserCardProps["variant"],
  { gradient: string; bullet: string; button: string }
> = {
  teacher: {
    gradient: "bg-gradient-to-br from-yellow-300 to-orange-400",
    bullet: "bg-yellow-400",
    button: "bg-yellow-300 hover:brightness-95",
  },
  therapist: {
    gradient: "bg-gradient-to-br from-rose-300 to-pink-400",
    bullet: "bg-rose-400",
    button: "bg-pink-300 hover:brightness-95",
  },
  student: {
    gradient: "bg-gradient-to-br from-sky-300 to-indigo-400",
    bullet: "bg-sky-400",
    button: "bg-sky-300 hover:brightness-95",
  },
};

export default function UserCard({
  title,
  description,
  features,
  buttonText,
  variant,
  imageSrc,
  userType,
  onGetStarted,
}: UserCardProps) {
  const styles = variants[variant];
  const router = useRouter();

  const handleClick = () => {
    if (onGetStarted) return onGetStarted();
    router.push(`/onboarding/start?type=${userType}`);
  };

  const initial = title?.charAt(0)?.toUpperCase() || "?";

  return (
    <article
      className={[
        "relative group h-full overflow-hidden",
        "rounded-3xl border-4 border-black bg-white",
        "shadow-[12px_12px_0_#000] transition-transform",
        "hover:-translate-y-0.5",
        "flex flex-col",
      ].join(" ")}
    >
      <header className="text-center px-6 pt-8">
        <figure
          className={[
            "mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden",
            "border-4 border-black shadow-[6px_6px_0_#000]",
            "grid place-items-center bg-white",
          ].join(" ")}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${title} avatar`}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority={false}
            />
          ) : (
            // Fallback: initial in a colored disc
            <div
              className={[
                "w-full h-full grid place-items-center bg-container-blue/20",
                styles.gradient,
              ].join(" ")}
            >
              <span className="text-3xl font-black">{initial}</span>
            </div>
          )}
        </figure>

        <h3 className="text-2xl font-black tracking-wide">{title}</h3>
        <p className="mt-2 text-base text-gray-700">{description}</p>
      </header>

      <div className="p-6 flex flex-col grow">
        <ul className="space-y-3 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={[
                  "mt-1.5 h-3 w-3 rounded-full border-2 border-black flex-shrink-0",
                  styles.bullet,
                ].join(" ")}
                aria-hidden
              />
              <span className="text-sm text-gray-800">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleClick}
          className={[
            "mt-6 w-full inline-flex items-center justify-center",
            "px-5 py-3 rounded-xl border-4 border-black",
            "font-black uppercase tracking-wide",
            "shadow-[8px_8px_0_#000] active:translate-y-0.5",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/40",
            "cta-chip",
            styles.button,
          ].join(" ")}
          aria-label={`${buttonText} – ${title}`}
        >
          {buttonText}
        </button>
      </div>
    </article>
  );
}
