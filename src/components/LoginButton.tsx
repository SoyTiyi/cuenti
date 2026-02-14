"use client";

export default function LoginButton() {
  return (
    <a
      href="/auth/login"
      className="flex items-center gap-3 w-full px-5 py-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#635BFF" />
        <path d="M7 8h10M7 12h6M7 16h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-sm font-medium text-neutral-700 mx-auto">Continuar con Auth0</span>
    </a>
  );
}
