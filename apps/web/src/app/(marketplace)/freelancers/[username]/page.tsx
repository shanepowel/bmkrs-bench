import Link from "next/link";
import { notFound } from "next/navigation";
import { getTalentByUsername } from "@/actions/profile";
import { getTalentRatingStats } from "@/actions/reviews";
import { AvailabilityBadge } from "@/components/availability-badge";
import { ReviewsList } from "@/components/reviews-list";
import { StarRating } from "@/components/star-rating";
import { VerifiedBadge } from "@/components/verified-badge";
import { formatMoney } from "@/lib/format";
import { routes } from "@/lib/routes";

export default async function FreelancerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const talent = await getTalentByUsername(username);
  if (!talent?.talentProfile) notFound();

  const profile = talent.talentProfile;
  const location = [talent.city, talent.country].filter(Boolean).join(", ");
  const ratingStats = await getTalentRatingStats(talent.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-start gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
          {talent.firstName[0]}
          {talent.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-3xl text-slate-900">
              {talent.firstName} {talent.lastName}
            </h1>
            {profile.verified && <VerifiedBadge />}
            <AvailabilityBadge availability={profile.availability} />
          </div>
          <p className="text-slate-500">@{talent.username}</p>
          {profile.headline && <p className="mt-3 text-lg text-slate-700">{profile.headline}</p>}
          {location && <p className="mt-2 text-sm text-slate-500">{location}</p>}
          {profile.hourlyRate != null && (
            <p className="mt-2 font-semibold text-slate-900">
              {formatMoney(Number(profile.hourlyRate))}/hr
            </p>
          )}
          {ratingStats.count > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={ratingStats.average} size="md" />
              <span className="text-sm text-slate-600">
                {ratingStats.average.toFixed(1)} · {ratingStats.count}{" "}
                {ratingStats.count === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>
      </div>

      {profile.bio && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{profile.bio}</p>
        </section>
      )}

      {profile.skills.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((ts) => (
              <Link
                key={ts.skillId}
                href={routes.hire(ts.skill.slug)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {ts.skill.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {profile.portfolioItems.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Portfolio</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {profile.portfolioItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-medium text-slate-900">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                )}
                {item.projectUrl && (
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    View project →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <div className="mt-4">
          <ReviewsList reviews={talent.reviewsReceived} />
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={routes.jobs}
          className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse jobs
        </Link>
        <Link
          href={routes.talents}
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          More talent
        </Link>
      </div>
    </div>
  );
}
