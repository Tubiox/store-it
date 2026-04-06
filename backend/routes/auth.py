from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import users_collection
from auth_utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth")

class User(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(user: User):
    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)

    users_collection.insert_one({
        "email": user.email,
        "password": hashed
    })

    return {"message": "Signup successful"}

@router.post("/login")
def login(user: User):
    existing = users_collection.find_one({"email": user.email})

    if not existing:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {
        "message": "Login successful",
        "access_token": token
    }