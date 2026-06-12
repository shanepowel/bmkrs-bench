import { listTalents } from "@/actions/talents";
import { TalentCard } from "@/components/talent-card";
import { TalentFilters } from "@/components/talent-filters";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";

export default async function TalentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const talents = await listTalents({
    q: sp.q,
    skill: sp.skill,
    availability: sp.availability,
    minRate: sp.minRate ? Number(sp.minRate) : undefined,
    maxRate: sp.maxRate ? Number(sp.maxRate) : undefined,
    nearPostcode: sp.nearPostcode,
    radiusMiles: sp.radiusMiles ? Number(sp.radiusMiles) : undefined,
  });

  return (
    <PageShell title="Find talent" description="Verified freelancers on the platform" width="full">
      <TalentFilters searchParams={sp} />

      <p className="mt-6 text-sm text-slate-500">
        {talents.length} {talents.length === 1 ? "freelancer" : "freelancers"}
      </p>

      {talents.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No talent matches your filters"
            description="Try broadening your search or browse all freelancers."
            action={{ label: "View all talent", href: routes.talents }}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {talents.map((t) => {
            const ratings = t.reviewsReceived;
            const reviewCount = ratings.length;
            const averageRating =
              reviewCount > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                : 0;

            return (
              <TalentCard
                key={t.id}
                username={t.username}
                firstName={t.firstName}
                lastName={t.lastName}
                headline={t.talentProfile?.headline}
                hourlyRate={t.talentProfile?.hourlyRate}
                availability={t.talentProfile?.availability}
                verified={t.talentProfile?.verified}
                skills={t.talentProfile?.skills}
                averageRating={averageRating}
                reviewCount={reviewCount}
                city={t.city}
                postcode={t.postcode}
                distanceMiles={t.distanceMiles}
              />
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
