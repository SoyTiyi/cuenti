interface ClientAvatarProps {
  name: string;
  size?: "sm" | "md";
}

export function ClientAvatar({ name, size = "md" }: ClientAvatarProps) {
  const sizeClasses = size === "sm" ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm";

  return (
    <div
      className={`${sizeClasses} rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold flex-shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
