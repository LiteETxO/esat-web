import StudioClient from './StudioClient'

export function generateStaticParams() {
  return [{ tool: [] as string[] }]
}

export default function StudioPage() {
  return <StudioClient />
}
