import { auth0 } from "@/lib/auth0";
import { userService } from "@/service/UserService";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  Clock,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export default async function PendingActivationPage() {
  // Validate session
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await userService.getUserByEmail(session.user.email || "");

  // If user is active, redirect away from this page
  if (dbUser?.isActive) {
    if (dbUser.needsOnboarding) {
      redirect("/onboarding");
    } else {
      redirect("/dashboard");
    }
  }

  // Build WhatsApp URL
  const userName = dbUser?.name || session.user.name || "Usuario";
  const userEmail = session.user.email || "";
  const whatsappNumber = process.env.WHATSAPP_SUPPORT_NUMBER || "";
  const message = `Hola, soy ${userName} (${userEmail}). He completado el registro en Cuenti y me gustaría activar mi cuenta para comenzar a usar la plataforma. ¡Gracias!`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-primary-50 via-white to-primary-400 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Column - Gradient Background */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-primary-500 to-secondary-500 p-10 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-tr-full" />

          <div className="relative z-10">
            <Image
              src="/assets/cuenti.png"
              alt="Cuenti"
              width={48}
              height={48}
              className="rounded-xl mb-8 shadow-lg"
            />

            <h1 className="text-3xl font-extrabold leading-tight mb-4">
              ¡Bienvenido a Cuenti,
              <br />
              {userName}!
            </h1>

            <p className="text-white/90 text-base leading-relaxed mb-8">
              Tu cuenta está siendo verificada.
              <br />
              Pronto podrás disfrutar de todas las herramientas.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Control Total</p>
                  <p className="text-sm text-white/80">
                    Gestiona ventas, gastos y clientes en un solo lugar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Datos Seguros</p>
                  <p className="text-sm text-white/80">
                    Tu información protegida con encriptación de nivel bancario
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Acceso Móvil</p>
                  <p className="text-sm text-white/80">
                    Trabaja desde cualquier dispositivo, en cualquier momento
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Reportes Inteligentes</p>
                  <p className="text-sm text-white/80">
                    Analítica automática para decisiones más rápidas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-white/70 mb-2">
                ¿Ya tienes cuenta activa?
              </p>
              <a
                href="/auth/logout"
                className="text-sm font-semibold underline hover:text-white/80 transition-colors"
              >
                Cerrar sesión e intentar con otra cuenta
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - White Background */}
        <div className="flex flex-col justify-center bg-white p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Cuenta Pendiente
                </h2>
                <p className="text-sm text-neutral-500">
                  Activación en proceso
                </p>
              </div>
            </div>

            <p className="text-neutral-600 leading-relaxed">
              Tu cuenta ha sido creada exitosamente. Para comenzar a usar
              Cuenti, necesitamos verificar tu información. Este proceso toma
              menos de 24 horas.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">
              ¿Qué puedes hacer mientras esperas?
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-neutral-700">
                  Revisa tu email de confirmación
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-neutral-700">
                  Prepara la información de tu negocio
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-neutral-700">
                  Descarga la app en tu móvil
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contactar por WhatsApp</span>
            </a>

            <p className="text-center text-xs text-neutral-400">
              Respuesta promedio en menos de 2 horas
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 text-center">
              ¿Necesitas ayuda?{" "}
              <a
                href="mailto:soporte@cuenti.com"
                className="text-primary-500 underline hover:text-primary-600"
              >
                soporte@cuenti.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
