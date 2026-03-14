#!/usr/bin/env python3
"""
Setup script to create AirTable base with the correct schema.

Usage:
    python -m backend.scripts.setup_airtable

This will create all required tables in your AirTable base.
You need AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file.
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.config.settings import settings
from backend.src.airtable.schema import TABLE_SCHEMAS


def main():
    print("AirTable Setup Script")
    print("=" * 50)
    print()

    if not settings.airtable_api_key or not settings.airtable_base_id:
        print("ERROR: Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in backend/.env")
        print("See backend/.env.example for reference.")
        sys.exit(1)

    print(f"Base ID: {settings.airtable_base_id}")
    print()
    print("The following tables need to be created in your AirTable base:")
    print()

    for table_name, schema in TABLE_SCHEMAS.items():
        print(f"  Table: {table_name}")
        for field in schema["fields"]:
            field_type = field["type"]
            print(f"    - {field['name']} ({field_type})")
        print()

    print("=" * 50)
    print()
    print("INSTRUCTIONS:")
    print("1. Go to https://airtable.com and open your base")
    print("2. Create each table listed above")
    print("3. Add the fields with the specified types")
    print("4. For 'singleSelect' fields, add the options shown in schema.py")
    print()
    print("Alternatively, you can use the AirTable API to create tables")
    print("programmatically (requires Enterprise plan).")
    print()
    print("Once tables are created, seed initial data with:")
    print("  python -m backend.scripts.seed_data")


if __name__ == "__main__":
    main()
