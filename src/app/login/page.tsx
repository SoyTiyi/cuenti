import LoginButton from "@/components/LoginButton";
import Image from "next/image";
import { LockKeyhole, Zap } from "lucide-react";

const LoginPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-primary-50 via-white to-primary-400 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full rounded-2xl overflow-hidden shadow-xl">
                <div className="relative flex flex-col justify-between bg-gradient-to-br from-primary-500 to-secondary-500 p-10 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full" />

                    <div>
                        <Image
                            src="/assets/cuenti.png"
                            alt="Cuenti"
                            width={48}
                            height={48}
                            className="rounded-xl mb-8 shadow-lg"
                        />

                        <h2 className="text-3xl font-extrabold leading-tight mb-4">
                            Tu negocio,
                            <br />
                            más simple.
                        </h2>

                        <p className="text-white/80 text-sm leading-relaxed">
                            Controla tus ventas, clientes y deudas
                            <br />
                            desde cualquier lugar.
                        </p>
                    </div>

                    <Image
                        src="/assets/login_image.png"
                        alt="Dashboard preview"
                        width={400}
                        height={280}
                        className="rounded-lg mt-8 shadow-2xl"
                    />
                </div>

                <div className="flex flex-col justify-center bg-white p-10">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        Bienvenido a Cuenti
                    </h2>

                    <p className="text-neutral-500 text-sm mb-8">
                        Gestiona tu negocio de forma inteligente
                    </p>

                    <LoginButton />

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-neutral-200" />
                        <span className="text-xs text-neutral-400">Acceso seguro</span>
                        <div className="flex-1 h-px bg-neutral-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="flex flex-col items-center gap-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                            <LockKeyhole className="w-5 h-5 text-primary-500" />
                            <span className="text-xs text-neutral-600 font-medium">Datos Encriptados</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                            <Zap className="w-5 h-5 text-primary-500" />
                            <span className="text-xs text-neutral-600 font-medium">Acceso Rápido</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
