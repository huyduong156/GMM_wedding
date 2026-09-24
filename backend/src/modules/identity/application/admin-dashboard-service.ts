import type { PrismaClient } from '@prisma/client'

export class AdminDashboardService {
  constructor(private readonly db: PrismaClient) {}

  async getOverview() {
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      suspendedUsers,
      totalWeddings,
      draftWeddings,
      publishedWeddings,
      archivedWeddings,
      totalTemplates,
      activeTemplates,
      draftTemplates,
      deprecatedTemplates,
      releasedTemplateVersions,
      pendingTemplateVersions,
      totalMedia,
      readyMedia,
      processingMedia,
      failedMedia,
      mediaSize,
      recentAuditLogs,
    ] = await Promise.all([
      this.db.user.count({ where: { deletedAt: null } }),
      this.db.user.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      this.db.user.count({ where: { deletedAt: null, status: 'PENDING_VERIFICATION' } }),
      this.db.user.count({ where: { deletedAt: null, status: 'SUSPENDED' } }),
      this.db.wedding.count({ where: { deletedAt: null } }),
      this.db.wedding.count({ where: { deletedAt: null, status: 'DRAFT' } }),
      this.db.wedding.count({ where: { deletedAt: null, status: 'PUBLISHED' } }),
      this.db.wedding.count({ where: { deletedAt: null, status: 'ARCHIVED' } }),
      this.db.template.count(),
      this.db.template.count({ where: { status: 'ACTIVE' } }),
      this.db.template.count({ where: { status: 'DRAFT' } }),
      this.db.template.count({ where: { status: 'DEPRECATED' } }),
      this.db.templateVersion.count({ where: { releasedAt: { not: null }, deprecatedAt: null } }),
      this.db.templateVersion.count({
        where: { sourceStatus: { not: 'DEVELOPMENT' }, releasedAt: null, deprecatedAt: null },
      }),
      this.db.mediaAsset.count({ where: { deletedAt: null } }),
      this.db.mediaAsset.count({ where: { deletedAt: null, status: 'READY' } }),
      this.db.mediaAsset.count({ where: { deletedAt: null, status: 'PROCESSING' } }),
      this.db.mediaAsset.count({ where: { deletedAt: null, status: 'FAILED' } }),
      this.db.mediaAsset.aggregate({
        where: { deletedAt: null },
        _sum: { sizeBytes: true },
      }),
      this.db.auditLog.findMany({
        take: 10,
        orderBy: { occurredAt: 'desc' },
        select: {
          id: true,
          action: true,
          resourceType: true,
          resourceId: true,
          occurredAt: true,
          actorUser: { select: { id: true, email: true, displayName: true } },
        },
      }),
    ])

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        pendingVerification: pendingUsers,
        suspended: suspendedUsers,
      },
      weddings: {
        total: totalWeddings,
        draft: draftWeddings,
        published: publishedWeddings,
        archived: archivedWeddings,
      },
      templates: {
        total: totalTemplates,
        active: activeTemplates,
        draft: draftTemplates,
        deprecated: deprecatedTemplates,
        releasedVersions: releasedTemplateVersions,
        pendingReviewVersions: pendingTemplateVersions,
      },
      media: {
        total: totalMedia,
        ready: readyMedia,
        processing: processingMedia,
        failed: failedMedia,
        totalSizeBytes: (mediaSize._sum.sizeBytes ?? 0n).toString(),
      },
      recentAuditLogs,
    }
  }
}
