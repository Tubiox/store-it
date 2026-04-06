from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from database import users_collection
from auth_utils import hash_password, verify_password, create_access_token
from jose import jwt, JWTError

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

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

@router.get("/me")
def get_me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "$id": str(user["_id"]),
        "accountId": str(user["_id"]),
        "fullName": user.get("fullName", email.split("@")[0]),
        "email": email,
        "avatar": user.get("avatar", "https://i.pravatar.cc/150"),
    }