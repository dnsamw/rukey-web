# Cleaning Service Website

A modern, full-stack web application for a professional cleaning service, built with Next.js 16, TypeScript, Tailwind CSS, Redux Toolkit, and Supabase.

## Project Structure

```
cleaning-service/
├── app/
│   ├── (public)/                    # Public-facing website
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Home
│   │   ├── about/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx             # All services
│   │   │   └── [slug]/page.tsx      # Individual service
│   │   ├── get-a-quote/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── staff-recruitment/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── admin/                       # Admin panel (protected)
│   │   ├── layout.tsx               # Admin shell with sidebar
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── hero/page.tsx            # Edit hero slides
│   │   ├── services/page.tsx        # Edit services
│   │   ├── about/page.tsx           # Edit about section
│   │   ├── testimonials/page.tsx    # Manage testimonials
│   │   ├── careers/page.tsx         # Manage job postings
│   │   ├── quotes/page.tsx          # View quote requests
│   │   └── settings/page.tsx        # Site-wide settings
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── upload/route.ts           # Image uploads to Supabase Storage
│       └── revalidate/route.ts       # ISR revalidation trigger
│
├── components/
│   ├── public/                      # Frontend components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── ServicesGrid.tsx
│   │   │   ├── VisionMissionValues.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── services/
│   │   │   ├── ServiceCard.tsx
│   │   │   └── ServiceDetail.tsx
│   │   └── shared/
│   │       ├── CTAButton.tsx
│   │       └── SectionHeading.tsx
│   │
│   └── admin/                       # Admin UI components
│       ├── layout/
│       │   ├── AdminSidebar.tsx
│       │   └── AdminHeader.tsx
│       ├── editors/
│       │   ├── RichTextEditor.tsx
│       │   ├── ImageUploader.tsx
│       │   ├── SlideEditor.tsx
│       │   └── ServiceEditor.tsx
│       └── ui/
│           ├── DataTable.tsx
│           ├── ConfirmDialog.tsx
│           └── Toast.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client
│   │   └── middleware.ts
│   ├── utils/
│   │   ├── imageUpload.ts
│   │   └── formatters.ts
│   └── constants/
│       └── navigation.ts
│
├── store/                           # Redux Toolkit
│   ├── index.ts
│   ├── slices/
│   │   ├── heroSlice.ts
│   │   ├── servicesSlice.ts
│   │   ├── siteSettingsSlice.ts
│   │   └── adminUISlice.ts
│   └── hooks.ts
│
├── types/
│   ├── database.types.ts            # Auto-generated from Supabase
│   ├── hero.ts
│   ├── service.ts
│   └── settings.ts
│
├── middleware.ts                     # Protect /admin routes
└── supabase/
    └── migrations/
        ├── 001_hero_slides.sql
        ├── 002_services.sql
        ├── 003_testimonials.sql
        ├── 004_careers.sql
        ├── 005_quote_requests.sql
        └── 006_site_settings.sql
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account (for database and authentication)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables by creating a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Public Website**: Landing page, services catalog, careers, testimonials, contact form
- **Admin Dashboard**: Manage content (hero slides, services, testimonials, job postings)
- **Authentication**: NextAuth with Supabase adapter
- **Database**: Supabase PostgreSQL with pre-configured tables
- **Storage**: Image uploads to Supabase Storage
- **State Management**: Redux Toolkit for global state
- **Type Safety**: Full TypeScript support
- **Styling**: Tailwind CSS for modern responsive design
- **ISR**: Incremental Static Regeneration for optimized performance

## Database Setup

Initialize Supabase migrations:
```bash
supabase migration up
```

Or apply individual migrations manually in the Supabase dashboard.

## Development

The app is structured with two main routes:
- `/` - Public-facing website
- `/admin` - Protected admin dashboard (requires authentication)

Edit pages in `app/` and components will auto-reload thanks to Next.js hot reloading.

## Deployment

Deploy to Vercel with one click or run:
```bash
npm run build
npm run start
```

Make sure to set environment variables on your hosting platform.

## Technologies Used

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth
- **Storage**: Supabase Storage

## License

This project is private and for internal use only.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
