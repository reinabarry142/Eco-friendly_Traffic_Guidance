from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, profile,emissions,obstructions
from app.db.mongodb import init_db

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="", tags=["auth"])
app.include_router(profile.router, prefix="", tags=["profile"])
app.include_router(emissions.router, prefix="", tags=["emissions"])
app.include_router(obstructions.router)

@app.on_event("startup")
async def startup_db_client():
    await init_db()
