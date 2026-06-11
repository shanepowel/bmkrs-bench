import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBudgetRange } from "@/lib/format";
import { formatDistanceMiles } from "@/lib/geocode";
import { routes } from "@/lib/routes";

type JobCardProps = {
  slug: string;
  title: string;
  description: string;
  budgetMin: { toString(): string };
  budgetMax: { toString(): string };
  billingMode: string;
  environment: string;
  featured?: boolean;
  urgent?: boolean;
  category?: { name: string; slug: string } | null;
  poster?: { firstName: string; lastName: string; city?: string | null; country?: string | null };
  proposalCount?: number;
  location?: { city?: string | null; country?: string | null; postcode?: string | null };
  distanceMiles?: number;
};

export function JobCard({
  slug,
  title,
  description,
  budgetMin,
  budgetMax,
  billingMode,
  environment,
  featured,
  urgent,
  category,
  poster,
  proposalCount,
  location: jobLocation,
  distanceMiles,
}: JobCardProps) {
  const locationText = [jobLocation?.postcode, jobLocation?.city, jobLocation?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="transition hover:border-blue-200 hover:shadow-md">
      <CardBody>
        <div className="mb-3 flex flex-wrap gap-2">
          {featured && <Badge variant="warning">Featured</Badge>}
          {urgent && <Badge variant="info">Urgent</Badge>}
          {category && (
            <Link href={routes.category(category.slug)}>
              <Badge variant="muted">{category.name}</Badge>
            </Link>
          )}
        </div>
        <Link
          href={routes.job(slug)}
          className="text-lg font-semibold text-slate-900 hover:text-blue-600"
        >
          {title}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-slate-900">
            {formatBudgetRange(budgetMin, budgetMax, billingMode)}
          </span>
          <span className="capitalize text-slate-500">{environment.toLowerCase()}</span>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {poster && (
            <>
              {poster.firstName} {poster.lastName}
              {proposalCount != null && ` · ${proposalCount} proposals`}
            </>
          )}
          {locationText && (
            <span className={poster ? " block" : ""}>
              {locationText}
              {distanceMiles != null && ` · ${formatDistanceMiles(distanceMiles)}`}
            </span>
          )}
        </p>
      </CardBody>
    </Card>
  );
}
