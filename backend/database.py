import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Use DB_DIR environment variable if it exists (for Render persistent disk), otherwise default to local directory
DB_DIR = os.getenv("DB_DIR", ".")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(DB_DIR, 'route53_clone.db')}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
