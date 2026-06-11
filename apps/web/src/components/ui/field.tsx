import { Input, Select, Textarea } from "@/components/ui/input";

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  rows?: number;
  children?: React.ReactNode;
};

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  as = "input",
  rows = 4,
  children,
}: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {as === "textarea" ? (
        <Textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className="mt-1.5"
        />
      ) : as === "select" ? (
        <Select name={name} defaultValue={defaultValue} required={required} className="mt-1.5">
          {children}
        </Select>
      ) : (
        <Input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          className="mt-1.5"
        />
      )}
    </label>
  );
}
