# Flepz Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase CLI
- Git

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/flepz-core.git
cd flepz-core
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Setup Supabase

#### Start Supabase locally
```bash
supabase start
```

This will start:
- PostgreSQL database
- Auth server
- Storage server
- Edge Functions runtime

#### Get local credentials
```bash
supabase status
```

Note down:
- API URL
- anon key
- service_role key

### 4. Configure Environment Variables

Create `.env.local` in the frontend directory:
```bash
cp .env.local.example frontend/.env.local
```

Update with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
INGEST_API_KEY=generate_a_secure_key_here
```

### 5. Run Database Migrations
```bash
supabase db push
```

### 6. Deploy Edge Functions
```bash
supabase functions deploy ingest-message
```

### 7. Seed Sample Data (Optional)
```bash
cd infra/scripts
npm install dotenv @supabase/supabase-js
npx ts-node seed.ts
```

### 8. Start the Development Server
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Production Deployment

### 1. Create Supabase Project
1. Go to https://app.supabase.com
2. Create a new project
3. Note your project URL and keys

### 2. Run Migrations
```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 3. Deploy Edge Functions
```bash
supabase functions deploy ingest-message --project-ref your-project-ref
```

### 4. Set Edge Function Secrets
```bash
supabase secrets set INGEST_API_KEY=your_production_api_key --project-ref your-project-ref
```

### 5. Deploy Frontend

#### Vercel
```bash
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

#### Other Platforms
Follow platform-specific deployment guides for Next.js applications.

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Supabase Auth settings
   - Verify redirect URLs are configured
   - Ensure email templates are set up

2. **Messages not appearing**
   - Check RLS policies
   - Verify user preferences
   - Check browser console for errors

3. **Edge Function errors**
   - Check function logs: `supabase functions logs ingest-message`
   - Verify API key is set correctly
   - Check CORS configuration

### Debug Mode

Enable debug logging:
```javascript
// In frontend/lib/supabase.ts
const supabase = createClient(url, key, {
  auth: {
    debug: true
  }
})
```

## Support

For issues and questions:
- Check the documentation in `/docs`
- Review GitHub issues
- Contact support at support@flepz.com