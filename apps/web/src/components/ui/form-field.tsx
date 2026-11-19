import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  rows?: number;
  children?: React.ReactNode;
  className?: string;
};

/** Labeled control for server-action forms. Prefer composing Field + Label + Input for new UI. */
export function FormField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  as = "input",
  rows = 4,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={name}>{label}</Label>
      {as === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          rows={rows}
        />
      ) : as === "select" ? (
        <select
          id={name}
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {children}
        </select>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

/** @deprecated Use FormField — alias for older marketplace imports. */
export { FormField as Field };
