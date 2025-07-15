# Flepz Architecture Documentation

## Overview

Flepz is a secure, centralized inbox for transactional notifications built with modern web technologies prioritizing security, scalability, and developer experience.

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase Auth Helpers**: Simplified authentication flow

### Backend
- **Supabase**: Backend-as-a-Service platform
  - **PostgreSQL**: Primary database
  - **Auth**: JWT-based authentication with magic links
  - **Edge Functions**: Serverless message ingestion
  - **Row Level Security**: Fine-grained access control

### Infrastructure
- **GitHub Actions**: CI/CD pipeline
- **Trivy**: Security vulnerability scanning
- **TLS 1.3**: Encryption in transit

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  External APIs  │────▶│  Edge Function  │────▶│   PostgreSQL    │
│                 │     │ (ingest-message)│     │    Database     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                        │
         │ x-api-key            │ Service Role          │ RLS
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   API Gateway   │     │  Supabase Auth  │     │   Message Store │
│                 │     │  (Magic Links)  │     │   (with RLS)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                 │                        │
                                 │ JWT                   │ Queries
                                 ▼                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │  Next.js App    │────▶│  Supabase Client│
                        │   (Frontend)    │     │   (Anon Key)    │
                        └─────────────────┘     └─────────────────┘
```

## Security Architecture

### Authentication Flow
1. User enters email on login page
2. Supabase sends magic link to email
3. User clicks link, redirected to callback URL
4. Session created with JWT token
5. Token stored in httpOnly cookie

### Authorization
- **Row Level Security (RLS)**: Database-level access control
- **Policies**: Based on JWT claims (email, user_id)
- **API Key**: Separate authentication for message ingestion

### Data Flow
1. **Message Ingestion**:
   - External service calls Edge Function with API key
   - Function validates key and message format
   - Message stored with recipient email
   
2. **Message Retrieval**:
   - User authenticates via magic link
   - Frontend queries messages using anon key
   - RLS ensures users only see their messages

## Database Schema

### Tables

#### users
- Stores user profiles
- Automatically created on first login
- Links to auth.users table

#### messages
- Core message storage
- Indexed on recipient_email and created_at
- JSONB payload for flexibility

#### preferences
- User notification preferences
- Composite unique constraint on (user_id, message_type)
- Enables filtering in the UI

### Security Policies

```sql
-- Messages: Users can only read their own
messages WHERE recipient_email = auth.jwt() ->> 'email'

-- Users: Can read/update own profile
users WHERE id = auth.uid()

-- Preferences: Full CRUD on own preferences
preferences WHERE user_id = auth.uid()
```

## Performance Considerations

### Frontend Optimization
- Static generation where possible
- Dynamic imports for code splitting
- Image optimization with Next.js Image
- Tailwind CSS purging unused styles

### Backend Optimization
- Database indexes on frequently queried columns
- Connection pooling via Supabase
- Edge Functions for low latency
- Efficient RLS policies

### Caching Strategy
- Static assets cached via CDN
- Database query results cached in React Query
- Session data cached in cookies

## Scalability

### Horizontal Scaling
- Stateless frontend can scale infinitely
- Supabase handles database scaling
- Edge Functions auto-scale with demand

### Rate Limiting
- API ingestion: 1000 req/hour per key
- Frontend: Supabase built-in limits
- Custom limits via Edge Function logic

## Monitoring and Observability

### Metrics
- Edge Function execution time
- Database query performance
- API response times
- Error rates

### Logging
- Structured logging in Edge Functions
- Frontend error boundary logging
- Database query logging

### Alerting
- Function failures
- High error rates
- Database connection issues
- Security violations

## Disaster Recovery

### Backup Strategy
- Daily database backups (Supabase)
- Point-in-time recovery available
- Code versioned in Git

### Failover
- Multi-region Supabase deployment
- CDN for static assets
- Graceful degradation in UI

## Development Workflow

### Local Development
1. Supabase local instance
2. Hot reload with Next.js
3. Type checking with TypeScript
4. Local Edge Function testing

### CI/CD Pipeline
1. GitHub Actions on push/PR
2. Linting and type checking
3. Unit and integration tests
4. Security scanning with Trivy
5. Automated deployment

### Deployment Strategy
- Blue-green deployments
- Feature flags for gradual rollout
- Rollback capability
- Zero-downtime deployments