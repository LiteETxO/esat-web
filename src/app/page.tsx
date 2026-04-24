import { redirect } from 'next/navigation'

// Redirect bare / to /en (next-intl middleware handles this in production;
// this fallback catches direct file-system renders)
export default function RootPage() {
  redirect('/en')
}
