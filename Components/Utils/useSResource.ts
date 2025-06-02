// hooks/useSResource.ts
import { useEffect, useState } from 'react'

type ResourceType = ('image' | 'video' | 'jsonb' |' json' ) & string

interface UseSResourceOptions<T = string> {
  transform?: (data: string | Blob, type: ResourceType, url: string) => T
  type?: ResourceType
  host?: string
  forceRefresh?: boolean
}

export function useSResource<T = string>(
  url: string,
  options: UseSResourceOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let canceled = false
    const cacheKey = `SRES_${url}`

    async function fetchResource() {
      setLoading(true)

      const cached = localStorage.getItem(cacheKey)
      if (cached && !options.forceRefresh) {
        const transformed = options.transform
          ? options.transform(cached, options.type ?? 'image', url)
          : (cached as any)
        if (!canceled) setData(transformed)
        setLoading(false)
        return
      }

      try {
        const res = await fetch(url)
        const blob = await res.blob()
        const base64 = await blobToBase64(blob)

        localStorage.setItem(cacheKey, base64)

        const transformed = options.transform
          ? options.transform(base64, options.type ?? 'image', url)
          : (base64 as any)

        if (!canceled) setData(transformed)
      } catch (err) {
        console.error('Failed to load resource', err)
        if (!canceled) setData(null)
      } finally {
        if (!canceled) setLoading(false)
      }
    }

    fetchResource()

    return () => {
      canceled = true
    }
  }, [url, options.forceRefresh])

  return { data, loading }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export const SResources = {
  async fromCacheOrSave(url: string): Promise<string> {
    const cacheKey = `SRES_${url}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) return cached

    const blob = await fetch(url).then(res => res.blob())
    const base64 = await blobToBase64(blob)
    localStorage.setItem(cacheKey, base64)
    return base64
  },
  blobToBase64,
}