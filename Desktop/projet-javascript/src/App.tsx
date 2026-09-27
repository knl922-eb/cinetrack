import { useMemo, useState, type FormEvent, type SyntheticEvent } from 'react'
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { demoFilms } from './data'
import { useFetch } from './hooks/useFetch'
import { useWatchlist, WatchlistProvider } from './context/WatchlistContext'
import type { Film, Review } from './types'
import { genres } from './types'
import './App.css'

const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined
const apiRoot = token ? `https://api.themoviedb.org/3?api_key=${token}` : 'data:application/json,%7B%22results%22%3A%5B%5D%7D'
const imageRoot = 'https://image.tmdb.org/t/p/w500'
const fallbackTrailers: Record<number, { key: string; name: string; site: string; type: string }> = {
  1: { key: 'n9j1KqeqvM8', name: 'Neon Horizon - Trailer', site: 'YouTube', type: 'Trailer' },
  2: { key: 'dQw4w9WgXcQ', name: 'Ligne de fuite - Trailer', site: 'YouTube', type: 'Trailer' },
  3: { key: 'vKJxg0sYkF8', name: 'Plan B - Trailer', site: 'YouTube', type: 'Trailer' },
  4: { key: 'L2KrP5Y1R6A', name: 'Les profondeurs - Trailer', site: 'YouTube', type: 'Trailer' },
  5: { key: '4N4ZpYJ0b2E', name: 'Minuit sur la 7e - Trailer', site: 'YouTube', type: 'Trailer' },
  6: { key: 'o2j7wWvFZbQ', name: 'Vitesse lumière - Trailer', site: 'YouTube', type: 'Trailer' },
  7: { key: 'J8rKKvzwLxI', name: 'Inception - Trailer', site: 'YouTube', type: 'Trailer' },
  8: { key: 'zSWdZVtXT7E', name: 'Interstellar - Trailer', site: 'YouTube', type: 'Trailer' },
  9: { key: 'Way9Dexny3w', name: 'Dune - Trailer', site: 'YouTube', type: 'Trailer' },
  10: { key: '39wmItIWsg5s', name: 'Le Voyage de Chihiro - Trailer', site: 'YouTube', type: 'Trailer' },
  11: { key: '5xH0HfJHn4Y', name: 'Parasite - Trailer', site: 'YouTube', type: 'Trailer' },
  12: { key: 'YfQjP6K0DkA', name: 'Spider-Man: New Generation - Trailer', site: 'YouTube', type: 'Trailer' },
  13: { key: 'SXKKM4WbSbA', name: 'Everything Everywhere - Trailer', site: 'YouTube', type: 'Trailer' },
  14: { key: 'hEJnMQG9ev8', name: 'Mad Max: Fury Road - Trailer', site: 'YouTube', type: 'Trailer' },
  15: { key: 'EXeTwQWrcwY', name: 'The Dark Knight - Trailer', site: 'YouTube', type: 'Trailer' },
  16: { key: 's7EdQ4FqbhY', name: 'Pulp Fiction - Trailer', site: 'YouTube', type: 'Trailer' },
  17: { key: '8r8xDEYwO1Q', name: 'La La Land - Trailer', site: 'YouTube', type: 'Trailer' },
  18: { key: 'B7jBRvUJ-5E', name: 'Whiplash - Trailer', site: 'YouTube', type: 'Trailer' },
  19: { key: 'm8e-FF8MsqU', name: 'The Matrix - Trailer', site: 'YouTube', type: 'Trailer' },
  20: { key: 'V75dMMIW2B4', name: 'Le Seigneur des anneaux - Trailer', site: 'YouTube', type: 'Trailer' },
  21: { key: 'qvsgGtivCgs', name: 'Retour vers le futur - Trailer', site: 'YouTube', type: 'Trailer' },
  22: { key: 'fMuzm6Gn8FQ', name: 'Get Out - Trailer', site: 'YouTube', type: 'Trailer' },
  23: { key: 't433PEQGErc', name: 'Joker - Trailer', site: 'YouTube', type: 'Trailer' },
  24: { key: '5PSNL1qE6VY', name: 'Avatar - Trailer', site: 'YouTube', type: 'Trailer' },
  25: { key: 'FtrQmLxI3tY', name: 'Amélie Poulain - Trailer', site: 'YouTube', type: 'Trailer' },
  26: { key: 'KGaDF7TgKJ0', name: 'Le Château ambulant - Trailer', site: 'YouTube', type: 'Trailer' },
}

/* oxlint-disable react/only-export-components */
export function getOfficialTrailer(film: Film | undefined) {
  const videos = film?.videos?.results ?? []
  const preferredOrder = ['Trailer', 'Teaser', 'Clip']

  const matched = videos
    .filter((video) => video.site === 'YouTube' && preferredOrder.includes(video.type))
    .sort((a, b) => preferredOrder.indexOf(a.type) - preferredOrder.indexOf(b.type))[0]

  if (matched) return matched

  if (!film) return null
  return fallbackTrailers[film.id] ?? null
}

