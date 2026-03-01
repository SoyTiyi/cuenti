import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <ShieldAlert size={32} className="text-primary-500" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-neutral-900">
          No pudimos iniciar tu sesión
        </h1>

        <p className="text-sm text-neutral-500 mt-3 max-w-sm mx-auto">
          Hubo un problema al autenticarte. Intenta de nuevo o contacta a soporte si el error persiste.
        </p>

        <Link
          href="/login"
          className="inline-block mt-8 px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors text-sm"
        >
          Volver al login
        </Link>
      </div>
    </div>
  );
}
