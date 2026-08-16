import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { adminTemplateApi, type AdminTemplate } from '../../../shared/api/admin-templates'
import { AdminTemplatesApiPage } from './AdminTemplatesApiPage'

const template: AdminTemplate = { key: 'modern-luxe', name: 'Élan d’Amour', productType: 'ONLINE_INVITATION', status: 'DRAFT', description: 'Thiệp couture', versions: [{ id: 'version-1', version: '2.3.0', configHash: '1234567890abcdef', templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1, codeRevision: 'abc123', config: { sections: [] }, createdAt: '2026-08-01T00:00:00Z', releasedAt: null, deprecatedAt: null, reviewStatus: 'PENDING_REVIEW', usageCount: 2, compatibility: { compatible: true, issues: [], supported: { templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1 } }, recentAudit: [] }] }

describe('AdminTemplatesApiPage', () => {
  it('loads templates and releases a pending version', async () => {
    vi.spyOn(adminTemplateApi, 'list').mockResolvedValue({ pendingReviewCount: 1, items: [template] })
    const release = vi.spyOn(adminTemplateApi, 'release').mockResolvedValue({ version: { ...template.versions[0], reviewStatus: 'RELEASED', releasedAt: '2026-08-11T00:00:00Z' } })
    render(<NavigationProvider><AdminTemplatesApiPage kind="invitation" /></NavigationProvider>)
    expect(await screen.findByRole('heading', { name: 'Élan d’Amour' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Quản lý/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Phát hành version' }))
    await waitFor(() => expect(release).toHaveBeenCalledWith('modern-luxe', '2.3.0'))
  })

  it('shows usage and blocks an incompatible release', async () => {
    const incompatible = { ...template, versions: [{ ...template.versions[0], compatibility: { ...template.versions[0].compatibility, compatible: false, issues: ['Renderer API v2 chưa được hỗ trợ'] } }] }
    vi.spyOn(adminTemplateApi, 'list').mockResolvedValue({ pendingReviewCount: 1, items: [incompatible] })
    render(<NavigationProvider><AdminTemplatesApiPage kind="invitation" /></NavigationProvider>)
    expect(await screen.findByText('2')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Quản lý/ }))
    expect(screen.getByText('Renderer API v2 chưa được hỗ trợ')).toBeInTheDocument()
    const release = vi.spyOn(adminTemplateApi, 'release').mockRejectedValue(new Error('Renderer API v2 chưa được hỗ trợ')); fireEvent.click(screen.getByRole('button', { name: 'Phát hành version' })); await waitFor(() => expect(release).toHaveBeenCalledWith('modern-luxe', '2.3.0'))
  })

  it('validates a bundle before calling sync', async () => {
    vi.spyOn(adminTemplateApi, 'list').mockResolvedValue({ pendingReviewCount: 0, items: [] })
    const sync = vi.spyOn(adminTemplateApi, 'sync')
    render(<NavigationProvider><AdminTemplatesApiPage kind="invitation" /></NavigationProvider>)
    await screen.findByText('Chưa có template')
    fireEvent.click(screen.getAllByRole('button', { name: /Đồng bộ template/ })[0])
    fireEvent.change(screen.getByRole('textbox', { name: 'Release bundle JSON' }), { target: { value: JSON.stringify({ bundleVersion: 1, sourceRevision: 'abc', templates: [{ productType: 'ONLINE_INVITATION', templateVersion: 'bad', config: {}, templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1 }] }) } })
    fireEvent.click(screen.getByRole('button', { name: 'Kiểm tra và đồng bộ' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('SemVer')
    expect(sync).not.toHaveBeenCalled()
  })

  it('opens management with a legacy API response missing metrics and audit fields', async () => {
    const legacyTemplate = { ...template, versions: [{ ...template.versions[0], usageCount: undefined, compatibility: undefined, recentAudit: undefined }] } as unknown as AdminTemplate
    vi.spyOn(adminTemplateApi, 'list').mockResolvedValue({ pendingReviewCount: 1, items: [legacyTemplate] })
    render(<NavigationProvider><AdminTemplatesApiPage kind="invitation" /></NavigationProvider>)
    await screen.findByRole('heading', { name: 'Élan d’Amour' })
    fireEvent.click(screen.getByRole('button', { name: /Quản lý/ }))
    expect(screen.getByRole('dialog', { name: 'Élan d’Amour' })).toBeInTheDocument()
    expect(screen.getByText('Tương thích để phát hành')).toBeInTheDocument()
    expect(screen.getByText('Lịch sử thao tác (0)')).toBeInTheDocument()
  })
})

