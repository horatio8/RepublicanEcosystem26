"""
AirTable schema definitions for the Republican Ecosystem database.

This module defines the expected table structure. Use the setup_base() function
to create tables in a new AirTable base, or use the constants to interact with
existing tables.
"""

# Table names
ORGANIZATIONS = "Organizations"
PEOPLE = "People"
RELATIONSHIPS = "Relationships"
EVENTS = "Events"
FINANCIAL_RECORDS = "Financial Records"
RESEARCH_LOG = "Research Log"
PROMINENCE_SCORES = "Prominence Scores"

# Organization categories
ORG_CATEGORIES = [
    "PAC",
    "Super PAC",
    "501(c)(3) Nonprofit",
    "501(c)(4) Nonprofit",
    "527 Organization",
    "Think Tank",
    "Media Organization",
    "Consulting Firm",
    "Law Firm",
    "Lobbying Firm",
    "Trade Association",
    "Campaign Committee",
    "State Party",
    "National Party Committee",
    "Leadership PAC",
    "Joint Fundraising Committee",
    "Business / Corporation",
    "Religious Organization",
    "Grassroots Organization",
    "Digital / Tech Firm",
    "Polling Firm",
    "Other",
]

# People roles
PEOPLE_ROLES = [
    "Elected Official",
    "Candidate",
    "Party Official",
    "Staffer",
    "Consultant",
    "Lobbyist",
    "Donor",
    "Board Member",
    "Executive",
    "Media Figure",
    "Operative",
    "Lawyer",
    "Pollster",
    "Strategist",
    "Fundraiser",
    "Volunteer Leader",
    "Other",
]

# Relationship types
RELATIONSHIP_TYPES = [
    "Employment",
    "Board Membership",
    "Consulting",
    "Donation / Financial",
    "Lobbying",
    "Legal Representation",
    "Vendor / Service Provider",
    "Joint Fundraising",
    "Coalition Partner",
    "Subsidiary / Parent",
    "Shared Leadership",
    "Endorsement",
    "Advisory",
    "Founding",
    "Volunteer",
    "Other",
]

# Event types
EVENT_TYPES = [
    "Conference",
    "Fundraiser",
    "Gala / Dinner",
    "Rally",
    "Town Hall",
    "Committee Hearing",
    "Policy Summit",
    "Training / Workshop",
    "Networking Event",
    "Book Signing / Media Event",
    "Protest / March",
    "Prayer Breakfast",
    "Debate",
    "Other",
]

# Prominence trend directions
PROMINENCE_TRENDS = ["Rising", "Stable", "Declining"]

