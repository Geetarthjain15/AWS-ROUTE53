from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    account_name = Column(String, nullable=False)
    password = Column(String, nullable=False)  # plain text for mock purposes
    created_at = Column(DateTime, default=datetime.utcnow)

class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    type = Column(String, default="Public")
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    records = relationship("DNSRecord", back_populates="zone", cascade="all, delete-orphan")

class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    zone_id = Column(String, ForeignKey("hosted_zones.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    value = Column(String, nullable=False)
    ttl = Column(Integer, default=300)
    routing_policy = Column(String, default="Simple")

    zone = relationship("HostedZone", back_populates="records")
