import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WatchlistProvider, useWatchlist } from './WatchlistContext'
import { demoFilms } from '../data'

function Probe() {
  const { items, add, remove } = useWatchlist()
  return <><span data-testid="count">{items.length}</span><button onClick={() => add(demoFilms[0])}>add</button><button onClick={() => remove(demoFilms[0].id)}>remove</button></>
}

function ReviewProbe() {
  const { items, add, markWatched } = useWatchlist()
  return <><button onClick={() => add(demoFilms[0])}>add</button><button onClick={() => markWatched(demoFilms[0].id, { rating: 9, comment: 'Très bon', watchedAt: '2026-09-16' })}>watched</button><span data-testid="review">{items[0]?.review?.rating ?? 0}</span></>
}

describe('watchlist context', () => {
  afterEach(() => cleanup())

  it('ajoute puis retire un film sans doublon', async () => {
    const user = userEvent.setup()
    render(<WatchlistProvider><Probe /></WatchlistProvider>)
    expect(screen.getByTestId('count').textContent).toBe('0')
    await user.click(screen.getByText('add')); await user.click(screen.getByText('add'))
    expect(screen.getByTestId('count').textContent).toBe('1')
    await user.click(screen.getByText('remove'))
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('marque un film comme vu avec son avis', async () => {
    const user = userEvent.setup()
    render(<WatchlistProvider><ReviewProbe /></WatchlistProvider>)
    await user.click(screen.getByText('add')); await user.click(screen.getByText('watched'))
    expect(screen.getByTestId('review').textContent).toBe('9')
  })

  it('ignore les doublons même avec deux actions successives', async () => {
    const user = userEvent.setup()
    render(<WatchlistProvider><Probe /></WatchlistProvider>)
    await user.click(screen.getByText('add')); await user.click(screen.getByText('add'))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('expose une erreur si le hook est utilisé hors provider', () => {
    expect(() => render(<Probe />)).toThrow('WatchlistProvider')
  })
})