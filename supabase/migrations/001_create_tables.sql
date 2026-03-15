-- Republican Ecosystem Mapper — Supabase Schema
-- All tables with RLS enabled for secure access

-- ══════════════════════════════════════════════════════════════════
-- ENUMS
-- ══════════════════════════════════════════════════════════════════

CREATE TYPE org_category AS ENUM (
  'PAC', 'Super PAC', '501(c)(3) Nonprofit', '501(c)(4) Nonprofit',
  '527 Organization', 'Think Tank', 'Media Organization',
  'Consulting Firm', 'Law Firm', 'Lobbying Firm', 'Trade Association',
  'Campaign Committee', 'State Party', 'National Party Committee',
  'Leadership PAC', 'Joint Fundraising Committee',
  'Business / Corporation', 'Religious Organization',
  'Grassroots Organization', 'Digital / Tech Firm', 'Polling Firm', 'Other'
);

CREATE TYPE person_role AS ENUM (
  'Elected Official', 'Candidate', 'Party Official', 'Staffer',
  'Consultant', 'Lobbyist', 'Donor', 'Board Member', 'Executive',
  'Media Figure', 'Operative', 'Lawyer', 'Pollster', 'Strategist',
  'Fundraiser', 'Volunteer Leader', 'Other'
);

CREATE TYPE relationship_type AS ENUM (
  'Employment', 'Board Membership', 'Consulting', 'Donation / Financial',
  'Lobbying', 'Legal Representation', 'Vendor / Service Provider',
  'Joint Fundraising', 'Coalition Partner', 'Subsidiary / Parent',
  'Shared Leadership', 'Endorsement', 'Advisory', 'Founding',
  'Volunteer', 'Other'
);

CREATE TYPE event_type AS ENUM (
  'Conference', 'Fundraiser', 'Gala / Dinner', 'Rally', 'Town Hall',
  'Committee Hearing', 'Policy Summit', 'Training / Workshop',
  'Networking Event', 'Book Signing / Media Event', 'Protest / March',
  'Prayer Breakfast', 'Debate', 'Other'
);

CREATE TYPE prominence_trend AS ENUM ('Rising', 'Stable', 'Declining');

CREATE TYPE party_affiliation AS ENUM (
  'Republican', 'Democrat', 'Independent', 'Libertarian', 'Other'
);

CREATE TYPE financial_record_type AS ENUM (
  'Revenue', 'Expenditure', 'Donation Received', 'Donation Made',
  'Lobbying Spend', 'Independent Expenditure'
);

CREATE TYPE finding_type AS ENUM (
  'New Entity', 'New Relationship', 'Financial Update',
  'Leadership Change', 'New Event', 'Prominence Change', 'Other'
);

CREATE TYPE finding_status AS ENUM (
  'Pending Review', 'Approved', 'Rejected', 'Applied'
);

-- ══════════════════════════════════════════════════════════════════
-- TABLES
-- ══════════════════════════════════════════════════════════════════

