# Flepz - Secure Notification Inbox

A centralized, secure inbox for transactional notifications from commercial businesses.

## Features

- 🔐 Secure authentication with magic links
- 📬 Centralized inbox for all transactional messages
- ⚙️ User preferences for message types
- 🚀 API for secure message ingestion
- 🛡️ Row Level Security (RLS) for data protection

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase CLI
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/flepz-core.git
   cd flepz-core
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   ```bash
   supabase start
   ```

4. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

5. **Run database migrations**
   ```bash
   supabase db push
   ```

6. **Deploy Edge Functions**
   ```bash
   supabase functions deploy ingest-message
   ```

7. **Start development server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Usage

Send messages to the ingest endpoint:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/ingest-message \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "sender_domain": "shop.example.com",
    "recipient_email": "user@example.com",
    "type": "order",
    "payload": {
      "order_id": "12345",
      "amount": 99.99
    }
  }'
```

## Architecture

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Security**: TLS 1.3, RLS policies, API key authentication

## License

MIT