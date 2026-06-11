export function formatMoney(amount: number | string, currency = "USD") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

type MoneyInput = number | string | { toString(): string };

function toNumber(value: MoneyInput) {
  return typeof value === "number" ? value : parseFloat(value.toString());
}

export function formatBudgetRange(min: MoneyInput, max: MoneyInput, billingMode: string) {
  const suffix = billingMode === "HOURLY" ? " / hr" : "";
  return `${formatMoney(toNumber(min))} – ${formatMoney(toNumber(max))}${suffix}`;
}
