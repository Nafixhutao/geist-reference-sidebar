"use client";

import { useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { Check, Eye, EyeOff, Lock } from "lucide-react";

// Brand marks are tiny inline SVGs — not worth an icon-package dependency.
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.16 7.16 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

const SOCIAL_PROVIDERS: Array<{ name: string; mark: ReactNode }> = [
  { name: "Google", mark: <GoogleMark /> },
  { name: "Apple", mark: <AppleMark /> },
  { name: "GitHub", mark: <GitHubMark /> },
];

// Static class strings stay at module level so nothing is rebuilt per render.
const secondaryButton =
  "flex h-10 items-center justify-center gap-2 rounded-lg border border-[#34343b] bg-[#17171a] text-[13.5px] font-medium text-[#f2f2f3] transition-colors hover:border-[#44444c] hover:bg-[#1d1d21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f7ff0]";
const inputClass =
  "h-10 w-full rounded-lg border border-[#34343b] bg-[#1a1a1d] px-3.5 text-[14px] text-white outline-none transition-colors placeholder:text-[#6b6b72] focus:border-[#4f7ff0] focus-visible:outline-none";
const linkClass = "font-medium text-[#4d8dff] underline underline-offset-2 hover:text-[#7fabff]";

const preventPlaceholderNav = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault();

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // Mock sign-in; replace with a real auth call when a backend exists.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#0c0c0d] px-4 py-14 font-sans text-white">
      <div className="w-full max-w-[364px]">
        <h1 className="text-center text-2xl font-bold leading-8 tracking-[-0.01em]">Sign in to Cloudflare</h1>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {SOCIAL_PROVIDERS.map((provider) => (
            <button key={provider.name} type="button" className={secondaryButton}>
              {provider.mark}
              {provider.name}
            </button>
          ))}
        </div>

        <button type="button" className={`${secondaryButton} mt-2.5 w-full`}>
          <Lock size={14} strokeWidth={2} aria-hidden="true" />
          Continue with SSO
        </button>

        <div className="my-5 flex items-center gap-3 text-[11px] font-medium tracking-[0.08em] text-[#8b8b92]">
          <span className="h-px flex-1 bg-[#26262b]" />
          OR
          <span className="h-px flex-1 bg-[#26262b]" />
        </div>

        <form onSubmit={handleSubmit} noValidate={false}>
          <label htmlFor="login-email" className="mb-1.5 block text-[13.5px] font-semibold leading-4">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />

          <label htmlFor="login-password" className="mb-1.5 mt-4 block text-[13.5px] font-semibold leading-4">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#9a9aa2] transition-colors hover:text-white"
            >
              {showPassword ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
            </button>
          </div>

          <label className="mt-6 flex cursor-pointer select-none items-center gap-2.5 text-[13.5px] leading-4">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 border-[#57575f] bg-transparent transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4f7ff0] peer-checked:border-[#e8e8ec]"
            >
              {remember ? <Check size={13} strokeWidth={3} className="text-white" /> : null}
            </span>
            Save email and login method on this device
          </label>

          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="mt-6 h-10 w-full rounded-lg bg-[#2563eb] text-[14px] font-semibold text-white transition-colors hover:bg-[#3b7cf8] disabled:cursor-default disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f7ff0]"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-[13.5px] leading-5 text-[#b3b3ba]">
          Don&apos;t have an account?{" "}
          <a href="#" onClick={preventPlaceholderNav} className={linkClass}>
            Sign up
          </a>
        </p>
        <p className="mt-1 text-center text-[13.5px] leading-5 text-[#b3b3ba]">
          Forgot your{" "}
          <a href="#" onClick={preventPlaceholderNav} className={linkClass}>
            email
          </a>{" "}
          or{" "}
          <a href="#" onClick={preventPlaceholderNav} className={linkClass}>
            password
          </a>
          ?
        </p>

        <p className="mt-10 text-center text-[12.5px] leading-[18px] text-[#8b8b92]">
          By continuing, I agree to Cloudflare&apos;s{" "}
          <a href="#" onClick={preventPlaceholderNav} className="underline hover:text-white">
            terms
          </a>
          ,{" "}
          <a href="#" onClick={preventPlaceholderNav} className="underline hover:text-white">
            privacy policy
          </a>{" "}
          and{" "}
          <a href="#" onClick={preventPlaceholderNav} className="underline hover:text-white">
            cookie policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
