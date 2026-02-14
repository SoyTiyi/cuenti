import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuenti - Tu negocio, más simple",
  description: "Gestiona tu negocio de forma inteligente. Controla tus ventas, clientes y deudas desde cualquier lugar.",
  icons: {
    icon: "/assets/cuenti.png",
    apple: "/assets/cuenti.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Auth0Provider>
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}