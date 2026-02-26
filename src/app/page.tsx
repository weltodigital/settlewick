import SearchHero from '@/components/search/SearchHero'
import HomePageMap from '@/components/map/HomePageMap'
import { TrendingUp, Users, Shield, Home, Calculator, Map } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: <Home className="w-8 h-8 text-accent" />,
      title: 'Comprehensive Property Data',
      description: 'Every property listing includes detailed specifications, energy ratings, local amenities, and transport links.'
    },
    {
      icon: <Map className="w-8 h-8 text-accent" />,
      title: 'Advanced Search Tools',
      description: 'Find properties with our powerful filters, map search, and draw-your-own-area functionality.'
    },
    {
      icon: <Calculator className="w-8 h-8 text-accent" />,
      title: 'Running Costs Calculator',
      description: 'See estimated monthly costs including mortgage, council tax, energy bills, and service charges.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-accent" />,
      title: 'Price History & Analytics',
      description: 'Track price changes, compare local sold prices, and understand market trends.'
    },
    {
      icon: <Shield className="w-8 h-8 text-accent" />,
      title: 'Transparent & Ad-Free',
      description: 'No premium listings or agent advertising. Every property gets equal visibility.'
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: 'Built for Portsmouth',
      description: 'Local insights, area guides, and community knowledge from people who know Portsmouth.'
    }
  ]

  const stats = [
    { number: '500+', label: 'Properties Listed' },
    { number: '50+', label: 'Search Filters' },
    { number: '£0', label: 'Cost to List Properties' },
    { number: '100%', label: 'Ad-Free Experience' }
  ]

  const areaGuides = [
    { name: 'Southsea', path: '/area-guide/southsea', description: 'Vibrant seafront area with independent shops and cafes' },
    { name: 'Old Portsmouth', path: '/area-guide/old-portsmouth', description: 'Historic cobbled streets and maritime heritage' },
    { name: 'Fratton', path: '/area-guide/fratton', description: 'Up-and-coming area with Victorian terraces' },
    { name: 'Cosham', path: '/area-guide/cosham', description: 'Family-friendly suburb with good transport links' }
  ]

  return (
    <div>
      {/* Hero Section */}
      <SearchHero />

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-8xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Property search, done properly
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              We've rethought property search from the ground up. No cluttered interfaces,
              no premium listings, just comprehensive data and powerful tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Search with Our Interactive Map
            </h2>
            <p className="text-text-secondary">
              Visualize properties on the map, draw custom search areas, and explore Portsmouth neighborhoods
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <HomePageMap />
          </div>
        </div>
      </section>

      {/* Area Guides Section */}
      <section className="py-20">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Explore Portsmouth Areas
            </h2>
            <p className="text-text-secondary">
              Local insights and property data for Portsmouth's most popular areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areaGuides.map((area) => (
              <Link
                key={area.name}
                href={area.path}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {area.name}
                </h3>
                <p className="text-text-secondary text-sm">{area.description}</p>
                <div className="mt-4 text-accent text-sm font-medium">
                  View area guide →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-8xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* For Buyers */}
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-6">
                For Property Buyers & Renters
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      Search with precision
                    </h3>
                    <p className="text-text-secondary">
                      Use our comprehensive filters to find exactly what you're looking for.
                      Filter by property features, energy rating, transport links, and more.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      Get the full picture
                    </h3>
                    <p className="text-text-secondary">
                      Every listing includes running costs, price history, local amenities,
                      and comparable sold prices to help you make informed decisions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      Save & track
                    </h3>
                    <p className="text-text-secondary">
                      Save properties, set up alerts, and track price changes.
                      Hide properties you're not interested in for a cleaner search experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Agents */}
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-6">
                For Estate Agents
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      List properties for free
                    </h3>
                    <p className="text-text-secondary">
                      No upfront costs, no premium listing fees. Every property gets equal visibility
                      based on relevance to the buyer's search criteria.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      Comprehensive property data
                    </h3>
                    <p className="text-text-secondary">
                      Our detailed listing forms capture everything buyers want to know,
                      from energy ratings to local transport links.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      Real analytics & insights
                    </h3>
                    <p className="text-text-secondary">
                      Track views, saves, enquiries and conversion rates.
                      Understand how your properties are performing.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/agent" className="btn-accent inline-flex items-center">
                  Get Started - It's Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay updated with Portsmouth property news
          </h2>
          <p className="text-white/80 mb-8">
            Get weekly insights on Portsmouth property market trends, new listings, and local area updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border-0 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="btn-accent px-8 py-3">
              Subscribe
            </button>
          </form>
          <p className="text-white/60 text-sm mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>
    </div>
  )
}