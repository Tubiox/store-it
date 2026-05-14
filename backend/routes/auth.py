from fastapi import Depends, APIRouter, HTTPException, Header, Response, Request
import secrets
from pydantic import BaseModel
from database import users_collection
from auth_utils import hash_password, verify_password, create_access_token, decode_token
from auth_utils import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth")


# MODELS
class User(BaseModel):
    email: str
    password: str

class UpdateProfileRequest(BaseModel):
    fullName: str = None
    ai_summary_enabled: bool = None

from fastapi import Request, HTTPException

from database import users_collection
from bson import ObjectId

def get_current_user(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        authorization = request.headers.get("Authorization")
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_collection.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

    # ONLY apply CSRF for unsafe methods
    if request.method in ["POST", "PUT", "DELETE"]:
        csrf_token_header = request.headers.get("X-CSRF-Token")
        csrf_token_payload = payload.get("csrf")

        if not csrf_token_header or csrf_token_header != csrf_token_payload:
            raise HTTPException(status_code=403, detail="CSRF token missing or invalid")

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
        "password": hashed,
        "ai_summary_enabled": True
    })

    return {"message": "Signup successful"}


# LOGIN
@router.post("/login")
def login(user: User, response: Response):
    existing = users_collection.find_one({"email": user.email})

    if not existing:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    csrf_token = secrets.token_urlsafe(32)
    token = create_access_token({"sub": user.email, "csrf": csrf_token})

    response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    samesite="lax",
    secure=False,
    max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    path="/"
)

    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        httponly=False,
        samesite="lax",
        secure=False,
    )

    return {
        "message": "Login successful",
    }


# LOGOUT
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("csrf_token")
    return {"message": "Logged out successfully"}


# GET CURRENT USER
@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "$id": str(current_user["_id"]),
        "accountId": str(current_user["_id"]),
        "fullName": current_user.get("fullName", current_user["email"].split("@")[0]),
        "email": current_user["email"],
        "avatar": current_user.get("avatar", "https://i.pravatar.cc/150"),
        "ai_summary_enabled": current_user.get("ai_summary_enabled", True),
    }


# UPDATE PROFILE
@router.put("/update-profile")
def update_profile(
    request: UpdateProfileRequest,
    current_user=Depends(get_current_user)
):
    update_data = {}
    
    if request.fullName is not None:
        update_data["fullName"] = request.fullName
    
    if request.ai_summary_enabled is not None:
        update_data["ai_summary_enabled"] = request.ai_summary_enabled
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": update_data}
    )
    
    updated_user = users_collection.find_one({"_id": current_user["_id"]})
    
    return {
        "$id": str(updated_user["_id"]),
        "accountId": str(updated_user["_id"]),
        "fullName": updated_user.get("fullName", updated_user["email"].split("@")[0]),
        "email": updated_user["email"],
        "avatar": updated_user.get("avatar", "https://i.pravatar.cc/150"),
        "ai_summary_enabled": updated_user.get("ai_summary_enabled", True),
    }