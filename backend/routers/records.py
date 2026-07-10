from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, schemas, database
from typing import List

router = APIRouter(prefix="/zones/{zone_id}/records", tags=["Records"])

@router.get("/", response_model=List[schemas.DNSRecord])
def read_records(zone_id: str, skip: int = 0, limit: int = 100, search: str = None, type: str = None, db: Session = Depends(database.get_db)):
    records = crud.get_records(db, zone_id=zone_id, skip=skip, limit=limit, search=search, record_type=type)
    return records

@router.post("/", response_model=schemas.DNSRecord)
def create_record(zone_id: str, record: schemas.DNSRecordCreate, db: Session = Depends(database.get_db)):
    # Check if zone exists
    zone = crud.get_zone(db, zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return crud.create_record(db=db, zone_id=zone_id, record=record)

@router.put("/{record_id}", response_model=schemas.DNSRecord)
def update_record(zone_id: str, record_id: str, record: schemas.DNSRecordCreate, db: Session = Depends(database.get_db)):
    return crud.update_record(db=db, record_id=record_id, record=record)

@router.delete("/{record_id}")
def delete_record(zone_id: str, record_id: str, db: Session = Depends(database.get_db)):
    crud.delete_record(db=db, record_id=record_id)
    return {"message": "Record deleted"}
