import "dotenv/config";
import {
  prisma,
  UserRole,
  PartnerStatus,
  JobStatus,
  BillingMode,
  WorkEnvironment,
  ExperienceLevel,
  ContractStatus,
  ProposalStatus,
} from "../src/index.js";
import { seedCategories } from "./seed-categories.js";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function main() {
  await seedCategories();

  const devCat = await prisma.category.findUniqueOrThrow({
    where: { slug: "development-and-it" },
  });
  const marketingCat = await prisma.category.findUniqueOrThrow({
    where: { slug: "marketing" },
  });

  const reactSkill = await prisma.skill.findUniqueOrThrow({ where: { slug: "react" } });
  const nodeSkill = await prisma.skill.findUniqueOrThrow({ where: { slug: "node-js" } });
  const seoSkill = await prisma.skill.findUniqueOrThrow({ where: { slug: "seo" } });

  const client = await prisma.user.upsert({
    where: { clerkId: "seed_client_1" },
    create: {
      clerkId: "seed_client_1",
      email: "client@demo.bmkrs.com",
      username: "acme_corp",
      firstName: "Alex",
      lastName: "Morgan",
      role: UserRole.CLIENT,
      country: "United Kingdom",
      city: "Manchester",
      postcode: "M1 1AA",
      latitude: 53.4794892,
      longitude: -2.2451148,
      clientProfile: {
        create: {
          companyName: "Acme Corp",
          companySize: "11-50",
          verified: true,
        },
      },
    },
    update: {},
    include: { clientProfile: true },
  });

  const talent = await prisma.user.upsert({
    where: { clerkId: "seed_talent_1" },
    create: {
      clerkId: "seed_talent_1",
      email: "partner@demo.bmkrs.com",
      username: "sarah_dev",
      firstName: "Sarah",
      lastName: "Chen",
      role: UserRole.TALENT,
      country: "United Kingdom",
      city: "Salford",
      postcode: "M3 4FP",
      latitude: 53.4877462,
      longitude: -2.2891921,
      talentProfile: {
        create: {
          headline: "Full-stack developer · React and Node",
          bio: "10+ years building SaaS for startups.",
          hourlyRate: 85,
          availability: "open",
          verified: true,
          partnerStatus: PartnerStatus.TRUSTED,
          dayRateBand: "£400–550/day",
          skills: {
            create: [{ skillId: reactSkill.id }, { skillId: nodeSkill.id }],
          },
        },
      },
    },
    update: {},
    include: { talentProfile: true },
  });

  await prisma.user.upsert({
    where: { clerkId: "seed_applicant_1" },
    create: {
      clerkId: "seed_applicant_1",
      email: "applicant@demo.bmkrs.com",
      username: "jordan_apply",
      firstName: "Jordan",
      lastName: "Lee",
      role: UserRole.APPLICANT,
      talentProfile: {
        create: {
          headline: "Brand strategist · positioning and messaging",
          bio: "Eight years helping product teams find the angle that makes them impossible to ignore.",
          partnerStatus: PartnerStatus.APPLIED,
          dayRateBand: "£450–550/day",
          referenceOne: "Sam Patel · Acme · sam@acme.com",
          referenceTwo: "Riley Chen · North · riley@north.co",
          skills: {
            create: [{ skillId: seoSkill.id }],
          },
        },
      },
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { clerkId: "seed_studio_1" },
    create: {
      clerkId: "seed_studio_1",
      email: "studio@bmkrs.com",
      username: "bmkrs_studio",
      firstName: "Shane",
      lastName: "Powell",
      role: UserRole.ADMIN,
    },
    update: {},
  });

  const talentProfile =
    talent.talentProfile ??
    (await prisma.talentProfile.findUnique({ where: { userId: talent.id } }));
  if (talentProfile) {
    await prisma.portfolioItem.deleteMany({ where: { talentProfileId: talentProfile.id } });
    await prisma.portfolioItem.createMany({
      data: [
        {
          talentProfileId: talentProfile.id,
          title: "SaaS dashboard redesign",
          description:
            "Led frontend architecture and shipped a React analytics dashboard for a B2B startup.",
          projectUrl: "https://example.com",
          sortOrder: 0,
        },
        {
          talentProfileId: talentProfile.id,
          title: "Marketplace MVP",
          description: "Built a two-sided marketplace with Stripe Connect and milestone payments.",
          sortOrder: 1,
        },
      ],
    });
  }

  const jobs = [
    {
      title: "Rebuild marketing site in Next.js",
      description:
        "Modern marketing site with blog and contact forms. Headless CMS experience preferred.",
      budgetMin: 3000,
      budgetMax: 6000,
      billingMode: BillingMode.FIXED,
      featured: true,
      urgent: false,
      categoryId: devCat.id,
      skillIds: [reactSkill.id, nodeSkill.id],
    },
    {
      title: "Monthly SEO retainer for local brand",
      description: "Technical audits, content briefs, and rank tracking for 15 cities.",
      budgetMin: 800,
      budgetMax: 1200,
      billingMode: BillingMode.HOURLY,
      featured: false,
      urgent: true,
      categoryId: marketingCat.id,
      skillIds: [seoSkill.id],
    },
  ];

  for (const j of jobs) {
    const slug = `${slugify(j.title)}-demo`;
    await prisma.job.upsert({
      where: { slug },
      create: {
        slug,
        posterId: client.id,
        title: j.title,
        description: j.description,
        status: JobStatus.OPEN,
        billingMode: j.billingMode,
        environment: j.title.includes("SEO") ? WorkEnvironment.HYBRID : WorkEnvironment.ONSITE,
        experienceLevel: ExperienceLevel.INTERMEDIATE,
        budgetMin: j.budgetMin,
        budgetMax: j.budgetMax,
        country: "United Kingdom",
        city: "Manchester",
        postcode: "M1 1AA",
        latitude: 53.4794892,
        longitude: -2.2451148,
        featured: j.featured,
        urgent: j.urgent,
        categoryId: j.categoryId,
        publishedAt: new Date(),
        skills: {
          create: j.skillIds.map((skillId) => ({ skillId })),
        },
      },
      update: {
        featured: j.featured,
        urgent: j.urgent,
        categoryId: j.categoryId,
      },
    });
  }

  const job = await prisma.job.findUnique({
    where: { slug: "rebuild-marketing-site-in-next-js-demo" },
  });
  if (job) {
    const proposal = await prisma.proposal.upsert({
      where: { jobId_talentId: { jobId: job.id, talentId: talent.id } },
      create: {
        jobId: job.id,
        talentId: talent.id,
        coverLetter: "I have shipped multiple Next.js marketing sites and can start this week.",
        bidAmount: 4500,
        deliveryDays: 21,
        status: ProposalStatus.ACCEPTED,
      },
      update: {},
    });

    const contract = await prisma.contract.upsert({
      where: { proposalId: proposal.id },
      create: {
        jobId: job.id,
        proposalId: proposal.id,
        clientId: client.id,
        talentId: talent.id,
        title: job.title,
        amount: 4500,
        status: ContractStatus.COMPLETED,
        startsAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      update: { status: ContractStatus.COMPLETED },
    });

    await prisma.review.upsert({
      where: { contractId: contract.id },
      create: {
        contractId: contract.id,
        reviewerId: client.id,
        revieweeId: talent.id,
        rating: 5,
        comment: "Excellent work. Delivered on time and communicated clearly throughout.",
      },
      update: {},
    });
  }

  console.log("Seed complete.");
  console.log("Demo users are Prisma-only. Create real accounts via Clerk sign-up in production.");
  console.log("Dev bypass users:");
  console.log("  Client:", client.email);
  console.log("  Talent:", talent.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
