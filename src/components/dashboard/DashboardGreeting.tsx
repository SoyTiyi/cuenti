import { MapPin } from "lucide-react";

interface DashboardGreetingProps {
  userName: string;
  companyName: string;
  companyImage: string | null;
  companyAddress: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function DashboardGreeting({
  userName,
  companyName,
  companyImage,
  companyAddress,
}: DashboardGreetingProps) {
  const firstName = userName.split(" ")[0] || "Usuario";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
      {/* Company info */}
      <div className="flex items-center gap-3">
        {companyImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={companyImage}
            alt={companyName}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-primary-700">
              {(companyName || "N").charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-neutral-900 truncate">{companyName}</h1>
          {companyAddress && (
            <p className="flex items-center gap-1 text-sm text-neutral-400 truncate">
              <MapPin size={13} className="flex-shrink-0" />
              {companyAddress}
            </p>
          )}
        </div>
      </div>

      {/* Greeting */}
      <div className="sm:text-right flex-shrink-0">
        <p className="text-lg font-semibold text-neutral-700">
          {getGreeting()}, {firstName}
        </p>
        <p className="text-sm text-neutral-400 capitalize">{getFormattedDate()}</p>
      </div>
    </div>
  );
}
