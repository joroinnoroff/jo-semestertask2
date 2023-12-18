import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import './globals.css'
import { Toaster, toast } from 'sonner'


export const metadata: Metadata = {
  title: 'Noroff Auction - JO',
  description: 'Made to make the auction world easy, sign up, bid & create listings.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
        <Toaster />
        <Navbar />
        {children}

      </body>
    </html>
  )
}
