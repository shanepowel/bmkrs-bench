/** Central route helpers — bench portal URLs. */

export const routes = {
  home: "/",
  login: "/login",
  dashboardHome: "/home",
  afterSignIn: "/auth/after-sign-in",
  authCallback: "/auth/callback",
  join: "/join",
  apply: "/apply",
  /** Company entry from www /network — not the skill marketplace route. */
  hire: "/hire",
  application: "/application",
  partner: "/partner",
  client: "/client",
  studio: "/studio",
  studioPipeline: "/studio/pipeline",
  studioPipelineApplicant: (id: string) => `/studio/pipeline/${id}`,
  studioBench: "/studio/bench",
  studioBriefs: "/studio/briefs",

  // retained marketplace mechanics (studio-only or role-gated)
  jobs: "/jobs",
  job: (slug: string) => `/jobs/${slug}`,
  jobEdit: (slug: string) => `/jobs/${slug}/edit`,
  jobMessages: (slug: string, participantId: string) => `/jobs/${slug}/messages/${participantId}`,
  postJob: "/jobs/post",
  talents: "/talents",
  categories: "/categories",
  category: (slug: string) => `/categories/${slug}`,
  hireSkill: (skillSlug: string) => `/hire/${skillSlug}`,
  freelancer: (username: string) => `/freelancers/${username}`,
  partnerProfile: (username: string) => `/partners/${username}`,

  dashboard: "/dashboard",
  threads: "/threads",
  threadsThread: (threadId: string) => `/threads/${threadId}`,
  inbox: "/threads",
  inboxThread: (threadId: string) => `/threads/${threadId}`,
  profile: "/profile",
  notifications: "/notifications",
  transactions: "/settings/transactions",
  contract: (id: string) => `/contracts/${id}`,
  payouts: "/settings/payouts",
  /** Canonical member login — marketing links here; `/sign-in` redirects here. */
  signIn: "/login",
  signUp: (role?: "client" | "talent" | "applicant") =>
    role ? `/sign-up?role=${role}` : "/sign-up",
  onboarding: "/onboarding",
} as const;
