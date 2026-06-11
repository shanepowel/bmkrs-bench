import { StarRating } from "@/components/star-rating";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  reviewer: { firstName: string; lastName: string; username: string };
  contract: { title: string };
};

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-slate-500">No reviews yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-slate-900">
                {r.reviewer.firstName} {r.reviewer.lastName}
              </p>
              <p className="text-xs text-slate-500">{r.contract.title}</p>
            </div>
            <StarRating rating={r.rating} />
          </div>
          {r.comment && <p className="mt-3 text-sm text-slate-700">{r.comment}</p>}
        </li>
      ))}
    </ul>
  );
}
