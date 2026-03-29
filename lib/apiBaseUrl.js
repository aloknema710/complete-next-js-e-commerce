/**
 * Base URL for server-side calls to this app's Route Handlers (`/api/*`).
 * During `next build` on Vercel nothing listens on localhost; use VERCEL_URL when
 * NEXT_PUBLIC_API_BASE_URL is missing or still points at localhost.
 */
export function getApiBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || ''
  const looksLocal =
    explicit.includes('127.0.0.1') || explicit.includes('localhost')

  if (process.env.VERCEL_URL && (!explicit || looksLocal)) {
    return `https://${process.env.VERCEL_URL}/api`
  }

  return explicit || 'http://localhost:3000/api'
}
