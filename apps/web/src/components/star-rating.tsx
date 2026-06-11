import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  max = 5,
  size = "sm",
  className,
}: {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const sizeClass = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <svg
            key={i}
            className={cn(sizeClass, filled ? "text-amber-400" : "text-slate-200")}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

export function StarRatingInput({ name = "rating", defaultValue = 5 }: { name?: string; defaultValue?: number }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Rating</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={n}
              defaultChecked={n === defaultValue}
              className="peer sr-only"
            />
            <span className="block rounded p-1 text-2xl text-slate-300 peer-checked:text-amber-400 hover:text-amber-300">
              ★
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
