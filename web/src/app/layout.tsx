import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Food Explorer',
    template: '%s | Food Explorer',
  },
  description: 'O seu restaurante favorito está aqui.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="dark:bg-gray-950">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}
