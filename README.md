# Settlewick 🏠

**Search properly.** A modern UK property portal built for Portsmouth, offering comprehensive property search with detailed information and transparent pricing.

![Settlewick Homepage](https://placehold.co/1200x600/1B3A2D/FFFFFF?text=Settlewick+Property+Portal)

## 🌟 Features

- **Comprehensive Property Data**: Every listing includes detailed specifications, energy ratings, local amenities, and transport links
- **Advanced Search Tools**: Powerful filters, map search, and draw-your-own-area functionality
- **Running Costs Calculator**: See estimated monthly costs including mortgage, council tax, energy bills, and service charges
- **Price History & Analytics**: Track price changes, compare local sold prices, and understand market trends
- **Transparent & Ad-Free**: No premium listings or agent advertising - every property gets equal visibility
- **Built for Portsmouth**: Local insights, area guides, and community knowledge

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS (Forest & Brass theme)
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: Prisma (with PostGIS support via raw queries)
- **Auth**: NextAuth.js (credentials + Google + email magic link)
- **Maps**: Leaflet with OpenStreetMap tiles
- **Image Storage**: Local filesystem (structured for easy migration to S3/Cloudflare R2)
- **Email**: Resend (for alerts and notifications)
- **Search**: PostgreSQL full-text search + trigram indexing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL + PostGIS)
- npm or yarn

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url> settlewick
   cd settlewick
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Database**
   ```bash
   docker compose up -d postgres
   # Wait for PostgreSQL to start (check with: docker compose logs postgres)
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # Seed with Portsmouth properties
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see Settlewick in action!

## 📊 Sample Data

The seed script creates:
- **3 Estate Agents** (Chinneck Shaw, Whiteley & Co, Portsmouth Property Partners)
- **50 Properties** (40 for sale, 10 to rent) across Portsmouth areas
- **200 Sold Prices** from realistic Portsmouth addresses (last 2 years)
- **6 Area Guides** (Southsea, Old Portsmouth, Fratton, Copnor, Cosham, etc.)
- **Test Users**:
  - Admin: `admin@settlewick.com` / `admin123`
  - Agent: `agent@chinneckshaw.co.uk` / `admin123`
  - Buyer: `buyer@example.com` / `admin123`

## 🗄️ Database Schema

### Core Tables
- **Properties**: Comprehensive property data with PostGIS location support
- **Property Images**: Multiple images per property with room tagging
- **Property Price History**: Track price changes over time
- **Agents**: Estate agent information and branding
- **Users**: Multi-role system (admin, agent, buyer/renter)
- **Saved Properties**: User favorites with notes
- **Saved Searches**: Search alerts with frequency settings
- **Sold Prices**: Land Registry data for price comparisons
- **Area Guides**: SEO content for Portsmouth areas

### Key Features
- PostGIS spatial indexing for radius/polygon searches
- Full-text search with trigram indexing for autocomplete
- Comprehensive property feature flags (50+ boolean fields)
- EPC ratings, tenure details, and running costs
- Price history tracking and reduction calculations

## 🎨 Design System

**Forest & Brass Theme** - Premium British aesthetic:

```css
/* Primary Colors */
--primary: #1B3A2D (Deep forest green)
--primary-light: #2D5E4A (Muted forest)
--accent: #B5985A (Aged brass/gold)
--accent-light: #D4C5A0 (Soft gold)

/* Backgrounds */
--background: #FAFAF6 (Soft cream)
--surface: #FFFFFF (White)
--secondary: #EDE8E0 (Warm linen)
```

The design emphasizes clean layouts, generous whitespace, and premium feel - the opposite of cluttered portals like Rightmove.

## 📱 Key Pages

- **Homepage** (`/`): Hero search, features, stats, area guides
- **Property Search** (`/for-sale/[location]`, `/to-rent/[location]`): Advanced filters, map integration
- **Property Detail** (`/property/[slug]`): Full details, image gallery, running costs, local data
- **Sold Prices** (`/sold-prices/[location]`): Land Registry data and price trends
- **Area Guides** (`/area-guide/[slug]`): Local insights and market data
- **Calculators** (`/mortgage-calculator`, `/stamp-duty-calculator`): Interactive tools
- **User Dashboard** (`/dashboard`): Saved properties, searches, and settings
- **Agent Portal** (`/agent`): Property management and analytics

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Environment Variables

```bash
DATABASE_URL="postgresql://settlewick:password@localhost:5432/settlewick"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_xxx" # For email functionality
```

## 🏗️ Project Structure

```
settlewick/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Sample data generation
│   └── migrations/       # Database migrations
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components
│   │   ├── property/     # Property-specific components
│   │   ├── search/       # Search functionality
│   │   ├── map/          # Map components
│   │   └── layout/       # Header, Footer, etc.
│   ├── lib/              # Utilities (db, auth, formatting)
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── docker-compose.yml    # PostgreSQL + PostGIS setup
└── docs/                 # Documentation
```

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Project setup & database schema
- ✅ Homepage with premium design
- ✅ Comprehensive seed data
- 🚧 Property search results with filters
- 🔜 Map integration with Leaflet
- 🔜 Property detail pages

### Phase 2
- 🔜 User authentication & dashboards
- 🔜 Agent portal & listings management
- 🔜 Search alerts & notifications
- 🔜 Mortgage & stamp duty calculators

### Phase 3
- 🔜 Advanced analytics & insights
- 🔜 Mobile app (React Native)
- 🔜 API for third-party integrations
- 🔜 Performance optimization

## 📞 Support

Built with ❤️ in Portsmouth for Portsmouth.

For questions, suggestions, or contributions, please reach out or create an issue.

---

**Settlewick** - Because property search should be done properly.