# AirTable field definitions for each table (used by setup script)
TABLE_SCHEMAS = {
    ORGANIZATIONS: {
        "fields": [
            {"name": "Name", "type": "singleLineText"},
            {"name": "Category", "type": "singleSelect", "options": {"choices": [{"name": c} for c in ORG_CATEGORIES]}},
            {"name": "Description", "type": "multilineText"},
            {"name": "Website", "type": "url"},
            {"name": "State", "type": "singleLineText"},
            {"name": "City", "type": "singleLineText"},
            {"name": "Founded Year", "type": "number", "options": {"precision": 0}},
            {"name": "Annual Revenue", "type": "currency", "options": {"precision": 0, "symbol": "$"}},
            {"name": "Employee Count", "type": "number", "options": {"precision": 0}},
            {"name": "FEC ID", "type": "singleLineText"},
            {"name": "EIN", "type": "singleLineText"},
            {"name": "OpenSecrets ID", "type": "singleLineText"},
            {"name": "Social Media", "type": "multilineText"},
            {"name": "Prominence Score", "type": "number", "options": {"precision": 1}},
            {"name": "Prominence Trend", "type": "singleSelect", "options": {"choices": [{"name": t} for t in PROMINENCE_TRENDS]}},
            {"name": "Last Updated", "type": "dateTime", "options": {"timeZone": "America/New_York", "dateFormat": {"name": "us"}}},
            {"name": "Notes", "type": "multilineText"},
            {"name": "Data Source", "type": "singleLineText"},
            {"name": "Verified", "type": "checkbox"},
        ]
    },
    PEOPLE: {
        "fields": [
            {"name": "Name", "type": "singleLineText"},
            {"name": "Role", "type": "singleSelect", "options": {"choices": [{"name": r} for r in PEOPLE_ROLES]}},
            {"name": "Title", "type": "singleLineText"},
            {"name": "Description", "type": "multilineText"},
            {"name": "State", "type": "singleLineText"},
            {"name": "Party", "type": "singleSelect", "options": {"choices": [{"name": "Republican"}, {"name": "Democrat"}, {"name": "Independent"}, {"name": "Libertarian"}, {"name": "Other"}]}},
            {"name": "Office", "type": "singleLineText"},
            {"name": "Website", "type": "url"},
            {"name": "Social Media", "type": "multilineText"},
            {"name": "Prominence Score", "type": "number", "options": {"precision": 1}},
            {"name": "Prominence Trend", "type": "singleSelect", "options": {"choices": [{"name": t} for t in PROMINENCE_TRENDS]}},
            {"name": "Last Updated", "type": "dateTime", "options": {"timeZone": "America/New_York", "dateFormat": {"name": "us"}}},
            {"name": "Notes", "type": "multilineText"},
            {"name": "Data Source", "type": "singleLineText"},
            {"name": "Verified", "type": "checkbox"},
        ]
    },
    RELATIONSHIPS: {
        "fields": [
            {"name": "Entity A Name", "type": "singleLineText"},
            {"name": "Entity A Type", "type": "singleSelect", "options": {"choices": [{"name": "Organization"}, {"name": "Person"}]}},
            {"name": "Entity B Name", "type": "singleLineText"},
            {"name": "Entity B Type", "type": "singleSelect", "options": {"choices": [{"name": "Organization"}, {"name": "Person"}]}},
            {"name": "Relationship Type", "type": "singleSelect", "options": {"choices": [{"name": r} for r in RELATIONSHIP_TYPES]}},
            {"name": "Description", "type": "multilineText"},
            {"name": "Start Date", "type": "date"},
            {"name": "End Date", "type": "date"},
            {"name": "Financial Amount", "type": "currency", "options": {"precision": 0, "symbol": "$"}},
            {"name": "Active", "type": "checkbox"},
            {"name": "Data Source", "type": "singleLineText"},
            {"name": "Notes", "type": "multilineText"},
        ]
    },
    EVENTS: {
        "fields": [
            {"name": "Name", "type": "singleLineText"},
            {"name": "Event Type", "type": "singleSelect", "options": {"choices": [{"name": e} for e in EVENT_TYPES]}},
            {"name": "Description", "type": "multilineText"},
            {"name": "Organizer", "type": "singleLineText"},
            {"name": "Start Date", "type": "dateTime", "options": {"timeZone": "America/New_York", "dateFormat": {"name": "us"}}},
            {"name": "End Date", "type": "dateTime", "options": {"timeZone": "America/New_York", "dateFormat": {"name": "us"}}},
            {"name": "Location", "type": "singleLineText"},
            {"name": "City", "type": "singleLineText"},
            {"name": "State", "type": "singleLineText"},
            {"name": "Address", "type": "multilineText"},
            {"name": "Registration URL", "type": "url"},
            {"name": "Cost", "type": "currency", "options": {"precision": 0, "symbol": "$"}},
            {"name": "Source URL", "type": "url"},
            {"name": "Calendar Invite Sent", "type": "checkbox"},
            {"name": "Relevance Score", "type": "number", "options": {"precision": 1}},
            {"name": "Notes", "type": "multilineText"},
        ]
    },
    FINANCIAL_RECORDS: {
        "fields": [
            {"name": "Entity Name", "type": "singleLineText"},
            {"name": "Entity Type", "type": "singleSelect", "options": {"choices": [{"name": "Organization"}, {"name": "Person"}]}},
            {"name": "Record Type", "type": "singleSelect", "options": {"choices": [{"name": "Revenue"}, {"name": "Expenditure"}, {"name": "Donation Received"}, {"name": "Donation Made"}, {"name": "Lobbying Spend"}, {"name": "Independent Expenditure"}]}},
            {"name": "Amount", "type": "currency", "options": {"precision": 0, "symbol": "$"}},
            {"name": "Period", "type": "singleLineText"},
            {"name": "Year", "type": "number", "options": {"precision": 0}},
            {"name": "Counterparty", "type": "singleLineText"},
            {"name": "Purpose", "type": "multilineText"},
            {"name": "Filing ID", "type": "singleLineText"},
            {"name": "Data Source", "type": "singleLineText"},
            {"name": "Source URL", "type": "url"},
        ]
    },
    RESEARCH_LOG: {
        "fields": [
            {"name": "Title", "type": "singleLineText"},
            {"name": "Entity Name", "type": "singleLineText"},
            {"name": "Finding Type", "type": "singleSelect", "options": {"choices": [{"name": "New Entity"}, {"name": "New Relationship"}, {"name": "Financial Update"}, {"name": "Leadership Change"}, {"name": "New Event"}, {"name": "Prominence Change"}, {"name": "Other"}]}},
            {"name": "Summary", "type": "multilineText"},
            {"name": "Data Source", "type": "singleLineText"},
            {"name": "Source URL", "type": "url"},
            {"name": "Discovered Date", "type": "dateTime", "options": {"timeZone": "America/New_York", "dateFormat": {"name": "us"}}},
            {"name": "Status", "type": "singleSelect", "options": {"choices": [{"name": "Pending Review"}, {"name": "Approved"}, {"name": "Rejected"}, {"name": "Applied"}]}},
            {"name": "Reviewed By", "type": "singleLineText"},
            {"name": "Notes", "type": "multilineText"},
        ]
    },
    PROMINENCE_SCORES: {
        "fields": [
            {"name": "Entity Name", "type": "singleLineText"},
            {"name": "Entity Type", "type": "singleSelect", "options": {"choices": [{"name": "Organization"}, {"name": "Person"}]}},
            {"name": "Date", "type": "date"},
            {"name": "Media Mentions", "type": "number", "options": {"precision": 0}},
            {"name": "Social Media Followers", "type": "number", "options": {"precision": 0}},
            {"name": "Fundraising Total", "type": "currency", "options": {"precision": 0, "symbol": "$"}},
            {"name": "Event Count", "type": "number", "options": {"precision": 0}},
            {"name": "Composite Score", "type": "number", "options": {"precision": 1}},
            {"name": "Score Change", "type": "number", "options": {"precision": 1}},
        ]
    },
}
