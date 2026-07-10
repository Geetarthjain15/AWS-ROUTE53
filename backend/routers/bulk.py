from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, schemas, database, models
from typing import List

router = APIRouter(prefix="/bulk", tags=["Bulk Operations"])

class BulkDeleteRecordsRequest(schemas.BaseModel):
    record_ids: List[str]

@router.post("/zones/{zone_id}/records/delete")
def bulk_delete_records(zone_id: str, request: BulkDeleteRecordsRequest, db: Session = Depends(database.get_db)):
    for record_id in request.record_ids:
        crud.delete_record(db, record_id)
    return {"message": f"Deleted {len(request.record_ids)} records"}
