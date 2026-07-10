from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class DNSRecordBase(BaseModel):
    name: str
    type: str
    value: str
    ttl: int = 300
    routing_policy: str = "Simple"

class DNSRecordCreate(DNSRecordBase):
    pass

class DNSRecord(DNSRecordBase):
    id: str
    zone_id: str

    class Config:
        from_attributes = True

class HostedZoneBase(BaseModel):
    name: str
    type: str = "Public"
    comment: Optional[str] = None

class HostedZoneCreate(HostedZoneBase):
    pass

class HostedZone(HostedZoneBase):
    id: str
    created_at: datetime
    record_count: int = 0

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    account_name: str
    email: str

# User schemas
class UserCreate(BaseModel):
    email: str
    account_name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    account_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserCount(BaseModel):
    count: int
