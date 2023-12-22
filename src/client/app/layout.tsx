import type { Metadata } from 'next'
import './globals.css'
import Provider from './components/Provider'
import Appbar from './components/Appbar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Blogify',
  description: 'SasS Blog posting platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Provider>
          <Appbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  )
}
