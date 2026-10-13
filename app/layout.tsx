import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Бүтээлч уншлага-2 | PISA Mentor AI',
  description: 'Mentor AI Цэндао багштай PISA уншлагын даалгаврын платформ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mn">
      <body className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}