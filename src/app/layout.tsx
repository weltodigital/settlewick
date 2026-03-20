import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import { AuthProvider } from '@/providers/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Settlewick | UK Property Search with Every Filter You Need',
  description: 'Search properly. Find properties for sale and to rent across the UK with comprehensive filters, detailed information, and local insights.',
  keywords: 'UK property, houses for sale UK, flats to rent UK, property search UK, estate agents UK, stamp duty calculator, mortgage calculator',
  openGraph: {
    title: 'Settlewick | UK Property Search with Every Filter You Need',
    description: 'Search properly. Find properties for sale and to rent across the UK with comprehensive filters, detailed information, and local insights.',
    url: 'https://www.settlewick.co.uk',
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
    title: 'Settlewick | UK Property Search with Every Filter You Need',
    description: 'Search properly. Find properties for sale and to rent across the UK.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.settlewick.co.uk',
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