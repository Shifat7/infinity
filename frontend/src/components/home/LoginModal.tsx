"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, GraduationCap, Heart, X } from "lucide-react";
import { useRouter } from "next/navigation";

type UserType = "therapist" | "student";

export default function LoginModal({
  open,
  type,
  onClose,
  onSubmit, // optional callback when login succeeds
}: {
  open: boolean;
  type: UserType | null;
  onClose: () => void;
  onSubmit?: (payload: {
    email: string;
    password: string;
    type: UserType;
  }) => void;
}) {
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // lock scroll + focus email + ESC to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => emailRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open || !type) return null;

  const map = {
    therapist: {
      title: "Therapist Login",
      Icon: Heart,
      ring: "ring-rose-300/50",
      text: "text-rose-800",
      path: "/therapist",
    },
    student: {
      title: "Student Login",
      Icon: GraduationCap,
      ring: "ring-sky-300/50",
      text: "text-sky-800",
      path: "/student",
    },
  } as const;

  const { title, Icon, ring, text, path } = map[type];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password, type });

    router.push(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Card */}
      <div
        className={[
          "relative w-full max-w-xl bg-white rounded-3xl",
          "border-8 border-black shadow-[18px_18px_0_#000]",
          "ring-8",
          ring,
        ].join(" ")}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-grid place-items-center size-9 rounded-full border-2 border-black bg-white shadow-[3px_3px_0_#000] active:translate-y-0.5"
          aria-label="Close login"
        >
          <X />
        </button>

        <form onSubmit={submit} className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-6 mb-4">
            <div className="inline-grid place-items-center size-12 rounded-full bg-white border-4 border-black shadow-[6px_6px_0_#000]">
              <Icon className={text} />
            </div>
            <h2 id="login-title" className={`text-3xl font-black ${text}`}>
              {title}
            </h2>
          </div>

          <p className="text-gray-700 mb-6">
            Welcome back! Ready to continue your comic adventure?
          </p>

          {/* Fields */}
          <label className="block font-bold text-green-900 mb-1">Email</label>
          <input
            ref={emailRef}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-xl border-4 border-black px-4 py-3 bg-white outline-none shadow-[4px_4px_0_#000] mb-4"
          />

          <label className="block font-bold text-green-900 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-4 border-black px-4 py-3 bg-white outline-none shadow-[4px_4px_0_#000]"
          />

          {/* Actions */}
          <button
            type="submit"
            className="mt-6 w-full inline-flex items-center justify-center px-6 py-4 rounded-xl border-4 border-black cta-chip font-black shadow-[8px_8px_0_#000] active:translate-y-0.5"
          >
            Enter SuperNova <ArrowRight className="ml-2" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mx-auto mt-4 block text-gray-700 font-semibold underline cursor-pointer decoration-2 underline-offset-4"
          >
            ← Choose Different Path
          </button>

          <div className="text-center mt-8 text-gray-800">
            New to SuperNova?{" "}
            <span
              className={`font-bold underline decoration-2 underline-offset-4 cursor-not-allowed ${text}`}
              title="Coming soon"
            >
              Create an account
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
