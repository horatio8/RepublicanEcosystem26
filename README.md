# Republican Ecosystem Mapper

A continuously-updated intelligence platform that maps the US Republican/right-wing political ecosystem — tracking organizations, people, money flows, relationships, and events.

## Features

### 1. AirTable Database
Central database of PACs, candidates, nonprofits, think tanks, media orgs, consulting firms, and more. Editable by non-technical users through AirTable's native UI.

**7 tables:** Organizations, People, Relationships, Events, Financial Records, Research Log, Prominence Scores

### 2. Network Visualization
Interactive force-directed graph showing the ecosystem:
- **Nodes** = Organizations + People, sized by revenue/prominence
- **Edges** = Relationships (financial, personnel, advisory, etc.)
- Search, filter by category/state/prominence
- Click any node for details + link to AirTable
- Rising Stars dashboard for trending entities

### 3. Event Scraper & Calendar
Automated pipeline that scrapes events from 14+ conservative organizations and delivers them as Google Calendar invites you can accept/deny.

**Sources:** Heritage Foundation, AEI, Cato, Federalist Society, CPAC, Turning Point, NRA, and more.

### 4. Research Agent
Scheduled jobs that continuously discover new entities and update prominence scores:
- **FEC API** — PACs, committees, candidates, donations
- **ProPublica** — Nonprofit financials (IRS 990 data)
- **OpenSecrets** — Lobbying, donor data
- **News API** — Media mention tracking for prominence scoring

### 5. Revenue-Maximizing Features
- **Influence Flow Analysis** — Track money/people movement between orgs
- **Donor Intelligence** — Identify giving patterns and donor networks
- **Rising Stars Dashboard** — Auto-detect fastest-growing entities
- **Alert System** — Notifications on key entity changes
- **API Access** — REST API for integration with your CRM/tools

## Quick Start

### Prerequisites
- Docker & Docker Compose
- AirTable account (Pro plan, ~$20/mo)
- API keys (FEC, OpenSecrets, ProPublica, News API — all free)

### 1. Configure
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

### 2. Set up AirTable
```bash
python -m backend.scripts.setup_airtable
# Follow the instructions to create tables in your AirTable base
```

### 3. Deploy Locally
```bash
./deploy.sh local
```

### 4. Seed Initial Data
```bash
docker compose exec backend python -m backend.scripts.seed_data
```

### 5. Open
- **Frontend:** http://localhost
- **API:** http://localhost:8000/docs

## Deploy to AWS

```bash
./deploy.sh aws
```

This creates: ECS Fargate cluster, ALB, ECR repos, CloudWatch logging.
Estimated cost: ~$60-80/month.

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/graph` | Full network graph (with filters) |
| `GET /api/organizations` | List organizations |
| `GET /api/people` | List people |
| `GET /api/relationships` | List relationships |
| `GET /api/events` | List events |
| `GET /api/stats` | Ecosystem statistics |
| `POST /api/jobs/scrape-events` | Trigger event scrape |
| `POST /api/jobs/research-fec` | Trigger FEC research |
| `POST /api/jobs/send-invites` | Send calendar invites |

## Scheduled Jobs

| Job | Frequency | Description |
|---|---|---|
| Event Scraper | Every 6 hours | Scrapes 14+ conservative org websites |
| Calendar Invites | Every 2 hours | Sends new event invites to your email |
| FEC Research | Daily | Discovers new PACs, committees, candidates |
| Nonprofit Research | Weekly | Updates 990 financial data |
| Prominence Scoring | Daily | Recalculates entity prominence scores |

## Architecture

```
AirTable (database) ←→ FastAPI Backend ←→ React + D3.js Frontend
                         ↑
                    Scheduled Jobs
                    ├── Event Scraper
                    ├── FEC Researcher
                    ├── Nonprofit Researcher
                    ├── News Tracker
                    └── Calendar Sender
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details.
