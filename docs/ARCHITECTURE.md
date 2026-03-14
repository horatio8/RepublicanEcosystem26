# Republican Ecosystem Mapper — Architecture & Plan

## System Overview

A continuously-updated intelligence platform that maps the US Republican/right-wing political ecosystem, tracking organizations, people, money flows, relationships, and events.

## Core Components

### 1. AirTable Database (Central Data Store)
The single source of truth, editable by non-technical users through AirTable's native UI.

**Tables:**
- **Organizations** — PACs, Super PACs, 501(c)(3)s, 501(c)(4)s, businesses, think tanks, media orgs, consulting firms, law firms, lobbying firms
- **People** — Candidates, staffers, board members, donors, consultants, lobbyists, media figures
- **Relationships** — Links between any two entities (org↔org, person↔org, person↔person) with type, dates, and notes
- **Events** — Conferences, fundraisers, rallies, galas, town halls, committee hearings
- **Financial Records** — Revenue, donations, expenditures (sourced from FEC, IRS 990s, OpenSecrets)
- **Research Log** — Automated research findings pending human review
- **Prominence Scores** — Time-series tracking of each entity's prominence (media mentions, fundraising, social media)

### 2. Network Visualization (Web App)
Interactive force-directed graph built with D3.js, deployed as a static site.

- Nodes = Organizations + People, sized by revenue/prominence
- Edges = Relationships, colored by type (financial, personnel, advisory, etc.)
- Filters by category, state, prominence trend, date range
- Click-through to AirTable record for editing
- Cluster detection to identify power centers
- Timeline slider to see ecosystem evolution

### 3. Event Scraper & Calendar System
Automated pipeline that discovers events and delivers them as calendar invites.

**Scraping targets:**
- Eventbrite (political/conservative categories)
- GOP event pages (RNC, state parties)
- Think tank event pages (Heritage, AEI, Cato, Manhattan Institute, etc.)
- Conservative conference sites (CPAC, Turning Point, etc.)
- FEC-reported fundraiser events
- Meetup.com (conservative/Republican groups)
- Social media event announcements

**Calendar delivery:**
- Events stored in AirTable → synced to Google Calendar
- Sends ICS invites to james@teller.consulting
- Categorized/tagged so you can filter by type, region, organization

### 4. Research Agent (Continuous Updates)
Scheduled jobs that discover new entities and update prominence scores.

**Data sources:**
- FEC API (campaign finance filings)
- IRS 990 data (nonprofit financials via ProPublica API)
- OpenSecrets API (lobbying, PAC data)
- Google News API (media mention tracking)
- Congressional API (bills, votes, committee assignments)
- State-level campaign finance databases
- Social media APIs (follower counts, engagement)

**Workflow:**
1. Scheduled cron jobs fetch new data daily/weekly
2. New entities flagged in "Research Log" table for human review
3. Prominence scores recalculated and trended
4. Relationships inferred from shared board members, donors, addresses

### 5. Additional Revenue-Maximizing Features

- **Influence Flow Analysis**: Track how money and people move between orgs to predict future alliances
- **Donor Intelligence**: Identify top donors, their giving patterns, and which orgs they fund
- **Rising Stars Dashboard**: Auto-detect entities with fastest-growing prominence
- **Geographic Heat Map**: Overlay events and org activity on a US map
- **Alert System**: Email/Slack notifications when key entities make moves (new filings, leadership changes, events)
- **Competitive Intel**: Track which consulting firms service which PACs/campaigns — identify prospects
- **Report Generator**: Auto-generate briefing documents for specific entities or sectors
- **API Access**: REST API so you can integrate this data into your own tools/CRM

## Cloud Infrastructure

### Deployment Architecture (AWS)
```
┌─────────────────────────────────────────────────────┐
│                    CloudFront CDN                     │
│              (Frontend static site)                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  ECS Fargate  │  │  ECS Fargate  │  │  EventBridge│ │
│  │  (API Server) │  │  (Scrapers)   │  │  (Scheduler)│ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                  │                 │        │
│  ┌──────┴──────────────────┴─────────────────┘       │
│  │                                                    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │  │  AirTable   │  │   SES      │  │  Google     │  │
│  │  │  (Database) │  │  (Email)   │  │  Calendar   │  │
│  │  └────────────┘  └────────────┘  └────────────┘  │
│  │                                                    │
│  │  ┌────────────┐  ┌────────────┐                   │
│  │  │  S3        │  │  CloudWatch │                   │
│  │  │  (Storage) │  │  (Logging)  │                   │
│  └──┴────────────┘  └────────────┘                   │
└─────────────────────────────────────────────────────┘
```

### Cost Estimate
- ECS Fargate (API + Scrapers): ~$30-50/month
- CloudFront + S3: ~$5/month
- AirTable Pro: ~$20/month per seat
- Domain + SSL: ~$15/year
- Total: ~$60-80/month

## Tech Stack
- **Backend**: Python 3.12 (FastAPI)
- **Frontend**: React + D3.js (Vite)
- **Infrastructure**: Terraform + Docker
- **Scheduling**: AWS EventBridge (cron)
- **Container Orchestration**: ECS Fargate
- **CI/CD**: GitHub Actions
- **Monitoring**: CloudWatch + email alerts
