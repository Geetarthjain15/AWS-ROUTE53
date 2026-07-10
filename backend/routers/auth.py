from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas, database, models

router = APIRouter(prefix="/auth", tags=["Auth"])

# ─── helpers ────────────────────────────────────────────────────────────────

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email.lower()).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        email=user.email.lower(),
        account_name=user.account_name,
        password=user.password,          # plain-text mock
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ─── endpoints ──────────────────────────────────────────────────────────────

@router.get("/user-count")
def user_count(db: Session = Depends(database.get_db)):
    """Frontend calls this to decide whether to show Login or Sign-up first."""
    count = db.query(models.User).count()
    return {"count": count}


@router.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    db_user = create_user(db, user)
    return {
        "access_token": f"mock-token-{db_user.id}",
        "token_type": "bearer",
        "account_name": db_user.account_name,
        "email": db_user.email,
    }


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = get_user_by_email(db, credentials.email)
    if not db_user or db_user.password != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    return {
        "access_token": f"mock-token-{db_user.id}",
        "token_type": "bearer",
        "account_name": db_user.account_name,
        "email": db_user.email,
    }


@router.get("/me")
def me(db: Session = Depends(database.get_db)):
    """Returns minimal mock user info — token verification is skipped for the mock."""
    return {"status": "ok"}
