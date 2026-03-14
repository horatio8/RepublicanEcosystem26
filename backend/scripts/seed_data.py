#!/usr/bin/env python3
"""
Seed AirTable with initial Republican ecosystem data.

Usage:
    python -m backend.scripts.seed_data

Seeds the database with well-known conservative organizations
and their relationships as a starting point.
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.src.airtable.client import EcosystemDB


# Seed organizations — well-known Republican/conservative entities
SEED_ORGANIZATIONS = [
    {
        "Name": "Republican National Committee",
        "Category": "National Party Committee",
        "Description": "The main organizational body of the Republican Party",
        "Website": "https://www.gop.com",
        "State": "DC",
        "City": "Washington",
        "Annual Revenue": 300000000,
    },
    {
        "Name": "Heritage Foundation",
        "Category": "Think Tank",
        "Description": "Conservative think tank and policy research organization. Publishes the annual 'Mandate for Leadership' and created Project 2025.",
        "Website": "https://www.heritage.org",
        "State": "DC",
        "City": "Washington",
        "Annual Revenue": 86000000,
    },
    {
        "Name": "American Enterprise Institute",
        "Category": "Think Tank",
        "Description": "Center-right think tank focused on government, economics, and foreign policy",
        "Website": "https://www.aei.org",
        "State": "DC",
        "City": "Washington",
        "Annual Revenue": 55000000,
    },
    {
        "Name": "Federalist Society",
        "Category": "501(c)(3) Nonprofit",
        "Description": "Organization of conservatives and libertarians focused on reforming the legal system. Major influence on judicial nominations.",
        "Website": "https://fedsoc.org",
        "State": "DC",
        "City": "Washington",
        "Annual Revenue": 25000000,
    },
    {
        "Name": "Americans for Prosperity",
        "Category": "501(c)(4) Nonprofit",
        "Description": "Koch-network advocacy group focused on free-market policies",
        "Website": "https://americansforprosperity.org",
        "State": "VA",
        "City": "Arlington",
        "Annual Revenue": 60000000,
    },
    {
        "Name": "Club for Growth",
        "Category": "PAC",
        "Description": "Fiscally conservative PAC that supports pro-growth candidates",
        "Website": "https://www.clubforgrowth.org",
        "State": "DC",
        "City": "Washington",
        "Annual Revenue": 30000000,
    },
    {
        "Name": "National Rifle Association",
        "Category": "501(c)(4) Nonprofit",
        "Description": "Gun rights advocacy organization",
        "Website": "https://www.nra.org",
        "State": "VA",
        "City": "Fairfax",
        "Annual Revenue": 250000000,
    },
    {
        "Name": "Turning Point USA",
        "Category": "501(c)(3) Nonprofit",
        "Description": "Conservative youth organization focused on college campuses",
        "Website": "https://www.tpusa.com",
        "State": "AZ",
        "City": "Phoenix",
        "Annual Revenue": 80000000,
    },
    {
        "Name": "Susan B. Anthony Pro-Life America",
        "Category": "PAC",
        "Description": "Anti-abortion political organization",
        "Website": "https://sbaprolife.org",
        "State": "VA",
        "City": "Arlington",
        "Annual Revenue": 18000000,
    },
    {
        "Name": "Judicial Watch",
        "Category": "501(c)(3) Nonprofit",
        "Description": "Conservative legal watchdog organization using FOIA requests",
        "Website": "https://www.judicialwatch.org",
        "State": "DC",
        "City": "Washington",
        "Annual Revenue": 50000000,
    },
    {
        "Name": "Faith & Freedom Coalition",
        "Category": "501(c)(4) Nonprofit",
        "Description": "Christian conservative advocacy organization founded by Ralph Reed",
        "Website": "https://www.ffcoalition.com",
        "State": "GA",
        "City": "Duluth",
        "Annual Revenue": 15000000,
    },
    {
        "Name": "American Conservative Union",
        "Category": "501(c)(4) Nonprofit",
        "Description": "Hosts CPAC (Conservative Political Action Conference)",
        "Website": "https://conservative.org",
        "State": "VA",
        "City": "Alexandria",
        "Annual Revenue": 20000000,
    },
    {
        "Name": "The Daily Wire",
        "Category": "Media Organization",
        "Description": "Conservative media company founded by Ben Shapiro",
        "Website": "https://www.dailywire.com",
        "State": "TN",
        "City": "Nashville",
        "Annual Revenue": 100000000,
    },
    {
        "Name": "Fox News",
        "Category": "Media Organization",
        "Description": "Conservative cable news network (Fox Corporation subsidiary)",
        "Website": "https://www.foxnews.com",
        "State": "NY",
        "City": "New York",
        "Annual Revenue": 3000000000,
    },
    {
        "Name": "Hillsdale College",
        "Category": "501(c)(3) Nonprofit",
        "Description": "Conservative liberal arts college; influential in right-wing education policy",
        "Website": "https://www.hillsdale.edu",
        "State": "MI",
        "City": "Hillsdale",
        "Annual Revenue": 120000000,
    },
    {
        "Name": "Leadership Institute",
        "Category": "501(c)(3) Nonprofit",
        "Description": "Conservative training organization for political activists and campaign staff",
        "Website": "https://www.leadershipinstitute.org",
        "State": "VA",
        "City": "Arlington",
        "Annual Revenue": 17000000,
    },
    {
        "Name": "Senate Leadership Fund",
        "Category": "Super PAC",
        "Description": "McConnell-aligned Super PAC supporting Republican Senate candidates",
        "State": "DC",
        "City": "Washington",
        "Annual Revenue": 230000000,
    },
    {
        "Name": "Congressional Leadership Fund",
        "Category": "Super PAC",
        "Description": "Super PAC supporting Republican House candidates",
        "State": "DC",
        "City": "Washington",
        "Annual Revenue": 200000000,
    },
    {
        "Name": "Koch Industries",
        "Category": "Business / Corporation",
        "Description": "Conglomerate; Koch network is major funder of conservative causes",
        "Website": "https://www.kochind.com",
        "State": "KS",
        "City": "Wichita",
        "Annual Revenue": 125000000000,
    },
    {
        "Name": "Alliance Defending Freedom",
        "Category": "501(c)(3) Nonprofit",
        "Description": "Conservative Christian legal advocacy organization",
        "Website": "https://adflegal.org",
        "State": "AZ",
        "City": "Scottsdale",
        "Annual Revenue": 90000000,
    },
]

# Seed relationships
SEED_RELATIONSHIPS = [
    {
        "Entity A Name": "Koch Industries",
        "Entity A Type": "Organization",
        "Entity B Name": "Americans for Prosperity",
        "Entity B Type": "Organization",
        "Relationship Type": "Founding",
        "Description": "Koch brothers founded AFP as their primary political advocacy arm",
        "Active": True,
    },
    {
        "Entity A Name": "American Conservative Union",
        "Entity A Type": "Organization",
        "Entity B Name": "Heritage Foundation",
        "Entity B Type": "Organization",
        "Relationship Type": "Coalition Partner",
        "Description": "Heritage is a key participant in CPAC events",
        "Active": True,
    },
    {
        "Entity A Name": "Federalist Society",
        "Entity A Type": "Organization",
        "Entity B Name": "Heritage Foundation",
        "Entity B Type": "Organization",
        "Relationship Type": "Coalition Partner",
        "Description": "Collaborate on judicial nominations and conservative legal strategy",
        "Active": True,
    },
    {
        "Entity A Name": "Senate Leadership Fund",
        "Entity A Type": "Organization",
        "Entity B Name": "Republican National Committee",
        "Entity B Type": "Organization",
        "Relationship Type": "Coalition Partner",
        "Description": "Coordinates spending with RNC on Senate races",
        "Active": True,
    },
    {
        "Entity A Name": "Congressional Leadership Fund",
        "Entity A Type": "Organization",
        "Entity B Name": "Republican National Committee",
        "Entity B Type": "Organization",
        "Relationship Type": "Coalition Partner",
        "Description": "Coordinates spending with RNC on House races",
        "Active": True,
    },
    {
        "Entity A Name": "Koch Industries",
        "Entity A Type": "Organization",
        "Entity B Name": "Club for Growth",
        "Entity B Type": "Organization",
        "Relationship Type": "Donation / Financial",
        "Description": "Koch network donors contribute to Club for Growth",
        "Active": True,
    },
    {
        "Entity A Name": "Alliance Defending Freedom",
        "Entity A Type": "Organization",
        "Entity B Name": "Federalist Society",
        "Entity B Type": "Organization",
        "Relationship Type": "Coalition Partner",
        "Description": "Share legal strategy on religious liberty cases",
        "Active": True,
    },
    {
        "Entity A Name": "Leadership Institute",
        "Entity A Type": "Organization",
        "Entity B Name": "Turning Point USA",
        "Entity B Type": "Organization",
        "Relationship Type": "Coalition Partner",
        "Description": "Both focus on training young conservative activists",
        "Active": True,
    },
]


def main():
    print("Seeding AirTable with initial ecosystem data...")
    print()

    db = EcosystemDB()

    # Seed organizations
    created_orgs = 0
    for org in SEED_ORGANIZATIONS:
        existing = db.find_organization_by_name(org["Name"])
        if existing:
            print(f"  [skip] {org['Name']} already exists")
        else:
            db.create_organization(org)
            print(f"  [created] {org['Name']}")
            created_orgs += 1

    print(f"\nOrganizations: {created_orgs} created, {len(SEED_ORGANIZATIONS) - created_orgs} skipped")

    # Seed relationships
    created_rels = 0
    for rel in SEED_RELATIONSHIPS:
        existing = db.find_relationship(
            rel["Entity A Name"],
            rel["Entity B Name"],
            rel["Relationship Type"],
        )
        if existing:
            print(f"  [skip] {rel['Entity A Name']} -> {rel['Entity B Name']}")
        else:
            db.create_relationship(rel)
            print(f"  [created] {rel['Entity A Name']} -> {rel['Entity B Name']}")
            created_rels += 1

    print(f"\nRelationships: {created_rels} created, {len(SEED_RELATIONSHIPS) - created_rels} skipped")
    print("\nDone! Open AirTable to review and edit the data.")


if __name__ == "__main__":
    main()
