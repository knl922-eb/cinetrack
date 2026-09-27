import { createContext, useContext, useReducer, type PropsWithChildren } from 'react'
import type { Film, Review, WatchlistAction, WatchlistItem } from '../types'
function reducer(items: WatchlistItem[], action: WatchlistAction): WatchlistItem[] {
  switch (action.type) {
    case 'AJOUTER': return items.some((item) => item.film.id === action.film.id) ? items : [...items, { film: action.film, watched: false }]
    case 'RETIRER': return items.filter((item) => item.film.id !== action.filmId)
    case 'MARQUER_VU': return items.map((item) => item.film.id === action.filmId ? { ...item, watched: true, review: action.review } : item)
  }
}
interface WatchlistContextValue { items: WatchlistItem[]; add: (film: Film) => void; remove: (filmId: number) => void; markWatched: (filmId: number, review: Review) => void }
const WatchlistContext = createContext<WatchlistContextValue | null>(null)
/* oxlint-disable react/only-export-components */
export function WatchlistProvider({ children }: PropsWithChildren) {
  const [items, dispatch] = useReducer(reducer, [])
  const value: WatchlistContextValue = { items, add: (film) => dispatch({ type: 'AJOUTER', film }), remove: (filmId) => dispatch({ type: 'RETIRER', filmId }), markWatched: (filmId, review) => dispatch({ type: 'MARQUER_VU', filmId, review }) }
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}
export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (!context) throw new Error('useWatchlist doit être utilisé dans WatchlistProvider')
  return context
}