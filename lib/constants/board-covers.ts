export type BoardCoverId =
  | 'indigo'
  | 'violet'
  | 'cyan'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'orange'
  | 'sky'

export interface BoardCoverPreset {
  id: BoardCoverId
  label: string
  /** Top gradient strip on board cards */
  gradient: string
  /** Small swatch in picker */
  swatch: string
}

export const BOARD_COVERS: BoardCoverPreset[] = [
  { id: 'indigo', label: 'Indigo', gradient: 'from-indigo-600 via-violet-600 to-purple-700', swatch: 'bg-gradient-to-br from-indigo-500 to-violet-500' },
  { id: 'violet', label: 'Violet', gradient: 'from-violet-600 via-purple-600 to-fuchsia-700', swatch: 'bg-gradient-to-br from-violet-500 to-purple-500' },
  { id: 'cyan', label: 'Cyan', gradient: 'from-cyan-500 via-blue-500 to-indigo-600', swatch: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
  { id: 'emerald', label: 'Emerald', gradient: 'from-emerald-500 via-teal-500 to-cyan-600', swatch: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
  { id: 'amber', label: 'Amber', gradient: 'from-amber-500 via-orange-500 to-red-500', swatch: 'bg-gradient-to-br from-amber-400 to-orange-500' },
  { id: 'rose', label: 'Rose', gradient: 'from-rose-500 via-pink-500 to-fuchsia-600', swatch: 'bg-gradient-to-br from-rose-400 to-pink-500' },
  { id: 'orange', label: 'Orange', gradient: 'from-orange-500 via-amber-500 to-yellow-500', swatch: 'bg-gradient-to-br from-orange-400 to-amber-500' },
  { id: 'sky', label: 'Sky', gradient: 'from-sky-500 via-blue-500 to-indigo-500', swatch: 'bg-gradient-to-br from-sky-400 to-blue-500' },
]

export const DEFAULT_COVER_ID: BoardCoverId = 'indigo'

export function getBoardCover(id: string | null | undefined): BoardCoverPreset {
  return BOARD_COVERS.find(c => c.id === id) ?? BOARD_COVERS[0]
}
