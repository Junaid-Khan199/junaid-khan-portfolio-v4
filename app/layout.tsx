import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Junaid Khan | Data Analyst & Statistician',
  description: 'Data Analyst specialising in Power BI, Python, SQL, and Advanced Excel. Published ML researcher. Open to GCC & remote roles.',
  keywords: ['Data Analyst', 'Power BI', 'Python', 'SQL', 'Statistics', 'Machine Learning', 'Junaid Khan', 'GCC'],
  authors: [{ name: 'Junaid Khan' }],
  openGraph: {
    title: 'Junaid Khan | Data Analyst & Statistician',
    description: 'Transforming raw data into actionable business insights.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface antialiased">{children}</body>
    </html>
  )
}
