from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.security import verify_password, create_access_token, decode_jwt_token
from app.models.user import User, get_user_by_email
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserInDB, UserCreate
from pydantic import ValidationError
from app.core.security import get_password_hash
from datetime import timedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def authenticate_user(email: str, password: str, db: Session = Depends(get_db)) -> UserInDB:
    """Authenticate a user."""
    user = User.get_user_by_email(db, email)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    return user


def create_user(user_create: UserCreate, db: Session = Depends(get_db)) -> UserInDB:
    """Create a new user."""
    try:
        user = User(email=user_create.email, hashed_password=get_password_hash(user_create.password))
        db.add(user)
        db.commit()
    except Exception as e:
        db.rollback()  # Rollback the transaction in case of an error
        raise HTTPException(status_code=500, detail="Internal Server Error")

    try:
        db.refresh(user)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to refresh user object")

    return UserInDB(**user.dict())


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserInDB:
    """Get the current user from the access token."""
    try:
        payload = decode_jwt_token(token)
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
        user = User.get_user_by_email(db, email)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")