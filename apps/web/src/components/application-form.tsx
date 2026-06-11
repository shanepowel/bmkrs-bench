import { submitApplication } from "@/actions/application";
import { listSkills } from "@/actions/skills";
import { ApplicationPortfolioPanel } from "@/components/application-portfolio-panel";
import { BenchField } from "@/components/bench-field";
import { Body } from "@/components/surfaces";
import { DAY_RATE_BANDS } from "@/lib/pipeline";
type ApplicationFormProps = {
  firstName: string;
  lastName: string;
  headline?: string | null;
  bio?: string | null;
  dayRateBand?: string | null;
  referenceOne?: string | null;
  referenceTwo?: string | null;
  selectedSkillIds: string[];
  submittedAt?: Date | null;
};

function DisciplinePicker({
  skills,
  selectedIds,
}: {
  skills: { id: string; name: string; slug: string }[];
  selectedIds: string[];
}) {
  return (
    <fieldset>
      <legend className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
        disciplines
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <label
            key={skill.id}
            className="cursor-pointer border border-[color:var(--surface-rule)] px-3 py-2 font-mono text-meta text-[var(--surface-body)] has-[:checked]:border-[#FF4D00] has-[:checked]:text-[var(--surface-heading)]"
          >
            <input
              type="checkbox"
              name="skillIds"
              value={skill.id}
              defaultChecked={selectedIds.includes(skill.id)}
              className="sr-only"
            />
            {skill.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export async function ApplicationForm(props: ApplicationFormProps) {
  const skills = await listSkills();

  return (
    <div className="col-span-12 space-y-8 lg:col-span-8">
      {props.submittedAt && (
        <Body className="text-[var(--surface-meta)]">
          submitted{" "}
          {props.submittedAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          . the studio will respond, usually the same week.
        </Body>
      )}

      <form action={submitApplication} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <BenchField label="first name" name="firstName" defaultValue={props.firstName} required />
          <BenchField label="last name" name="lastName" defaultValue={props.lastName} required />
        </div>
        <BenchField
          label="headline"
          name="headline"
          defaultValue={props.headline ?? ""}
          required
          placeholder="motion designer · product launches and brand films"
          hint="one line, no buzzwords"
        />
        <BenchField
          label="bio"
          name="bio"
          as="textarea"
          defaultValue={props.bio ?? ""}
          required
          placeholder="what you do, who you have done it for, how you work"
          hint="40 characters minimum. plain language."
        />
        <BenchField
          label="day rate band"
          name="dayRateBand"
          as="select"
          defaultValue={props.dayRateBand ?? ""}
          required
        >
          <option value="">select a band</option>
          {DAY_RATE_BANDS.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </BenchField>
        <DisciplinePicker skills={skills} selectedIds={props.selectedSkillIds} />
        <div className="grid gap-6 sm:grid-cols-2">
          <BenchField
            label="reference one"
            name="referenceOne"
            defaultValue={props.referenceOne ?? ""}
            required
            placeholder="name · company · email"
          />
          <BenchField
            label="reference two"
            name="referenceTwo"
            defaultValue={props.referenceTwo ?? ""}
            required
            placeholder="name · company · email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#FF4D00] px-6 py-3.5 text-body font-medium text-[#181613] transition hover:opacity-90 sm:w-auto"
        >
          submit application
        </button>
      </form>

      <ApplicationPortfolioPanel />
    </div>
  );
}
