import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-8xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="text-2xl font-bold mb-4">Settlewick</div>
            <p className="text-sm text-white/80 mb-4">
              Search properly. Find your perfect home in Portsmouth with comprehensive filters and detailed local insights.
            </p>
            <p className="text-sm text-white/60">
              Built in Portsmouth, for Portsmouth.
            </p>
          </div>

          {/* Property Search */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Property Search</h3>
            <div className="space-y-3 text-sm">
              <Link href="/for-sale/portsmouth" className="block hover:text-accent transition-colors">
                Properties for Sale
              </Link>
              <Link href="/to-rent/portsmouth" className="block hover:text-accent transition-colors">
                Properties to Rent
              </Link>
              <Link href="/sold-prices/portsmouth" className="block hover:text-accent transition-colors">
                Sold House Prices
              </Link>
              <Link href="/area-guide/southsea" className="block hover:text-accent transition-colors">
                Area Guides
              </Link>
            </div>
          </div>

          {/* Tools */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Tools & Calculators</h3>
            <div className="space-y-3 text-sm">
              <Link href="/mortgage-calculator" className="block hover:text-accent transition-colors">
                Mortgage Calculator
              </Link>
              <Link href="/stamp-duty-calculator" className="block hover:text-accent transition-colors">
                Stamp Duty Calculator
              </Link>
              <Link href="/dashboard" className="block hover:text-accent transition-colors">
                Saved Properties
              </Link>
              <Link href="/agent" className="block hover:text-accent transition-colors">
                Agent Portal
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-3 text-sm">
              <Link href="/about" className="block hover:text-accent transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block hover:text-accent transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-light mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
            <p>&copy; 2025 Settlewick. All rights reserved.</p>
            <p>
              Designed & built in Portsmouth with{' '}
              <span className="text-accent">♥</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}