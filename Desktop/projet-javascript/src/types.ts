export interface Film {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids?: number[]
  genres?: Genre[]
  credits?: Credits
  videos?: { results: Video[] }
}

export interface Genre { id: number; name: string }
export interface Credits { cast: CastMember[] }
export interface CastMember { id: number; name: string; character: string; profile_path: string | null }
export interface Video { key: string; name: string; site: string; type: string }
export interface Review { rating: number; comment: string; watchedAt: string }
export interface WatchlistItem { film: Film; watched: boolean; review?: Review }
export type WatchlistAction =
  | { type: 'AJOUTER'; film: Film }
  | { type: 'RETIRER'; filmId: number }
  | { type: 'MARQUER_VU'; filmId: number; review?: Review }
export const genres: Genre[] = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Aventure' }, { id: 35, name: 'Comédie' },
  { id: 18, name: 'Drame' }, { id: 878, name: 'Science-fiction' },
]