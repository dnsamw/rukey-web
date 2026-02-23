# Development Guide

## Project Setup

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local

# Fill in .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_KEY=...
# NEXTAUTH_SECRET=... (generate with: openssl rand -base64 32)
```

### 2. Database Setup

Make sure you have a Supabase project created. Then:

```bash
# Initialize Supabase migrations
npm run db:migrate
```

Or apply migrations manually in the Supabase dashboard:
- Navigate to the SQL editor
- Run each migration file in order (001 - 006)

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure Overview

### Public Routes
- `/` - Home page
- `/about` - About page
- `/services` - Services listing
- `/services/[slug]` - Individual service detail
- `/get-a-quote` - Quote request form
- `/careers` - Careers page
- `/staff-recruitment` - Staff recruitment info
- `/contact` - Contact page

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard overview
- `/admin/hero` - Manage hero slides
- `/admin/services` - Manage services
- `/admin/about` - Manage about section
- `/admin/testimonials` - Manage testimonials
- `/admin/careers` - Manage job postings
- `/admin/quotes` - View quote requests
- `/admin/settings` - Site settings

## Component Development

### Public Components
All public-facing components should be marked with `'use client'` if they use client-side features.

```tsx
// components/public/layout/Navbar.tsx
'use client';

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* content */}
    </nav>
  );
}
```

### Admin Components
Similar to public components, but they're used within the admin layout.

```tsx
// components/admin/editors/ServiceEditor.tsx
'use client';

export default function ServiceEditor() {
  return (
    <div className="editor">
      {/* content */}
    </div>
  );
}
```

## State Management with Redux

### Using Redux Hooks

```tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setServices, addService } from '@/store/slices/servicesSlice';

export default function ServiceManager() {
  const dispatch = useAppDispatch();
  const services = useAppSelector((state) => state.services.services);

  const handleAddService = (service: Service) => {
    dispatch(addService(service));
  };

  return (
    <div>
      {services.map((service) => (
        <div key={service.id}>{service.title}</div>
      ))}
    </div>
  );
}
```

## Database Operations

### Supabase Client (Browser)

```tsx
import { supabase } from '@/lib/supabase/client';

// Fetch data
const { data, error } = await supabase
  .from('services')
  .select('*')
  .eq('id', serviceId);

// Insert data
const { data, error } = await supabase
  .from('services')
  .insert([{ title: 'New Service', price: 100 }]);
```

### Supabase Server Client

```tsx
import { supabaseServer } from '@/lib/supabase/server';

// Use in server components or API routes
const { data, error } = await supabaseServer
  .from('services')
  .select('*');
```

## Image Upload

```tsx
import { uploadImage } from '@/lib/utils/imageUpload';

const handleImageUpload = async (file: File) => {
  const url = await uploadImage(file, 'service-images');
  // Use the URL in your application
};
```

## Authentication

The project uses NextAuth with Supabase. Authentication is handled in:
- `app/api/auth/[...nextauth]/route.ts` - Auth configuration
- `middleware.ts` - Route protection

Protected routes are enforced in the middleware.

## Styling

The project uses Tailwind CSS. Main style file:
- `app/globals.css` - Global styles

## API Routes

### Image Upload
```
POST /api/upload
```

### ISR Revalidation
```
POST /api/revalidate
Body: { path: '/path-to-revalidate' }
```

### NextAuth
```
GET/POST /api/auth/[...nextauth]
```

## Environment Variables

Required environment variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

## Key Dependencies

- **next** - React framework
- **react** & **react-dom** - UI library
- **@reduxjs/toolkit** - State management
- **react-redux** - Redux bindings for React
- **@supabase/supabase-js** - Supabase client
- **next-auth** - Authentication
- **tailwindcss** - CSS framework
- **typescript** - Type safety

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Database migrations
npm run db:migrate
```

## Tips & Best Practices

1. **Keep components small**: Split larger components into smaller, reusable pieces.
2. **Use TypeScript**: Define proper types for props, state, and database models.
3. **Database types**: Keep `types/database.types.ts` updated by running Supabase type generation.
4. **Image optimization**: Always use Next.js `Image` component for optimization.
5. **Authentication**: Never expose sensitive credentials; use environment variables.
6. **Error handling**: Always handle errors in API routes and async operations.
7. **Loading states**: Show loading indicators while fetching data.

## Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Supabase Connection Issues
1. Check that your `.env.local` variables are correct
2. Verify your Supabase project is running
3. Check network connectivity

### TypeScript Errors
Run the TypeScript compiler to check for errors:
```bash
npx tsc --noEmit
```

## Support

For more information:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/usage/usage-guide)