function Header() {
  const { items } = useWatchlist()
  return <header className="topbar"><Link className="brand" to="/"><span className="brand-mark">CT</span><span>Ciné<span>Track</span></span></Link><nav><NavLink to="/">Découvrir</NavLink><NavLink to="/watchlist">Ma watchlist <b>{items.length}</b></NavLink></nav><span className="profile-dot">NL</span></header>
}
function Layout() { return <><Header /><main><Outlet /></main><footer><span>CinéTrack</span><span>Ton prochain film commence ici.</span><span>React · TypeScript · TMDB</span></footer></> }
function Poster({ film, large = false }: { film: Film; large?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageClass = large ? 'poster large' : 'poster'
  const fallbackClass = `poster poster-fallback ${large ? 'large' : ''}`
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = 'none'
    setImageFailed(true)
  }

  if (!film.poster_path || imageFailed) return <div className={fallbackClass}><span>{film.title.slice(0, 1)}</span><small>cinétrack</small></div>
  return <img className={imageClass} src={`${imageRoot}${film.poster_path}`} alt={`Affiche de ${film.title}`} onError={handleImageError} />
}
function StatusPanel({ status, message }: { status: 'loading' | 'error'; message: string }) { return <div className={`status ${status}`}><span className="status-icon">{status === 'loading' ? '◌' : '!'}</span><strong>{status === 'loading' ? 'Chargement des films' : 'Impossible de joindre TMDB'}</strong><p>{message}</p></div> }
function FilmCard({ film, onStream }: { film: Film; onStream: (film: Film) => void }) {
  const { items, add, remove } = useWatchlist(); const saved = items.some((item) => item.film.id === film.id)
  return <article className="film-card"><button type="button" className="poster-button" onClick={() => onStream(film)} aria-label={`Lire la bande-annonce de ${film.title}`}><Poster film={film} /></button><div className="film-info"><div className="film-meta"><span>{film.release_date?.slice(0, 4) || '2025'}</span><span className="rating">★ {film.vote_average.toFixed(1)}</span></div><Link to={`/film/${film.id}`}><h3>{film.title}</h3></Link><p>{film.overview}</p><div className="film-card-actions"><button className={saved ? 'saved' : ''} onClick={() => saved ? remove(film.id) : add(film)}>{saved ? '✓ Dans la watchlist' : '+ Ajouter'}</button><button type="button" className="stream-link" onClick={() => onStream(film)}>▶ Stream</button></div></div></article>
}
function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <label className="search"><span>⌕</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Rechercher un film..." aria-label="Rechercher un film" /></label> }
function StreamModal({ film, onClose }: { film: Film | null; onClose: () => void }) {
  if (!film) return null
  const trailer = getOfficialTrailer(film)
  return <div className="stream-backdrop" onClick={onClose}><div className="stream-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="stream-close" onClick={onClose} aria-label="Fermer le lecteur">×</button>{trailer ? <iframe src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`} title={`Bande-annonce de ${film.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="stream-empty"><strong>Pas de bande-annonce disponible</strong><p>Tu peux toujours aller sur la fiche du film pour voir les détails.</p></div>}</div></div>
}
function HomePage() {
  const [query, setQuery] = useState(''); const [genre, setGenre] = useState(0); const [streamFilm, setStreamFilm] = useState<Film | null>(null); const remote = useFetch<{ results: Film[] }>(`${apiRoot}/movie/popular?language=fr-FR&page=1`); const films = remote.data?.results?.length ? remote.data.results : demoFilms
  const filtered = useMemo(() => films.filter((film) => film.title.toLowerCase().includes(query.toLowerCase()) && (!genre || film.genre_ids?.includes(genre))), [films, query, genre])
  return <><StreamModal film={streamFilm} onClose={() => setStreamFilm(null)} /><section className="hero"><div><p className="eyebrow">TON CINÉMA, ENFIN ORGANISÉ</p><h1>Les films que tu<br /><em>vas vraiment</em> voir.</h1><p className="hero-copy">Découvre, sauvegarde et note les histoires qui méritent une place dans ta prochaine soirée cinéma.</p><Link className="primary" to="/watchlist">Voir ma sélection <span>→</span></Link></div><div className="hero-orbit"><div className="orbit-card orbit-one">★ 8.4 <small>ma note</small></div><div className="reel">CINÉ<br /><b>TRACK</b></div><div className="orbit-card orbit-two">+ 12 <small>à voir</small></div></div></section><section className="catalog"><div className="section-heading"><div><p className="eyebrow">LE PROGRAMME</p><h2>À découvrir <span>{filtered.length} films</span></h2></div><SearchBar value={query} onChange={setQuery} /></div><div className="filter-row"><button className={!genre ? 'filter active' : 'filter'} onClick={() => setGenre(0)}>Tous les genres</button>{genres.map((item) => <button className={genre === item.id ? 'filter active' : 'filter'} key={item.id} onClick={() => setGenre(item.id)}>{item.name}</button>)}</div>{remote.status === 'loading' && !remote.data && <StatusPanel status="loading" message="On prépare la séance..." />}{remote.status === 'error' && !remote.data && <StatusPanel status="error" message="Les films de démonstration restent disponibles pendant la reconnexion." />}<div className="film-grid">{filtered.map((film) => <FilmCard key={film.id} film={film} onStream={setStreamFilm} />)}</div>{!filtered.length && <div className="empty"><strong>Aucun film trouvé.</strong><p>Essaie un autre titre ou retire le filtre.</p></div>}</section></>
}
function ReviewForm({ filmId }: { filmId: number }) {
  const { markWatched } = useWatchlist(); const [rating, setRating] = useState(8); const [comment, setComment] = useState(''); const [watchedAt, setWatchedAt] = useState(''); const [sent, setSent] = useState(false)
  const submit = (event: FormEvent) => { event.preventDefault(); if (!comment || !watchedAt) return; const review: Review = { rating, comment, watchedAt }; markWatched(filmId, review); setSent(true) }
  if (sent) return <div className="review-success">✓ Avis enregistré dans ta watchlist.</div>
  return <form className="review-form" onSubmit={submit}><div className="form-title"><span>TON AVIS</span><strong>Après la séance</strong></div><label>Ta note <output>{rating}/10</output><input type="range" min="0" max="10" value={rating} onChange={(event) => setRating(Number(event.target.value))} /></label><label>Commentaire<textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Une impression à garder..." required /></label><label>Date de visionnage<input type="date" value={watchedAt} onChange={(event) => setWatchedAt(event.target.value)} required /></label><button className="primary" type="submit">Enregistrer mon avis <span>→</span></button></form>
}
function FilmDetailPage() {
  const { id } = useParams(); const filmId = Number(id); const local = demoFilms.find((film) => film.id === filmId) ?? demoFilms[0]; const remote = useFetch<Film>(`${apiRoot}/movie/${filmId}?language=fr-FR&append_to_response=credits,videos`, local); const film = remote.data ?? local; const { items, add, remove } = useWatchlist(); const saved = items.some((item) => item.film.id === film.id); const trailer = getOfficialTrailer(film)
  return <section className="detail"><Link className="back" to="/">← Retour au catalogue</Link><div className="detail-layout"><Poster film={film} large /><div className="detail-copy"><p className="eyebrow">FICHE DU FILM · {film.release_date?.slice(0, 4)}</p><h1>{film.title}</h1><div className="detail-stats"><strong>★ {film.vote_average.toFixed(1)}</strong><span>TMDB</span><span>{film.genres?.map((item) => item.name).join(' · ') || 'Sélection CinéTrack'}</span></div><p className="overview">{film.overview || 'Le synopsis de ce film arrive bientôt.'}</p><div className="detail-actions"><button className="primary" onClick={() => saved ? remove(film.id) : add(film)}>{saved ? '✓ Dans ma watchlist' : '+ Ajouter à ma watchlist'}</button>{trailer && <a className="ghost" href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer">▶ Bande-annonce</a>}</div><ReviewForm filmId={film.id} /></div></div>{film.credits?.cast?.length ? <div className="cast"><p className="eyebrow">AU GÉNÉRIQUE</p><div>{film.credits.cast.slice(0, 5).map((member) => <span key={member.id}><b>{member.name}</b><small>{member.character}</small></span>)}</div></div> : null}</section>
}
function WatchlistPage() { const { items, remove } = useWatchlist(); return <section className="watchlist-page"><div className="page-intro"><p className="eyebrow">MON ESPACE</p><h1>À voir bientôt<span>.</span></h1><p>Une sélection personnelle, sans algorithme.</p></div>{items.length ? <div className="watchlist-list">{items.map((item) => <article key={item.film.id}><Poster film={item.film} /><div><p className="eyebrow">{item.watched ? 'VU · NOTÉ' : 'À VOIR'}</p><h2>{item.film.title}</h2>{item.review ? <p className="review-quote">“{item.review.comment}” <strong>{item.review.rating}/10</strong></p> : <p>{item.film.overview}</p>}<div><Link className="text-link" to={`/film/${item.film.id}`}>{item.watched ? 'Modifier mon avis' : 'Voir le film'} →</Link><button className="remove" onClick={() => remove(item.film.id)}>Retirer</button></div></div></article>)}</div> : <div className="empty large-empty"><div>＋</div><strong>Ta watchlist est vide</strong><p>Ajoute des films depuis le catalogue pour les retrouver ici.</p><Link className="primary" to="/">Découvrir les films <span>→</span></Link></div>}</section> }
function NotFoundPage() { return <div className="empty not-found"><strong>404 · Séance introuvable</strong><p>Cette page n’est pas au programme.</p><Link className="primary" to="/">Retour à l’accueil <span>→</span></Link></div> }
export default function App() { return <BrowserRouter><WatchlistProvider><Routes><Route element={<Layout />}><Route path="/" element={<HomePage />} /><Route path="/film/:id" element={<FilmDetailPage />} /><Route path="/watchlist" element={<WatchlistPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes></WatchlistProvider></BrowserRouter> }