from fastapi import Depends, APIRouter, HTTPException, Header
from pydantic import BaseModel
from database import users_collection
from auth_utils import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth")


# MODELS
class User(BaseModel):
    email: str
    password: str


# AUTH DEPENDENCY (IMPORTANT)
def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ")[1]
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# SIGNUP
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


# LOGIN
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


# GET CURRENT USER
@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "$id": str(current_user["_id"]),
        "accountId": str(current_user["_id"]),
        "fullName": current_user.get("fullName", current_user["email"].split("@")[0]),
        "email": current_user["email"],
        "avatar": current_user.get("avatar", "https://i.pravatar.cc/150"),
    }