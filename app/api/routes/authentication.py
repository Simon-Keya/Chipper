from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, get_user_by_email
from app.schemas.user import UserCreate, UserInDB
from app.services.authentication import authenticate_user, get_current_user
from app.core.security import create_access_token, get_password_hash

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/register/", response_model=UserInDB)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""

    existing_user = User.get_user_by_email(db, user.email)  # Call the new method
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_password = get_password_hash(user.password)
    new_user = User(**user.dict(exclude={"password"}), hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserInDB(**user.dict(), id=new_user.id)


@router.post("/token/")
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login an existing user."""

    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me/", response_model=UserInDB)
def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    """Get the currently authenticated user."""
    return current_user
