from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse, PlainTextResponse
from sqlalchemy.orm import Session
import crud, schemas, database, models
import json
import dns.zone
import dns.rdatatype

router = APIRouter(prefix="/zones/{zone_id}", tags=["Import/Export"])

@router.get("/export/json")
def export_zone_json(zone_id: str, db: Session = Depends(database.get_db)):
    zone = crud.get_zone(db, zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    records = crud.get_records(db, zone_id)
    zone_data = {
        "id": zone.id,
        "name": zone.name,
        "type": zone.type,
        "comment": zone.comment,
        "records": [
            {
                "name": r.name,
                "type": r.type,
                "value": r.value,
                "ttl": r.ttl,
                "routing_policy": r.routing_policy
            } for r in records
        ]
    }
    return JSONResponse(content=zone_data)

@router.get("/export/bind")
def export_zone_bind(zone_id: str, db: Session = Depends(database.get_db)):
    zone = crud.get_zone(db, zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    records = crud.get_records(db, zone_id)
    
    bind_content = f"; BIND Export for zone {zone.name}\n"
    bind_content += f"$ORIGIN {zone.name}.\n\n"
    
    for r in records:
        # BIND format: [name] [ttl] IN [type] [value]
        # E.g., www 300 IN A 192.168.1.1
        bind_content += f"{r.name}\t{r.ttl}\tIN\t{r.type}\t{r.value}\n"
        
    return PlainTextResponse(content=bind_content)


@router.post("/import/bind")
async def import_zone_bind(zone_id: str, file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    zone = crud.get_zone(db, zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    content = await file.read()
    try:
        bind_zone = dns.zone.from_text(content, origin=zone.name, check_origin=False)
        for name, node in bind_zone.nodes.items():
            rdatasets = node.rdatasets
            for rdataset in rdatasets:
                record_type = dns.rdatatype.to_text(rdataset.rdtype)
                for rdata in rdataset:
                    record_value = rdata.to_text()
                    new_record = schemas.DNSRecordCreate(
                        name=name.to_text(),
                        type=record_type,
                        value=record_value,
                        ttl=rdataset.ttl,
                        routing_policy="Simple"
                    )
                    crud.create_record(db, zone_id, new_record)
        return {"message": "Zone imported successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse BIND file: {str(e)}")
