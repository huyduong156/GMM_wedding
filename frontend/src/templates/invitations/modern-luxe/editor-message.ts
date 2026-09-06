import {
  isLiveEditorUpdate,
  liveEditorEvents,
  type LiveEditorUpdateMessage,
} from '../../../shared/lib/live-template-editor'
import type {
  ModernLuxeData,
  ModernLuxePalette,
  ModernLuxeSectionKey,
} from './ModernLuxeInvitation'

export const MODERN_LUXE_EDITOR_EVENT = liveEditorEvents.update

export type ModernLuxeEditorPayload = {
  data: ModernLuxeData
  palette: ModernLuxePalette
  sectionConfig: { enabled: ModernLuxeSectionKey[]; order: ModernLuxeSectionKey[] }
}
export type ModernLuxeEditorMessage = LiveEditorUpdateMessage<ModernLuxeEditorPayload>

export const isModernLuxeEditorMessage = (value: unknown): value is ModernLuxeEditorMessage =>
  isLiveEditorUpdate<ModernLuxeEditorPayload>(value)
