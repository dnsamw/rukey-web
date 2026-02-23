# Supabase Setup Guide

This guide will help you set up Supabase for the Cleaning Service project.

## Prerequisites

- A Supabase account ([Create one here](https://app.supabase.com))
- Node.js installed locally
- The Supabase CLI (optional but recommended)

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New project"
3. Fill in the project details:
   - **Name**: Choose a meaningful name (e.g., "cleaning-service")
   - **Database Password**: Save this securely
   - **Region**: Choose the region closest to your users
4. Wait for the project to be created

### 2. Get Your Credentials

1. In your Supabase project dashboard, click "Settings" → "API"
2. Copy the following values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_KEY` (keep this secret!)

### 3. Initialize the Database

#### Option A: Using the SQL Editor (Recommended)

1. Go to "SQL Editor" in your Supabase dashboard
2. For each migration file in `supabase/migrations/`, paste the SQL content and run it
3. Run them in order (001, 002, 003, etc.)

#### Option B: Using Supabase CLI

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. Push migrations:
   ```bash
   supabase db push
   ```

### 4. Set Up Authentication

#### Create Admin User

1. Go to "Authentication" → "Users"
2. Click "Create a new user"
3. Enter email and password
4. Save the credentials for logging into the admin panel

#### Configure NextAuth

1. Generate a secret for NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

2. Add to `.env.local`:
   ```env
   NEXTAUTH_SECRET=<generated-secret>
   NEXTAUTH_URL=http://localhost:3000
   ```

### 5. Set Up Storage Buckets

For image uploads, create storage buckets:

1. Go to "Storage" in your Supabase dashboard
2. Create the following buckets:
   - **hero-slides** (for hero carousel images)
   - **service-images** (for service photos)
   - **testimonial-avatars** (for customer avatars)
   - **site-logos** (for site branding)

3. For each bucket, set public access if needed:
   - Click the bucket
   - Go to "Settings"
   - Enable "Public Bucket" if images should be publicly accessible

### 6. Create Policies (Optional but Recommended)

For security, create RLS (Row Level Security) policies:

Example for public read-only services table:
```sql
CREATE POLICY "Enable read access for all users" ON services
  FOR SELECT USING (true);
```

For admin-only writes:
```sql
CREATE POLICY "Enable write access for authenticated admins" ON services
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

### 7. Verify Configuration

Test your Supabase connection by running:

```bash
npm run dev
```

Then try accessing:
- Homepage at http://localhost:3000 (should connect to Supabase)
- Admin dashboard at http://localhost:3000/admin/login

## Database Schema Overview

### hero_slides
- Store carousel slides for the homepage
- Fields: id, title, description, image_url, link, display_order

### services
- Clean service offerings
- Fields: id, title, description, long_description, price, duration, image_url, slug

### testimonials
- Customer reviews and testimonials
- Fields: id, client_name, client_role, rating, text, image_url, display_order

### job_postings
- Career opportunities
- Fields: id, title, description, location, employment_type, salary_min, salary_max, is_active

### quote_requests
- Customer quote requests
- Fields: id, client_name, client_email, client_phone, service_id, message, status

### site_settings
- Global site configuration
- Fields: id, logo_url, primary_color, secondary_color, phone, email, address, city, state, zip_code

## Troubleshooting

### Connection Refused
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify network connectivity
- Check Supabase project status

### Authentication Not Working
- Ensure NEXTAUTH_SECRET is set
- Check that your auth table is properly set up
- Verify environment variables are loaded

### Storage Issues
- Check bucket names match your code
- Ensure buckets are created and accessible
- Verify bucket policies if using RLS

### Type Generation

After making schema changes, regenerate types:

```bash
# You need the Supabase CLI installed
supabase gen types typescript --local > lib/database.types.ts
```

Or in the dashboard:
1. Go to "SQL Editor"
2. Run `select * from information_schema.tables;`
3. Check your table names match the code

## Security Best Practices

1. **Never commit `.env.local`** - It contains sensitive keys
2. **Use `.env.example`** - Keep a template for environment variables
3. **Enable RLS** - Use Row Level Security for production
4. **Service Role Key** - Keep `SUPABASE_SERVICE_KEY` secret, never expose to client
5. **Anon Key** - Safe to expose in `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Resources

- [Supabase Documentation](https://supabase.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Auth Guide](https://supabase.io/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.io/docs/guides/storage)

## Next Steps

After setting up Supabase:

1. Update the component files to actually fetch data from your database
2. Configure authentication in the admin panel
3. Set up email notifications for quote requests
4. Configure storage for image uploads

For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).
