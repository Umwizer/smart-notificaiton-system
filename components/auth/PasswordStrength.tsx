import { checkPassword } from "@/lib/password";

export default function PasswordStrength({ password }: { password: string }) {
  const check = checkPassword(password);
  
  if (!password) return null;

  const bars = [
    { valid: check.length, label: "8+ chars" },
    { valid: check.upper && check.lower, label: "Aa" },
    { valid: check.number, label: "123" },
  ];

  const colors = ["bg-red-500", "bg-amber-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-600"];
  const color = colors[check.score];

  return (
    <div className="mt-2 text-xs">
      <div className="flex gap-1 h-1.5 mb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex-1 rounded-full ${i <= check.score ? color : "bg-slate-200"}`} />
        ))}
      </div>
      <div className="flex gap-3 text-slate-500">
        {bars.map((b, i) => (
          <span key={i} className={b.valid ? "text-emerald-600 font-medium" : ""}>
            {b.valid ? "✓" : "○"} {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}