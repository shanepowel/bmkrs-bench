/**
 * Categories and skills taxonomy for Freelance Near Me.
 *
 * isLocal flags categories that are inherently delivered in person. Use it to prioritise local
 * categories in the UI and to drive location landing pages (E8-S6).
 */

import { prisma } from "../src/index.js";

export type SkillSeed = { slug: string; name: string };

export type CategorySeed = {
  slug: string;
  name: string;
  description: string;
  isLocal: boolean;
  skills: SkillSeed[];
};

export const categoryTaxonomy: CategorySeed[] = [
  {
    slug: "development-and-it",
    name: "Development and IT",
    description:
      "Engineers and technologists who build, ship, and maintain software, sites, and infrastructure.",
    isLocal: false,
    skills: [
      { slug: "web-development", name: "Web Development" },
      { slug: "frontend-development", name: "Frontend Development" },
      { slug: "backend-development", name: "Backend Development" },
      { slug: "full-stack-development", name: "Full-stack Development" },
      { slug: "react", name: "React" },
      { slug: "node-js", name: "Node.js" },
      { slug: "react-native", name: "React Native" },
      { slug: "mobile-development", name: "Mobile Development" },
      { slug: "devops-and-cloud", name: "DevOps and Cloud" },
      { slug: "qa-and-testing", name: "QA and Testing" },
      { slug: "ai-and-data", name: "AI and Data" },
      { slug: "wordpress-and-cms", name: "WordPress and CMS" },
      { slug: "e-commerce-development", name: "E-commerce Development" },
    ],
  },
  {
    slug: "design-and-creative",
    name: "Design and Creative",
    description: "Designers who shape how products and brands look, feel, and work.",
    isLocal: false,
    skills: [
      { slug: "ui-ux-design", name: "UI/UX Design" },
      { slug: "web-design", name: "Web Design" },
      { slug: "branding", name: "Branding" },
      { slug: "logo-design", name: "Logo Design" },
      { slug: "graphic-design", name: "Graphic Design" },
      { slug: "illustration", name: "Illustration" },
      { slug: "product-design", name: "Product Design" },
    ],
  },
  {
    slug: "writing-and-translation",
    name: "Writing and Translation",
    description: "Writers, editors, and translators for clear, accurate content in any language.",
    isLocal: false,
    skills: [
      { slug: "copywriting", name: "Copywriting" },
      { slug: "content-writing", name: "Content Writing" },
      { slug: "technical-writing", name: "Technical Writing" },
      { slug: "editing-and-proofreading", name: "Editing and Proofreading" },
      { slug: "translation", name: "Translation" },
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    description: "Marketers who grow audiences, traffic, and revenue across channels.",
    isLocal: false,
    skills: [
      { slug: "seo", name: "SEO" },
      { slug: "paid-ads", name: "Paid Ads" },
      { slug: "social-media", name: "Social Media" },
      { slug: "email-marketing", name: "Email Marketing" },
      { slug: "content-marketing", name: "Content Marketing" },
      { slug: "growth-marketing", name: "Growth Marketing" },
    ],
  },
  {
    slug: "sales-and-lead-generation",
    name: "Sales and Lead Generation",
    description: "Specialists who build pipeline and turn prospects into customers.",
    isLocal: false,
    skills: [
      { slug: "lead-generation", name: "Lead Generation" },
      { slug: "cold-outreach", name: "Cold Outreach" },
      { slug: "crm-management", name: "CRM Management" },
      { slug: "appointment-setting", name: "Appointment Setting" },
    ],
  },
  {
    slug: "video-and-animation",
    name: "Video and Animation",
    description: "Editors and animators who turn footage and ideas into finished video.",
    isLocal: false,
    skills: [
      { slug: "video-editing", name: "Video Editing" },
      { slug: "motion-graphics", name: "Motion Graphics" },
      { slug: "animation", name: "Animation" },
      { slug: "explainer-videos", name: "Explainer Videos" },
    ],
  },
  {
    slug: "music-and-audio",
    name: "Music and Audio",
    description: "Audio professionals for voice, podcasts, music, and sound.",
    isLocal: false,
    skills: [
      { slug: "voiceover", name: "Voiceover" },
      { slug: "podcast-editing", name: "Podcast Editing" },
      { slug: "mixing-and-mastering", name: "Mixing and Mastering" },
      { slug: "sound-design", name: "Sound Design" },
    ],
  },
  {
    slug: "admin-and-business-support",
    name: "Admin and Business Support",
    description: "Organised support for the day to day running of a business.",
    isLocal: false,
    skills: [
      { slug: "virtual-assistant", name: "Virtual Assistant" },
      { slug: "data-entry", name: "Data Entry" },
      { slug: "customer-support", name: "Customer Support" },
      { slug: "project-management", name: "Project Management" },
      { slug: "transcription", name: "Transcription" },
    ],
  },
  {
    slug: "finance-and-accounting",
    name: "Finance and Accounting",
    description: "Numbers people for bookkeeping, reporting, and financial planning.",
    isLocal: false,
    skills: [
      { slug: "bookkeeping", name: "Bookkeeping" },
      { slug: "accounting", name: "Accounting" },
      { slug: "financial-modelling", name: "Financial Modelling" },
      { slug: "tax-preparation", name: "Tax Preparation" },
    ],
  },
  {
    slug: "consulting-and-legal",
    name: "Consulting and Legal",
    description: "Advisers for strategy, operations, people, and legal questions.",
    isLocal: false,
    skills: [
      { slug: "business-consulting", name: "Business Consulting" },
      { slug: "legal-consulting", name: "Legal Consulting" },
      { slug: "hr-consulting", name: "HR Consulting" },
    ],
  },
  {
    slug: "photography-and-on-site-services",
    name: "Photography and On-site Services",
    description: "Photographers, videographers, and on-site help delivered in person near you.",
    isLocal: true,
    skills: [
      { slug: "event-photography", name: "Event Photography" },
      { slug: "product-photography", name: "Product Photography" },
      { slug: "portrait-photography", name: "Portrait Photography" },
      { slug: "videography", name: "Videography" },
      { slug: "on-site-tech-support", name: "On-site Tech Support" },
      { slug: "event-services", name: "Event Services" },
    ],
  },
];

export async function seedCategories() {
  for (const [index, category] of categoryTaxonomy.entries()) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        isLocal: category.isLocal,
        sortOrder: index,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        isLocal: category.isLocal,
        sortOrder: index,
      },
    });

    for (const [skillIndex, skill] of category.skills.entries()) {
      await prisma.skill.upsert({
        where: { slug: skill.slug },
        update: {
          name: skill.name,
          categoryId: record.id,
          sortOrder: skillIndex,
        },
        create: {
          slug: skill.slug,
          name: skill.name,
          categoryId: record.id,
          sortOrder: skillIndex,
        },
      });
    }
  }

  const skillCount = categoryTaxonomy.reduce((total, c) => total + c.skills.length, 0);
  console.log(`Seeded ${categoryTaxonomy.length} categories and ${skillCount} skills.`);
}

/** Run only the taxonomy: npm run db:seed:categories -w @bench/database */
const isDirectRun = process.argv[1]?.endsWith("seed-categories.ts");
if (isDirectRun) {
  seedCategories()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
