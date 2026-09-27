import { describe, expect, it } from 'vitest'
import { getOfficialTrailer } from './App'

describe('getOfficialTrailer', () => {
  it('retourne la meilleure bande-annonce YouTube', () => {
    const film = {
      id: 1,
      title: 'Test movie',
      overview: 'ok',
      poster_path: null,
      backdrop_path: null,
      release_date: '2026-01-01',
      vote_average: 8.5,
      videos: {
        results: [
          { key: 'teaser-123', name: 'Teaser', site: 'YouTube', type: 'Teaser' },
          { key: 'trailer-456', name: 'Trailer', site: 'YouTube', type: 'Trailer' },
        ],
      },
    }

    expect(getOfficialTrailer(film)).toMatchObject({ key: 'trailer-456', type: 'Trailer' })
  })

  it('utilise un trailer de secours pour les films de démonstration sans vidéo', () => {
    const film = {
      id: 7,
      title: 'Inception',
      overview: 'ok',
      poster_path: null,
      backdrop_path: null,
      release_date: '2010-07-22',
      vote_average: 8.4,
    }

    expect(getOfficialTrailer(film)).toMatchObject({ key: 'J8rKKvzwLxI', type: 'Trailer' })
  })
})
