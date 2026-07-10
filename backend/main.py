from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import zones, records, auth, import_export, bulk

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AWS Route53 Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In a real app, specify the exact frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(zones.router, prefix="/api")
app.include_router(records.router, prefix="/api")
app.include_router(import_export.router, prefix="/api")
app.include_router(bulk.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Route53 Clone API"}
