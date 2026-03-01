import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p
          className="text-[8rem] font-extrabold leading-none bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent select-none animate-[float_3s_ease-in-out_infinite]"
        >
          404
        </p>

        <h1 className="text-lg font-semibold text-neutral-700 mt-4">
          Parece que esta página no existe
        </h1>

        <p className="text-sm text-neutral-400 mt-2 max-w-xs mx-auto">
          Puede que el enlace esté roto o que la página se haya movido.
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-8 px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors text-sm"
        >
          Ir al inicio
        </Link>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
