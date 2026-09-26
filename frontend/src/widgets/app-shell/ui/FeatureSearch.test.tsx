import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import {
  WeddingContext,
  type WeddingContextValue,
} from '../../../entities/wedding/model/wedding-context'
import { notifications } from '../../../shared/ui/notifications/notifications'
import { studioRoutes } from '../../../shared/config/routes'
import { normalizeFeatureQuery, searchFeatures } from '../model/feature-search'
import { AppShell } from './AppShell'

vi.mock('../../../shared/ui/wedding-ambient/WeddingAmbient', () => ({ WeddingAmbient: () => null }))

// jsdom lacks native modal methods; browser focus trapping is supplied by <dialog>.
const dialogMethods = Object.getOwnPropertyDescriptors(HTMLDialogElement.prototype)
beforeAll(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = true
      },
    },
    close: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = false
      },
    },
  })
})
afterAll(() => {
  for (const method of ['showModal', 'close']) {
    if (dialogMethods[method])
      Object.defineProperty(HTMLDialogElement.prototype, method, dialogMethods[method])
    else Reflect.deleteProperty(HTMLDialogElement.prototype, method)
  }
})

function renderShell(role: 'OWNER' | 'EDITOR' | 'VIEWER' = 'OWNER') {
  window.history.replaceState(null, '', studioRoutes.home)
  const context: WeddingContextValue = {
    activeRole: role,
    activeWedding: null,
    weddings: [],
    rolesByWedding: {},
    loading: false,
    error: null,
    selectWedding: vi.fn(),
    refresh: vi.fn(),
    addWedding: vi.fn(),
    replaceWedding: vi.fn(),
    removeWedding: vi.fn(),
  }
  return render(
    <NavigationProvider>
      <WeddingContext.Provider value={context}>
        <AppShell>
          <h1>Nội dung trang</h1>
        </AppShell>
      </WeddingContext.Provider>
    </NavigationProvider>,
  )
}

describe('Feature search', () => {
  it('normalizes Vietnamese and ranks labels ahead of synonyms', () => {
    expect(normalizeFeatureQuery('  ĐÁM   CƯỚI ')).toBe('dam cuoi')
    const items = [
      { label: 'Danh mục khách mời', to: studioRoutes.guestCategories },
      { label: 'Khách mời', to: studioRoutes.guests },
      { label: 'Todolist', to: studioRoutes.todos },
    ]
    expect(searchFeatures(items, 'kha').map((item) => item.label)).toEqual([
      'Khách mời',
      'Danh mục khách mời',
    ])
    expect(searchFeatures(items, 'NHÓM KHÁCH')).toEqual([items[0]])
    expect(searchFeatures(items, 'cong viec')).toEqual([items[2]])
    expect(searchFeatures(items, 'moi khach')).toHaveLength(2)
  })

  it('opens from the topbar and navigates with arrows and Enter', () => {
    renderShell()
    fireEvent.click(screen.getByRole('button', { name: 'Tìm tính năng' }))
    const input = screen.getByRole('combobox', { name: 'Tên tính năng' })
    expect(input).toHaveFocus()
    fireEvent.change(input, { target: { value: 'kha' } })
    expect(screen.getAllByRole('option')).toHaveLength(2)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getByRole('option', { name: /Danh mục khách mời/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(window.location.pathname).toBe(studioRoutes.guestCategories)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('supports both shortcuts, empty results, cancel and click selection', () => {
    renderShell()
    const trigger = screen.getByRole('button', { name: 'Tìm tính năng' })
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz-no-match' } })
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
    expect(window.location.pathname).toBe(studioRoutes.home)
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: false, cancelable: true }))
    expect(trigger).toHaveFocus()
    fireEvent.keyDown(window, { key: 'K', metaKey: true })
    const input = screen.getByRole('combobox')
    expect(input).toHaveValue('')
    fireEvent.change(input, { target: { value: 'cong viec' } })
    fireEvent.click(screen.getByRole('option', { name: /Todolist/ }))
    expect(window.location.pathname).toBe(studioRoutes.todos)
  })

  it('uses the visible menu permissions for viewer and editor roles', () => {
    const view = renderShell('VIEWER')
    fireEvent.click(screen.getByRole('button', { name: 'Tìm tính năng' }))
    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).queryByRole('option', { name: /Thiệp của bạn|Sổ tiền mừng|Cài đặt/ }),
    ).not.toBeInTheDocument()
    expect(within(dialog).getByRole('option', { name: /Khách mời/ })).toBeInTheDocument()
    view.unmount()
    renderShell('EDITOR')
    fireEvent.click(screen.getByRole('button', { name: 'Tìm tính năng' }))
    expect(screen.getByRole('option', { name: /Thiệp của bạn/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Sổ tiền mừng/ })).not.toBeInTheDocument()
  })

  it('explains the unavailable notification feature without a fake unread badge', () => {
    const info = vi.spyOn(notifications, 'info')
    renderShell()
    const bell = screen.getByRole('button', { name: 'Thông báo' })
    fireEvent.click(bell)
    expect(info).toHaveBeenCalledWith(
      'Tính năng thông báo hiện chưa khả dụng.',
      'Vui lòng quay lại sau.',
    )
    expect(bell.querySelector('span')).toBeNull()
    info.mockRestore()
  })

  it('opens the quick menu with four owner destinations and closes after navigation', () => {
    renderShell()
    fireEvent.click(screen.getByRole('button', { name: 'Mở menu nhanh' }))
    const menu = screen.getByRole('navigation', { name: 'Tính năng thường dùng' })
    expect(within(menu).getAllByRole('link')).toHaveLength(4)
    expect(within(menu).getByRole('link', { name: 'Sổ tiền mừng' })).toHaveAttribute(
      'href',
      studioRoutes.giftLedger,
    )
    fireEvent.click(within(menu).getByRole('link', { name: 'Khách mời' }))
    expect(window.location.pathname).toBe(studioRoutes.guests)
    expect(screen.getByRole('button', { name: 'Mở menu nhanh' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('hides restricted quick links and closes the menu with Escape', () => {
    renderShell('VIEWER')
    fireEvent.click(screen.getByRole('button', { name: 'Mở menu nhanh' }))
    const menu = screen.getByRole('navigation', { name: 'Tính năng thường dùng' })
    expect(
      within(menu)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Khách mời', 'Todolist'])
    fireEvent.keyDown(within(menu).getByRole('link', { name: 'Todolist' }), { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Mở menu nhanh' })).toHaveFocus()
    expect(menu).toHaveAttribute('aria-hidden', 'true')
  })
})
