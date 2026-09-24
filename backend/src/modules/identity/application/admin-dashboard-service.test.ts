import { describe, expect, it, vi } from 'vitest'
import { AdminDashboardService } from './admin-dashboard-service'

describe('AdminDashboardService', () => {
  it('returns platform counts, media storage usage and recent audit activity', async () => {
    const db = {
      user: { count: vi.fn().mockResolvedValueOnce(10).mockResolvedValueOnce(7).mockResolvedValueOnce(2).mockResolvedValueOnce(1) },
      wedding: { count: vi.fn().mockResolvedValueOnce(6).mockResolvedValueOnce(3).mockResolvedValueOnce(2).mockResolvedValueOnce(1) },
      template: { count: vi.fn().mockResolvedValueOnce(4).mockResolvedValueOnce(3).mockResolvedValueOnce(1).mockResolvedValueOnce(0) },
      templateVersion: { count: vi.fn().mockResolvedValueOnce(8).mockResolvedValueOnce(2) },
      mediaAsset: {
        count: vi.fn().mockResolvedValueOnce(20).mockResolvedValueOnce(17).mockResolvedValueOnce(1).mockResolvedValueOnce(1),
        aggregate: vi.fn().mockResolvedValue({ _sum: { sizeBytes: 123456n } }),
      },
      auditLog: { findMany: vi.fn().mockResolvedValue([{ id: 'audit-1', action: 'admin.login' }]) },
    }

    const result = await new AdminDashboardService(db as never).getOverview()

    expect(result.users).toEqual({ total: 10, active: 7, pendingVerification: 2, suspended: 1 })
    expect(result.weddings).toEqual({ total: 6, draft: 3, published: 2, archived: 1 })
    expect(result.templates.pendingReviewVersions).toBe(2)
    expect(result.media).toEqual({ total: 20, ready: 17, processing: 1, failed: 1, totalSizeBytes: '123456' })
    expect(result.recentAuditLogs).toHaveLength(1)
  })
})
