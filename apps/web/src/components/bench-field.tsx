import { cn } from "@/lib/utils";

type BenchFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  rows?: number;
  hint?: string;
  children?: React.ReactNode;
  className?: string;
};

const inputClass =
  "mt-2 w-full border border-[color:var(--surface-rule)] bg-transparent px-4 py-3 text-body text-[var(--surface-heading)] placeholder:text-[var(--surface-meta)] focus:border-[#FF4D00]";

export function BenchField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  as = "input",
  rows = 5,
  hint,
  children,
  className,
}: BenchFieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
        {label}
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={inputClass}
        />
      ) : as === "select" ? (
        <select name={name} defaultValue={defaultValue} required={required} className={inputClass}>
          {children}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {hint && <p className="mt-1.5 font-mono text-meta text-[var(--surface-meta)]">{hint}</p>}
    </label>
  );
}
