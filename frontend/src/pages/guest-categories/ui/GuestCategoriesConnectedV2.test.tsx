import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WeddingContext, type WeddingContextValue } from '../../../entities/wedding/model/wedding-context'
import { guestApi, guestCategoryApi, type Wedding } from '../../../shared/api/weddings'
import { NavigationContext } from '../../../shared/lib/navigation/navigation-context'
import { GuestCategoriesConnectedV2 } from './GuestCategoriesConnectedV2'

vi.mock('../../../shared/api/weddings', () => ({
  guestApi: { list: vi.fn() },
  guestCategoryApi: { list: vi.fn() },
}))

const workspace: WeddingContextValue = {
  weddings: [],
  activeWedding: { id: 'wedding-1' } as Wedding,
  activeRole: 'OWNER',
  rolesByWedding: {},
  loading: false,
  error: null,
  selectWedding: vi.fn(),
  refresh: vi.fn(),
  addWedding: vi.fn(),
  replaceWedding: vi.fn(),
  removeWedding: vi.fn(),
}

describe('GuestCategoriesConnectedV2', () => {
  beforeEach(() => {
    vi.mocked(guestApi.list).mockResolvedValue({
      items: [],
      nextCursor: null,
      total: 11,
      totalPartySize: 15,
      categorizedTotal: 7,
    })
    vi.mocked(guestCategoryApi.list).mockResolvedValue({
      items: [
        {
          id: 'category-1',
          weddingId: 'wedding-1',
          parentId: null,
          name: 'Nhà trai',
          familySide: 'GROOM',
          depth: 1,
          sortOrder: 0,
          guestCount: 7,
          createdAt: '',
          updatedAt: '',
        },
      ],
    })
  })

  it('uses the guest directory total instead of summing categorized guests', async () => {
    render(
      <NavigationContext.Provider value={{ pathname: '/studio/guests/categories', navigate: vi.fn() }}>
        <WeddingContext.Provider value={workspace}>
          <GuestCategoriesConnectedV2 />
        </WeddingContext.Provider>
      </NavigationContext.Provider>,
    )

    await waitFor(() => expect(screen.getByText('11')).toBeInTheDocument())
    expect(guestApi.list).toHaveBeenCalledWith('wedding-1', { limit: 1 })
    expect(screen.getByText('Cấp 1 · 7 khách')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/studio/guests?categoryId=category-1',
    )
  })
})
