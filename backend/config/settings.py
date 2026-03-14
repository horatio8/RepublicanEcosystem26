from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # AirTable
    airtable_api_key: str = ""
    airtable_base_id: str = ""

    # Google Calendar
    google_credentials_json: str = ""
    calendar_recipient_email: str = "james@teller.consulting"

    # External APIs
    fec_api_key: str = ""
    opensecrets_api_key: str = ""
    propublica_api_key: str = ""
    news_api_key: str = ""

    # AWS
    aws_region: str = "us-east-1"
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None

    # App
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    log_level: str = "INFO"
    scrape_interval_hours: int = 6
    research_interval_hours: int = 24

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
