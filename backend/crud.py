from sqlalchemy.orm import Session
import models, schemas
from sqlalchemy import func

def get_zones(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    query = db.query(models.HostedZone)
    if search:
        query = query.filter(models.HostedZone.name.contains(search))
    zones = query.offset(skip).limit(limit).all()
    
    # Calculate record count
    for zone in zones:
        zone.record_count = db.query(func.count(models.DNSRecord.id)).filter(models.DNSRecord.zone_id == zone.id).scalar()
    return zones

def get_zone(db: Session, zone_id: str):
    zone = db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()
    if zone:
        zone.record_count = db.query(func.count(models.DNSRecord.id)).filter(models.DNSRecord.zone_id == zone.id).scalar()
    return zone

def create_zone(db: Session, zone: schemas.HostedZoneCreate):
    db_zone = models.HostedZone(**zone.model_dump())
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

def update_zone(db: Session, zone_id: str, zone: schemas.HostedZoneCreate):
    db_zone = get_zone(db, zone_id)
    if db_zone:
        for key, value in zone.model_dump().items():
            setattr(db_zone, key, value)
        db.commit()
        db.refresh(db_zone)
    return db_zone

def delete_zone(db: Session, zone_id: str):
    db_zone = get_zone(db, zone_id)
    if db_zone:
        db.delete(db_zone)
        db.commit()
    return db_zone

def get_records(db: Session, zone_id: str, skip: int = 0, limit: int = 100, search: str = None, record_type: str = None):
    query = db.query(models.DNSRecord).filter(models.DNSRecord.zone_id == zone_id)
    if search:
        query = query.filter(models.DNSRecord.name.contains(search) | models.DNSRecord.value.contains(search))
    if record_type:
        query = query.filter(models.DNSRecord.type == record_type)
    return query.offset(skip).limit(limit).all()

def create_record(db: Session, zone_id: str, record: schemas.DNSRecordCreate):
    db_record = models.DNSRecord(**record.model_dump(), zone_id=zone_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def update_record(db: Session, record_id: str, record: schemas.DNSRecordCreate):
    db_record = db.query(models.DNSRecord).filter(models.DNSRecord.id == record_id).first()
    if db_record:
        for key, value in record.model_dump().items():
            setattr(db_record, key, value)
        db.commit()
        db.refresh(db_record)
    return db_record

def delete_record(db: Session, record_id: str):
    db_record = db.query(models.DNSRecord).filter(models.DNSRecord.id == record_id).first()
    if db_record:
        db.delete(db_record)
        db.commit()
    return db_record
