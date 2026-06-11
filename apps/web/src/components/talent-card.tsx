import Link from "next/link";
import { AvailabilityBadge } from "@/components/availability-badge";
import { StarRating } from "@/components/star-rating";
import { VerifiedBadge } from "@/components/verified-badge";
import { Card, CardBody } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { formatDistanceMiles } from "@/lib/geocode";
import { routes } from "@/lib/routes";

type TalentCardProps = {
  username: string;
  firstName: string;
  lastName: string;
  headline?: string | null;
  hourlyRate?: { toString(): string } | null;
  availability?: string | null;
  verified?: boolean;
  skills?: { skill: { name: string; slug: string } }[];
  averageRating?: number;
  reviewCount?: number;
  city?: string | null;
  postcode?: string | null;
  distanceMiles?: number;
};

export function TalentCard({
  username,
  firstName,
  lastName,
  headline,
  hourlyRate,
  availability,
  verified,
  skills = [],
  averageRating = 0,
  reviewCount = 0,
  city,
  postcode,
  distanceMiles,
}: TalentCardProps) {
  const location = [postcode, city].filter(Boolean).join(", ");
  return (
    <Card className="transition hover:border-blue-200 hover:shadow-md">
      <CardBody>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {firstName[0]}
            {lastName[0]}
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            {verified && <VerifiedBadge />}
            <AvailabilityBadge availability={availability} />
          </div>
        </div>

        <Link
          href={routes.freelancer(username)}
          className="mt-4 block font-semibold text-slate-900 hover:text-blue-600"
        >
          {firstName} {lastName}
        </Link>
        <p className="text-sm text-slate-500">@{username}</p>

        {reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <StarRating rating={averageRating} />
            <span className="text-slate-500">
              {averageRating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        {location && (
          <p className="mt-2 text-xs text-slate-500">
            {location}
            {distanceMiles != null && ` · ${formatDistanceMiles(distanceMiles)}`}
          </p>
        )}

        {headline && <p className="mt-2 line-clamp-2 text-sm text-slate-700">{headline}</p>}

        {hourlyRate != null && (
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {formatMoney(Number(hourlyRate))}/hr
          </p>
        )}

        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {skills.slice(0, 4).map((ts) => (
              <Link
                key={ts.skill.slug}
                href={routes.hire(ts.skill.slug)}
                className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {ts.skill.name}
              </Link>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
