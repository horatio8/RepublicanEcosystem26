"""
News and media tracker for measuring entity prominence.

Tracks media mentions of ecosystem entities to calculate
prominence scores and detect trending topics.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx

from backend.config.settings import settings

logger = logging.getLogger(__name__)


class NewsTracker:
    """Tracks media mentions of political entities."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.news_api_key
        self.client = httpx.AsyncClient(
            base_url="https://newsapi.org/v2",
            timeout=30.0,
        )

    async def close(self):
        await self.client.aclose()

    async def count_mentions(
        self,
        entity_name: str,
        days: int = 7,
    ) -> dict:
        """Count news mentions for an entity over the given period."""
        from_date = (datetime.now(timezone.utc) - timedelta(days=days)).strftime(
            "%Y-%m-%d"
        )
        try:
            response = await self.client.get(
                "/everything",
                params={
                    "q": f'"{entity_name}"',
                    "from": from_date,
                    "language": "en",
                    "sortBy": "relevancy",
                    "pageSize": 1,
                    "apiKey": self.api_key,
                },
            )
            response.raise_for_status()
            data = response.json()
            total = data.get("totalResults", 0)
            return {
                "entity": entity_name,
                "mentions": total,
                "period_days": days,
                "from_date": from_date,
            }
        except Exception as e:
            logger.error(f"News mention count failed for '{entity_name}': {e}")
            return {"entity": entity_name, "mentions": 0, "period_days": days}

    async def get_trending_articles(
        self,
        entity_name: str,
        max_articles: int = 5,
    ) -> list[dict]:
        """Get recent trending articles mentioning an entity."""
        from_date = (datetime.now(timezone.utc) - timedelta(days=7)).strftime(
            "%Y-%m-%d"
        )
        try:
            response = await self.client.get(
                "/everything",
                params={
                    "q": f'"{entity_name}"',
                    "from": from_date,
                    "language": "en",
                    "sortBy": "popularity",
                    "pageSize": max_articles,
                    "apiKey": self.api_key,
                },
            )
            response.raise_for_status()
            data = response.json()
            return [
                {
                    "title": a.get("title", ""),
                    "source": a.get("source", {}).get("name", ""),
                    "url": a.get("url", ""),
                    "published": a.get("publishedAt", ""),
                    "description": a.get("description", ""),
                }
                for a in data.get("articles", [])
            ]
        except Exception as e:
            logger.error(f"Trending articles fetch failed for '{entity_name}': {e}")
            return []

    async def calculate_prominence_score(
        self,
        entity_name: str,
        current_revenue: float = 0,
        social_followers: int = 0,
        event_count: int = 0,
    ) -> dict:
        """Calculate a composite prominence score for an entity.

        Score = weighted combination of:
        - Media mentions (40%)
        - Revenue (25%)
        - Social media followers (20%)
        - Event participation (15%)
        """
        mentions = await self.count_mentions(entity_name, days=30)
        mention_count = mentions.get("mentions", 0)

        # Normalize each factor to 0-100 scale
        media_score = min(100, mention_count / 10)  # 1000+ mentions = max
        revenue_score = min(100, (current_revenue / 100_000_000) * 100)  # $100M = max
        social_score = min(100, (social_followers / 1_000_000) * 100)  # 1M = max
        event_score = min(100, (event_count / 20) * 100)  # 20+ events = max

        composite = (
            media_score * 0.40
            + revenue_score * 0.25
            + social_score * 0.20
            + event_score * 0.15
        )

        return {
            "Entity Name": entity_name,
            "Date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "Media Mentions": mention_count,
            "Social Media Followers": social_followers,
            "Fundraising Total": current_revenue,
            "Event Count": event_count,
            "Composite Score": round(composite, 1),
        }
