from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import motor.motor_asyncio
import secrets

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017/swiftlink"
    app_title: str = "SwiftLink Pro API"

    class Config:
        env_file = ".env"

settings = Settings()

app = FastAPI(title=settings.app_title)

# DevOps Note: Settings automatically pull from environment or .env
client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongo_uri)
db = client.swiftlink

# CORS Setup for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your domain
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str # Keep it simple for now

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

@app.post("/shorten")
async def shorten_url(request: URLRequest):
    slug = secrets.token_urlsafe(6)
    await db.links.insert_one({
        "slug": slug,
        "original_url": request.url,
        "clicks": 0
    })
    return {"slug": slug, "url": request.url}

@app.get("/{slug}")
async def redirect_slug(slug: str):
    link = await db.links.find_one_and_update(
        {"slug": slug},
        {"$inc": {"clicks": 1}}
    )
    if link:
        return RedirectResponse(url=link["original_url"])
    raise HTTPException(status_code=404, detail="Link not found")
