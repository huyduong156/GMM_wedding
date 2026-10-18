import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { WeddingContext } from '../../../entities/wedding/model/wedding-context'
import {
  weddingApi,
  WeddingApiError,
  type Wedding,
  type WeddingContent,
} from '../../../shared/api/weddings'
import { InvitationEditorLivePage } from './InvitationEditorLivePage'

const wedding = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: 'lan-minh',
  name: 'Lan & Minh',
  status: 'DRAFT',
  visibility: 'PUBLIC',
  timezone: 'Asia/Ho_Chi_Minh',
  locale: 'vi-VN',
  revision: 1,
  primaryDate: null,
  publishedAt: null,
  archivedAt: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
} satisfies Wedding
const content: WeddingContent = {
  content: { brideName: 'Lan', groomName: 'Minh' },
  schemaVersion: 1,
  revision: 4,
  surface: 'ONLINE_INVITATION',
  themeConfig: { palette: 'sage' },
  sectionConfig: {
    enabled: ['cover', 'invitation', 'families', 'eventDetails'],
    order: ['cover', 'invitation', 'families', 'eventDetails'],
  },
  templateVersion: {
    id: '22222222-2222-4222-8222-222222222222',
    key: 'modern-luxe',
    version: '2.3.0',
    config: {},
  },
}
const workspace = {
  weddings: [wedding],
  activeWedding: wedding,
  activeRole: 'OWNER' as const,
  rolesByWedding: { [wedding.id]: 'OWNER' as const },
  loading: false,
  error: null,
  selectWedding: vi.fn(),
  refresh: vi.fn(),
  addWedding: vi.fn(),
  replaceWedding: vi.fn(),
  removeWedding: vi.fn(),
}
const dashboard = { dashboard: { publication: { invitation: { published: false } } } }
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
const saved = () => ({ content: { ...content, revision: 5 } })

beforeEach(() => {
  vi.spyOn(weddingApi, 'content').mockResolvedValue({ content })
  vi.spyOn(weddingApi, 'media').mockResolvedValue({ items: [] })
  vi.spyOn(weddingApi, 'dashboard').mockResolvedValue(dashboard as never)
  vi.spyOn(weddingApi, 'saveContent').mockResolvedValue(saved())
  vi.spyOn(window, 'open').mockReturnValue(null)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

async function editor() {
  render(
    <NavigationProvider>
      <WeddingContext.Provider value={workspace}>
        <InvitationEditorLivePage />
      </WeddingContext.Provider>
    </NavigationProvider>,
  )
  const bride = (await screen.findAllByDisplayValue('Lan'))[0]
  await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu thiệp' })).toBeEnabled())
  fireEvent.change(bride, { target: { value: 'Lan Anh' } })
  return bride
}

describe('invitation save lifecycle', () => {
  it('restores the button after each successful save and uses the new revision', async () => {
    await editor()
    for (let index = 0; index < 2; index++) {
      const pending = deferred<ReturnType<typeof saved>>()
      vi.mocked(weddingApi.saveContent).mockReturnValueOnce(pending.promise)
      fireEvent.click(screen.getByRole('button', { name: 'Lưu thiệp' }))
      expect(screen.getByRole('button', { name: 'Đang lưu' })).toBeDisabled()
      await act(async () => pending.resolve(saved()))
      await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu thiệp' })).toBeEnabled())
    }
    expect(weddingApi.saveContent).toHaveBeenNthCalledWith(
      2,
      wedding.id,
      expect.objectContaining({ revision: 5 }),
    )
  })

  it.each([400, 409, 500])('restores the button after HTTP %s and allows retry', async (status) => {
    await editor()
    vi.mocked(weddingApi.saveContent).mockRejectedValueOnce(
      new WeddingApiError(status, 'SAVE_ERROR', 'Save failed'),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Lưu thiệp' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu thiệp' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: 'Lưu thiệp' }))
    await waitFor(() => expect(weddingApi.saveContent).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu thiệp' })).toBeEnabled())
  })

  it.each(['invitation', 'publish'])(
    'restores the toolbar after save-and-continue for %s',
    async (action) => {
      await editor()
      fireEvent.click(
        screen.getByRole('button', {
          name: action === 'invitation' ? 'Xem thiệp của tôi' : 'Công khai',
        }),
      )
      const dialog = screen.getByRole('dialog', { name: 'Bạn có thay đổi chưa lưu' })
      fireEvent.click(within(dialog).getByRole('button', { name: 'Lưu và tiếp tục' }))
      await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu thiệp' })).toBeEnabled())
      if (action === 'invitation') expect(window.open).toHaveBeenCalled()
      else
        expect(screen.getByRole('dialog', { name: 'Công khai thiệp online' })).toBeInTheDocument()
    },
  )

  it('clears loading after a failed save-and-leave and stays in the editor', async () => {
    await editor()
    vi.mocked(weddingApi.saveContent).mockRejectedValueOnce(new Error('Offline'))
    fireEvent.click(screen.getByRole('link', { name: 'Quay lại kho giao diện' }))
    fireEvent.click(screen.getByRole('button', { name: 'Lưu và rời đi' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu và rời đi' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Lưu thiệp' })).toBeEnabled()
  })

  it('does not leave stale loading text after an external tool wraps the text node', async () => {
    await editor()
    const pending = deferred<ReturnType<typeof saved>>()
    vi.mocked(weddingApi.saveContent).mockReturnValueOnce(pending.promise)
    fireEvent.click(screen.getByRole('button', { name: 'Lưu thiệp' }))
    const button = screen.getByRole('button', { name: 'Đang lưu' })
    const owner = button.querySelector('[data-save-label]') ?? button
    const node = [...owner.childNodes].find(
      (child) => child.nodeType === Node.TEXT_NODE && child.textContent?.includes('Đang lưu'),
    )!
    const wrapper = document.createElement('font')
    wrapper.textContent = node.textContent
    node.replaceWith(wrapper)
    await act(async () => pending.resolve(saved()))
    await waitFor(() => expect(button).toBeEnabled())
    expect(button).toHaveTextContent('Lưu thiệp')
    expect(button).not.toHaveTextContent('Đang lưu')
  })
})
