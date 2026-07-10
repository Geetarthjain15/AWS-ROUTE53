from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import crud, schemas, database
from typing import List

router = APIRouter(prefix="/zones", tags=["Zones"])

@router.get("/", response_model=List[schemas.HostedZone])
def read_zones(skip: int = 0, limit: int = 100, search: str = None, db: Session = Depends(database.get_db)):
    zones = crud.get_zones(db, skip=skip, limit=limit, search=search)
    return zones

@router.post("/", response_model=schemas.HostedZone)
def create_zone(zone: schemas.HostedZoneCreate, db: Session = Depends(database.get_db)):
    return crud.create_zone(db=db, zone=zone)

@router.get("/{zone_id}", response_model=schemas.HostedZone)
def read_zone(zone_id: str, db: Session = Depends(database.get_db)):
    db_zone = crud.get_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    return db_zone

@router.put("/{zone_id}", response_model=schemas.HostedZone)
def update_zone(zone_id: str, zone: schemas.HostedZoneCreate, db: Session = Depends(database.get_db)):
    return crud.update_zone(db=db, zone_id=zone_id, zone=zone)

@router.delete("/{zone_id}")
def delete_zone(zone_id: str, db: Session = Depends(database.get_db)):
    crud.delete_zone(db=db, zone_id=zone_id)
    return {"message": "Zone deleted"}
