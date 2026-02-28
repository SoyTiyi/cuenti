interface DashboardGreetingProps {
  userName: string;
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

export function DashboardGreeting({ userName }: DashboardGreetingProps) {
  const firstName = userName.split(" ")[0] || "Usuario";

  return (
    <div className="pt-2">
      <h1 className="text-2xl font-bold text-neutral-900">
        {getGreeting()}, {firstName}
      </h1>
      <p className="text-sm text-neutral-500 mt-1 capitalize">{getFormattedDate()}</p>
    </div>
  );
}
