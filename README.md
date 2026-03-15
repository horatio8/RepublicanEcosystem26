# Republican Ecosystem Mapper

A continuously-updated intelligence platform that maps the US Republican/right-wing political ecosystem — tracking organizations, people, money flows, relationships, and events.

**Deployed on Vercel + Supabase** — no servers to manage.

## Features

### 1. Supabase Database (editable table UI)
PostgreSQL database with 7 tables, accessible through Supabase Studio's spreadsheet-like UI for non-technical users to browse and edit records directly.

**Tables:** Organizations, People, Relationships, Events, Financial Records, Research Log, Prominence Scores

### 2. Network Visualization
Interactive D3.js force-directed graph:
- Nodes sized by revenue, colored by entity type
- Edges show relationships (financial, coalition, founding, employment, etc.)
- Search, filter by category/state/prominence
- Hover to highlight connections, click for detail panel
- Rising Stars dashboard for trending entities

### 3. Event Scraper & Calendar Invites
Vercel Cron scrapes events every 6 hours from 14+ sources (Heritage, AEI, Cato, CPAC, Turning Point, NRA, etc.) and sends Google Calendar invites to `james@teller.consulting`.

### 4. Research Agents
Automated daily jobs pull data from:
- **FEC API** — PACs, committees, candidates, donations
- **ProPublica** — Nonprofit financials (IRS 990s)
- **News API** — Media mention tracking for prominence scoring

### 5. Revenue-Maximizing Features
- **Influence Flow Analysis** — Track money/people movement between orgs
- **Donor Intelligence** — Identify giving patterns
- **Rising Stars Dashboard** — Auto-detect fastest-growing entities
- **Competitive Intel** — Track which firms service which PACs
- **REST API** — All data available via `/api/*` endpoints

## Architecture

```
Vercel (Next.js)                    Supabase
┌─────────────────────┐      ┌─────────────────┐
│  React Frontend     │      │  PostgreSQL DB   │
│  (D3.js graph)      │◄────►│  (7 tables)      │
│                     │      │                  │
│  API Routes         │      │  Supabase Studio │
│  /api/graph         │      │  (table editor)  │
│  /api/organizations │      │                  │
│  /api/events        │      │  Row Level       │
│  /api/stats         │      │  Security        │
│                     │      └─────────────────┘
│  Cron Jobs          │
│  - Scrape events    │      External APIs
│  - FEC research     │◄────►  FEC, ProPublica,
│  - Send invites     │        NewsAPI, Google
└─────────────────────┘        Calendar
```

## Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run:
   - `supabase/migrations/001_create_tables.sql` (creates all tables + RLS)
   - `supabase/migrations/002_seed_data.sql` (seeds 30 organizations + 21 relationships)
3. Copy your project URL, anon key, and service role key from **Settings > API**

### 2. Configure Environment
```bash
cp .env.local.example .env.local
# Fill in your Supabase keys and API keys
```

### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - FEC_API_KEY
# - CRON_SECRET (random string for cron auth)
# - GOOGLE_CREDENTIALS_JSON (for calendar invites)
# - CALENDAR_RECIPIENT_EMAIL
```

### 4. Run Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Vercel Cron Schedule

| Job | Schedule | Endpoint |
|---|---|---|
| Scrape Events | Every 6 hours | `/api/jobs/scrape-events` |
| FEC Research | Daily at 3am | `/api/jobs/research-fec` |
| Send Calendar Invites | Every 2 hours | `/api/jobs/send-invites` |

Cron jobs are defined in `vercel.json` and run automatically on Vercel Pro.

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/graph` | Full network graph (supports `?category=`, `?state=`, `?min_prominence=`) |
| `GET /api/organizations` | List organizations |
| `GET /api/people` | List people |
| `GET /api/events` | List events (`?upcoming=true`) |
| `GET /api/stats` | Ecosystem statistics |
| `POST /api/jobs/scrape-events` | Trigger event scrape |
| `POST /api/jobs/research-fec` | Trigger FEC research |
| `POST /api/jobs/send-invites` | Send pending calendar invites |

## Editing Data

Non-technical users can edit data directly through **Supabase Studio**:
1. Go to your Supabase project dashboard
2. Click **Table Editor** in the sidebar
3. Edit any table like a spreadsheet — add, update, or delete records
4. Changes are immediately reflected in the visualization

## Cost

- **Vercel Pro**: $20/month (includes cron jobs, serverless functions)
- **Supabase Free**: $0/month (generous free tier: 500MB DB, 2GB bandwidth)
- **Supabase Pro**: $25/month (if you need more — 8GB DB, 250GB bandwidth)
- **Total: $20-45/month**

## Seed Data Included

The migration seeds **30 major conservative organizations** including:
- RNC, Heritage Foundation, AEI, Federalist Society, AFP
- Koch Industries, Club for Growth, NRA, Turning Point USA
- Fox News, Daily Wire, PragerU, Hillsdale College
- Senate Leadership Fund, Congressional Leadership Fund
- Alliance Defending Freedom, Cato Institute, Claremont Institute
- And **21 relationships** between them (coalitions, funding, founding)
