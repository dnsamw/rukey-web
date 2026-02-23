# Quick Start Guide

Get the Cleaning Service website up and running in 5 minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (optional, for backend)

## 🚀 Quick Start

### 1. Install Dependencies (1 min)
```bash
npm install
```

### 2. Configure Environment (2 min)
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
# (Get these from https://app.supabase.com)
```

For local development without Supabase, you can leave the values as placeholders.

### 3. Start Development Server (1 min)
```bash
npm run dev
```

### 4. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) to see:
- Public website homepage
- Navigation to Services, About, Careers, Contact, etc.

Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to see:
- Admin login page
- Admin dashboard (after setting up auth)

## 📁 Project Structure Overview

```
cleaning-service/
├── app/(public)/              # Public website pages
├── app/admin/                 # Protected admin pages
├── components/                # React components
├── lib/                       # Utilities and helpers
├── store/                     # Redux state management
└── types/                     # TypeScript type definitions
```

## 🔧 Key Features Ready to Use

- ✅ **Route Groups**: Organized public and admin routes
- ✅ **Components**: Pre-built layout and admin components
- ✅ **State Management**: Redux Toolkit configured
- ✅ **Database**: Supabase migrations ready
- ✅ **Authentication**: NextAuth setup
- ✅ **Styling**: Tailwind CSS ready
- ✅ **TypeScript**: Full type safety

## 📝 Available Routes

### Public Routes
- `/` - Homepage
- `/about` - About page
- `/services` - Services listing
- `/services/[slug]` - Service detail
- `/get-a-quote` - Quote request form
- `/careers` - Jobs page
- `/staff-recruitment` - Recruitment info
- `/contact` - Contact page

### Admin Routes
- `/admin/login` - Login page
- `/admin/dashboard` - Dashboard
- `/admin/hero` - Manage hero slides
- `/admin/services` - Manage services
- `/admin/about` - Manage about section
- `/admin/testimonials` - Manage testimonials
- `/admin/careers` - Manage jobs
- `/admin/quotes` - View quote requests
- `/admin/settings` - Site settings

## 🎨 Customization

### Update Site Name
1. Edit `package.json` name field
2. Update `README.md` title
3. Update metadata in `app/layout.tsx`
4. Update Navbar component in `components/public/layout/Navbar.tsx`

### Update Styling
- Modify colors in `app/globals.css`
- Use Tailwind classes in components
- Customize theme in `tailwind.config.mjs`

### Add New Pages
```bash
# Create new page in public routes
mkdir -p app/\(public\)/new-page
echo "export default function NewPage() { return <div>New Page</div>; }" > app/\(public\)/new-page/page.tsx
```

## 🗄️ Database Setup (Optional)

For a full setup with backend:

1. Create Supabase account at [supabase.com](https://supabase.com)
2. Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Update `.env.local` with your credentials
4. Run database migrations

## 📚 Learn More

- **Development Details**: See [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Database Guide**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

## 🐛 Troubleshooting

### Port 3000 in Use?
```bash
# Change port
npm run dev -- -p 3001
```

### Dependencies Not Installing?
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### TypeScript Errors?
```bash
# Check types
npx tsc --noEmit
```

## 📞 Common Tasks

### Build for Production
```bash
npm run build
npm run start
```

### Lint Code
```bash
npm run lint
```

### Update Dependencies
```bash
npm outdated
npm update
```

## 🔐 Security Notes

⚠️ Never commit `.env.local` to git  
⚠️ Keep `SUPABASE_SERVICE_KEY` secret  
⚠️ Use strong passwords for admin accounts  

## ✨ What's Next?

1. **Customize Colors & Brand**: Update the styling and layouts
2. **Add Real Content**: Replace placeholder text with your company info
3. **Set Up Supabase**: Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
4. **Configure Admin**: Set up authentication and connect to database
5. **Deploy**: Push to Vercel or your hosting provider

## 🤝 Support

For issues or questions:
1. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed guides
2. Review original file comments (most have comments explaining usage)
3. Check Next.js and Supabase documentation
4. Review environment configuration

---

**Ready to start building?** Run `npm run dev` and visit http://localhost:3000! 🎉
