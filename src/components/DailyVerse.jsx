import React, { useEffect, useState } from 'react'

const DEFAULT_STORAGE_KEY = 'mindtrack_daily_verse'
const DEFAULT_API_URL = '/api/verse'
const DEFAULT_FALLBACK = {
  text:
    'For I know the plans I have for you, declares the LORD, to give you a future and a hope.',
  reference: 'Jeremiah 29:11',
}

function todayKey() {
  return new Date().toISOString().split('T')[0]
}

export default function DailyVerse({
  storageKey = DEFAULT_STORAGE_KEY,
  apiUrl = DEFAULT_API_URL,
  fallback = DEFAULT_FALLBACK,
}) {
  const [verse, setVerse] = useState(null)
  const [loading, setLoading] = useState(true)

  const canUseStorage = typeof window !== 'undefined' && !!window.localStorage

  useEffect(() => {
    let mounted = true

    async function loadVerse() {
      const today = todayKey()

      try {
        // Try to restore from localStorage first (only on client)
        if (canUseStorage) {
          const raw = window.localStorage.getItem(storageKey)
          if (raw) {
            try {
              const parsed = JSON.parse(raw)
              if (parsed?.date === today && parsed?.verse) {
                if (mounted) {
                  setVerse(parsed.verse)
                  setLoading(false)
                }
                return
              }
            } catch (e) {
              // JSON parse error - fall through to fetch
              console.warn('DailyVerse: corrupt cache, will refetch')
            }
          }
        }

        // Fetch from API (only in environments that support fetch)
        setLoading(true)
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error('Network response not ok')
        const data = await res.json()

        // Robust parsing (ourmanna returns verse.details.text and verse.details.reference)
        const details = data?.verse?.details || data?.verse || null
        const text = details?.text || details?.verse || data?.text || null
        const reference = details?.reference || data?.reference || null

        const newVerse = {
          text: text || fallback.text,
          reference: reference || fallback.reference,
        }

        try {
          if (canUseStorage) {
            window.localStorage.setItem(
              storageKey,
              JSON.stringify({ date: today, verse: newVerse })
            )
          }
        } catch (e) {
          // ignore localStorage failures
          console.warn('DailyVerse: failed to write cache', e)
        }

        if (mounted) setVerse(newVerse)
      } catch (err) {
        console.error('DailyVerse fetch error', err)

        // On error, try to load any cached value (even if older), otherwise fallback
        try {
          if (canUseStorage) {
            const raw = window.localStorage.getItem(storageKey)
            if (raw) {
              const parsed = JSON.parse(raw)
              if (mounted) setVerse(parsed.verse || fallback)
            } else {
              if (mounted) setVerse(fallback)
            }
          } else {
            if (mounted) setVerse(fallback)
          }
        } catch (e) {
          if (mounted) setVerse(fallback)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadVerse()

    return () => {
      mounted = false
    }
  }, [apiUrl, fallback, storageKey, canUseStorage])

  return (
    <section
      aria-live="polite"
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6"
    >
      <div className="flex items-center justify-between">
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded">
          Verse of the Day
        </span>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-gray-800 font-serif text-lg leading-relaxed">
              “{verse?.text || fallback.text}”
            </p>
            <div className="mt-3 text-sm text-gray-500 italic">
              {verse?.reference || fallback.reference}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
