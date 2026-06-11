"use server";

import { ContractStatus, JobStatus, prisma, UserRole } from "@bench/database";
import type { Stage } from "@/lib/bench-ui";
import { requireRole } from "@/lib/auth";
import { getPartnerTrackRecord } from "@/actions/track-record";
import { listPartnerBriefs } from "@/actions/briefs";

function contractStage(status: ContractStatus): Stage {
  switch (status) {
    case ContractStatus.PENDING_ACCEPTANCE:
      return "decide";
    case ContractStatus.ACTIVE:
      return "make";
    case ContractStatus.COMPLETED:
      return "ship";
    default:
      return "listen";
  }
}

export async function getPartnerDashboard() {
  const user = await requireRole(UserRole.TALENT);
  const [briefs, trackRecord, contracts, latestThread] = await Promise.all([
    listPartnerBriefs(),
    getPartnerTrackRecord(user.id),
    prisma.contract.findMany({
      where: { talentId: user.id, status: { in: [ContractStatus.ACTIVE, ContractStatus.PENDING_ACCEPTANCE] } },
      include: {
        job: { select: { title: true } },
        messageThreads: {
          include: {
            messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.messageThread.findFirst({
      where: { talentId: user.id },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: true } },
        job: { select: { title: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const profile = await prisma.talentProfile.findUnique({
    where: { userId: user.id },
    include: { skills: { include: { skill: true } } },
  });

  const discipline =
    profile?.skills.map((s) => s.skill.name.toLowerCase()).join(" · ") ?? "partner";

  const projects = contracts.map((c) => {
    const lastMsg = c.messageThreads[0]?.messages[0];
    return {
      name: c.title.toLowerCase(),
      role: discipline,
      stage: contractStage(c.status),
      last: lastMsg
        ? `${lastMsg.sender.firstName.toLowerCase()}: ${lastMsg.body.slice(0, 60)}`
        : "no messages yet",
    };
  });

  return {
    briefs,
    trustedSince: trackRecord.trustedSince ?? "the bench",
    projects,
    availability: (profile?.availability ?? "open") as "open" | "limited" | "unavailable",
    latestActivity: latestThread?.messages[0]?.body ?? null,
  };
}

export async function getClientDashboard() {
  const user = await requireRole(UserRole.CLIENT);

  const projects = await prisma.project.findMany({
    where: { clientId: user.id },
    include: {
      engagements: {
        include: {
          talentProfile: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
        },
      },
      briefs: {
        where: { status: { in: [JobStatus.OPEN, JobStatus.FILLED] } },
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (projects.length === 0) {
    const contracts = await prisma.contract.findMany({
      where: { clientId: user.id, status: ContractStatus.ACTIVE },
      include: { job: true },
    });
    return contracts.map((c) => ({
      slug: c.jobId,
      name: c.title.toLowerCase(),
      pkg: "project",
      stage: contractStage(c.status),
      last: "active contract — open threads for updates",
    }));
  }

  return projects.map((p) => {
    const brief = p.briefs[0];
    const partner = p.engagements[0]?.talentProfile?.user;
    return {
      slug: p.slug,
      name: p.name.toLowerCase(),
      pkg: p.description?.slice(0, 40).toLowerCase() ?? "project",
      stage: (brief?.status === JobStatus.OPEN ? "decide" : "make") as Stage,
      last: partner
        ? `${partner.firstName.toLowerCase()} on the team`
        : "awaiting studio staffing",
    };
  });
}
