import Link from 'next/link'
import { Building2, Users, TrendingUp, Target, Phone, Mail, Star, ArrowRight } from 'lucide-react'

export default function AgentLanding() {
  const features = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Premium Property Listings',
      description: 'Showcase your properties with high-quality photos, detailed descriptions, and interactive features.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Lead Management',
      description: 'Advanced CRM tools to manage enquiries, track viewings, and convert leads to sales.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Market Analytics',
      description: 'Comprehensive market data, pricing insights, and performance tracking for your listings.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Targeted Marketing',
      description: 'Reach the right buyers with our advanced targeting and property matching algorithms.'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Monthly Property Views' },
    { value: '850+', label: 'Active Property Seekers' },
    { value: '95%', label: 'Lead Response Rate' },
    { value: '4.8⭐', label: 'Average Agent Rating' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-20">
        <div className="max-w-8xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Grow Your Estate Agency with Settlewick
            </h1>
            <p className="text-xl md:text-2xl text-primary-light mb-8 leading-relaxed">
              Join Portsmouth's premium property portal. Get more leads, better clients, and higher commissions with our professional agent platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/agent/signup" className="btn-accent text-lg px-8 py-4">
                Start Free Trial
              </Link>
              <Link href="/agent/demo" className="btn-outline-white text-lg px-8 py-4">
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-surface">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Trusted by Portsmouth's Leading Agents
            </h2>
            <p className="text-text-secondary text-lg">
              See why estate agents choose Settlewick to grow their business
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Professional tools designed specifically for estate agents to streamline operations and maximize sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-accent/10 rounded-lg text-accent flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-surface">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-text-secondary">
              No setup fees. No long-term contracts. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="card p-8 text-center">
              <h3 className="text-2xl font-bold text-text-primary mb-4">Starter</h3>
              <div className="mb-6">
                <div className="text-4xl font-bold text-text-primary">£29</div>
                <div className="text-text-secondary">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Up to 5 active listings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Basic lead management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Standard support</span>
                </li>
              </ul>
              <Link href="/agent/signup?plan=starter" className="btn-outline w-full">
                Start Free Trial
              </Link>
            </div>

            {/* Professional */}
            <div className="card p-8 text-center border-2 border-accent relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">Professional</h3>
              <div className="mb-6">
                <div className="text-4xl font-bold text-text-primary">£79</div>
                <div className="text-text-secondary">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Unlimited listings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Advanced CRM & analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Marketing tools</span>
                </li>
              </ul>
              <Link href="/agent/signup?plan=professional" className="btn-accent w-full">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card p-8 text-center">
              <h3 className="text-2xl font-bold text-text-primary mb-4">Enterprise</h3>
              <div className="mb-6">
                <div className="text-4xl font-bold text-text-primary">£199</div>
                <div className="text-text-secondary">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Multi-branch management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Custom branding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">Dedicated account manager</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary">API access</span>
                </li>
              </ul>
              <Link href="/agent/signup?plan=enterprise" className="btn-outline w-full">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Join Settlewick today and start growing your estate agency business.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/agent/signup" className="btn-accent text-lg px-8 py-4">
              Start Your Free Trial
            </Link>
            <div className="flex items-center justify-center space-x-6 text-text-secondary">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>0239 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>agents@settlewick.com</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-text-muted">
            14-day free trial • No credit card required • Cancel anytime
          </div>
        </div>
      </div>
    </div>
  )
}