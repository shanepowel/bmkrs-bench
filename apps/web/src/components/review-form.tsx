import { submitReview } from "@/actions/reviews";
import { StarRatingInput } from "@/components/star-rating";
import { Button } from "@/components/ui/button";

export function ReviewForm({ contractId }: { contractId: string }) {
  const action = submitReview.bind(null, contractId);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">Leave a review</h3>
      <p className="text-sm text-slate-600">Share feedback about the freelancer on this contract.</p>
      <StarRatingInput />
      <label className="block text-sm">
        <span className="font-medium">Comment (optional)</span>
        <textarea
          name="comment"
          rows={4}
          maxLength={2000}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          placeholder="What went well? Would you hire again?"
        />
      </label>
      <Button type="submit">Submit review</Button>
    </form>
  );
}
