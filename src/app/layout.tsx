import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import { AuthProvider } from '@/providers/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Settlewick | Find Your Perfect Home in Portsmouth',
  description: 'Search properly. Find properties for sale and to rent in Portsmouth with comprehensive filters, detailed information, and local insights.',
  keywords: 'Portsmouth property, houses for sale Portsmouth, flats to rent Portsmouth, estate agents Portsmouth',
  openGraph: {
    title: 'Settlewick | Find Your Perfect Home in Portsmouth',
    description: 'Search properly. Find properties for sale and to rent in Portsmouth with comprehensive filters, detailed information, and local insights.',
    url: 'https://settlewick.com',
    siteName: 'Settlewick',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Settlewick - Portsmouth Property Portal',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlewick | Find Your Perfect Home in Portsmouth',
    description: 'Search properly. Find properties for sale and to rent in Portsmouth.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://settlewick.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen bg-background">
        <OrganizationSchema />
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}