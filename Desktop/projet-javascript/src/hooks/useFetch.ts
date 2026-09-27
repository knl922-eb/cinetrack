import { useEffect, useState } from 'react'
export type FetchState<T> =
  | { status: 'loading'; data: T | null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: T | null; error: Error }
export function useFetch<T>(url: string, initialData: T | null = null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'loading', data: initialData, error: null })

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const load = async () => {
      setState({ status: 'loading', data: initialData, error: null })

      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Réponse API ${response.status}`)

        const data = (await response.json()) as T
        if (!cancelled) {
          setState({ status: 'success', data, error: null })
        }
      } catch (error: unknown) {
        if (cancelled || (error instanceof DOMException && error.name === 'AbortError')) return

        setState({
          status: 'error',
          data: initialData,
          error: error instanceof Error ? error : new Error('Erreur inconnue'),
        })
      }
    }

    void load()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [initialData, url])

  return state
}