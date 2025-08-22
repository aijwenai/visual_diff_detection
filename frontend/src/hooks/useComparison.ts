import { useState } from 'react'
interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}
export function useComparison() {
  const [result, setResult] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  async function compare(
    before: File,
    after: File,
    threshold: number,
    beforeRegions: Rectangle[] = [],
    afterRegions: Rectangle[] = []
  ) {
    setLoading(true)
    setResult(undefined)
    setError(undefined)
    try {
      const formData = new FormData()
      formData.append('before_image', before)
      formData.append('after_image', after)
      formData.append('threshold', threshold.toString())
      formData.append('ignore_regions', JSON.stringify({
        before: beforeRegions,
        after: afterRegions
      }))
      const response = await fetch('http://localhost:8000/api/comparison/', {
        method: 'POST',
        headers: {
          'X-API-Key': 'my-secret-api-key'
        },
        body: formData,
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error (${response.status}): ${errorText}`)
      }
      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      console.error('Comparison error:', err)
      setError(err.message || 'Failed to compare images')
    } finally {
      setLoading(false)
    }
  }
  return { result, loading, error, compare }
}