CREATE TABLE organizations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  category      org_category,
  description   text,
  website       text,
  state         text,
  city          text,
  founded_year  integer,
  annual_revenue bigint DEFAULT 0,
  employee_count integer,
  fec_id        text,
  ein           text,
  opensecrets_id text,
  social_media  jsonb DEFAULT '{}',
  prominence_score numeric(5,1) DEFAULT 0,
  prominence_trend prominence_trend DEFAULT 'Stable',
  data_source   text,
  verified      boolean DEFAULT false,
  notes         text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TABLE people (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  role          person_role,
  title         text,
  description   text,
  state         text,
  party         party_affiliation DEFAULT 'Republican',
  office        text,
  website       text,
  social_media  jsonb DEFAULT '{}',
  prominence_score numeric(5,1) DEFAULT 0,
  prominence_trend prominence_trend DEFAULT 'Stable',
  data_source   text,
  verified      boolean DEFAULT false,
  notes         text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TABLE relationships (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_a_id       uuid,
  entity_a_type     text CHECK (entity_a_type IN ('organization', 'person')),
  entity_a_name     text NOT NULL,
  entity_b_id       uuid,
  entity_b_type     text CHECK (entity_b_type IN ('organization', 'person')),
  entity_b_name     text NOT NULL,
  relationship_type relationship_type,
  description       text,
  start_date        date,
  end_date          date,
  financial_amount  bigint DEFAULT 0,
  active            boolean DEFAULT true,
  data_source       text,
  notes             text,
  created_at        timestamptz DEFAULT now()
);

CREATE TABLE events (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  event_type          event_type,
  description         text,
  organizer           text,
  start_date          timestamptz,
  end_date            timestamptz,
  location            text,
  city                text,
  state               text,
  address             text,
  registration_url    text,
  cost                integer DEFAULT 0,
  source_url          text,
  calendar_invite_sent boolean DEFAULT false,
  relevance_score     numeric(5,1) DEFAULT 0,
  notes               text,
  created_at          timestamptz DEFAULT now()
);

CREATE TABLE financial_records (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name   text NOT NULL,
  entity_type   text CHECK (entity_type IN ('organization', 'person')),
  record_type   financial_record_type,
  amount        bigint DEFAULT 0,
  period        text,
  year          integer,
  counterparty  text,
  purpose       text,
  filing_id     text,
  data_source   text,
  source_url    text,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE research_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  entity_name     text,
  finding_type    finding_type,
  summary         text,
  data_source     text,
  source_url      text,
  discovered_at   timestamptz DEFAULT now(),
  status          finding_status DEFAULT 'Pending Review',
  reviewed_by     text,
  notes           text
);

CREATE TABLE prominence_scores (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name           text NOT NULL,
  entity_type           text CHECK (entity_type IN ('organization', 'person')),
  date                  date DEFAULT CURRENT_DATE,
  media_mentions        integer DEFAULT 0,
  social_media_followers integer DEFAULT 0,
  fundraising_total     bigint DEFAULT 0,
  event_count           integer DEFAULT 0,
  composite_score       numeric(5,1) DEFAULT 0,
  score_change          numeric(5,1) DEFAULT 0,
  created_at            timestamptz DEFAULT now()
);

-- ══════════════════════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════════════════════

CREATE INDEX idx_organizations_name ON organizations(name);
CREATE INDEX idx_organizations_category ON organizations(category);
CREATE INDEX idx_organizations_state ON organizations(state);
CREATE INDEX idx_organizations_prominence ON organizations(prominence_score DESC);

CREATE INDEX idx_people_name ON people(name);
CREATE INDEX idx_people_role ON people(role);
CREATE INDEX idx_people_state ON people(state);

CREATE INDEX idx_relationships_a ON relationships(entity_a_name);
CREATE INDEX idx_relationships_b ON relationships(entity_b_name);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);

CREATE INDEX idx_events_start ON events(start_date);
CREATE INDEX idx_events_organizer ON events(organizer);
CREATE INDEX idx_events_invite_sent ON events(calendar_invite_sent);

CREATE INDEX idx_prominence_entity ON prominence_scores(entity_name, date DESC);

-- ══════════════════════════════════════════════════════════════════
-- TRIGGERS: auto-update updated_at
-- ══════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (public read, authenticated write)
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE prominence_scores ENABLE ROW LEVEL SECURITY;

-- Public read access (for the visualization)
CREATE POLICY "Public read organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Public read people" ON people FOR SELECT USING (true);
CREATE POLICY "Public read relationships" ON relationships FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read financial_records" ON financial_records FOR SELECT USING (true);
CREATE POLICY "Public read research_log" ON research_log FOR SELECT USING (true);
CREATE POLICY "Public read prominence_scores" ON prominence_scores FOR SELECT USING (true);

-- Service role can write (used by API routes and cron jobs)
CREATE POLICY "Service write organizations" ON organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write people" ON people FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write relationships" ON relationships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write financial_records" ON financial_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write research_log" ON research_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write prominence_scores" ON prominence_scores FOR ALL USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════════
-- VIEW: full graph data for visualization
-- ══════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW ecosystem_graph AS
SELECT
  'organization' as entity_type,
  id,
  name,
  category::text,
  state,
  city,
  description,
  website,
  annual_revenue as revenue,
  prominence_score,
  prominence_trend::text as trend,
  verified
FROM organizations
UNION ALL
SELECT
  'person' as entity_type,
  id,
  name,
  role::text as category,
  state,
  NULL as city,
  description,
  website,
  0 as revenue,
  prominence_score,
  prominence_trend::text as trend,
  verified
FROM people;
