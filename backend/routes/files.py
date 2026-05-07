from fastapi import Depends, HTTPException, APIRouter, UploadFile, Request,File
from fastapi.responses import StreamingResponse
from io import BytesIO
from routes.auth import get_current_user
from services.storage import upload_file, download_file
from utils.encryption import encrypt, decrypt
from bson import ObjectId
from database import db, files_collection, shares_collection
from auth_utils import decode_token
from services.storage import delete_from_storage
from utils.token import generate_token
from utils.email import send_share_email
from fastapi import BackgroundTasks
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr

class ShareRequest(BaseModel):
    email: EmailStr

router = APIRouter()

# UPLOAD FILE
@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    try:
        content = await file.read()

        if not content:
            raise HTTPException(status_code=400, detail="Empty file")

        print("Original size:", len(content))

        encrypted_data = encrypt(content)

        print("Encrypted size:", len(encrypted_data))

        file_id = ObjectId()
        storage_key = f"{current_user['_id']}/{file_id}.enc"
        
        
        upload_file(
            encrypted_data,
            storage_key,
            file.content_type
            )

        file_data = {
            "_id": file_id,
            "owner_id": current_user["_id"],
            "filename": file.filename,
            "storage_key": storage_key,
            "file_size": len(content),
            "content_type": file.content_type,
            "uploaded_at": datetime.utcnow(),
            "is_deleted": False
        }

        db.files.insert_one(file_data)

        return {
            "message": "uploaded securely",
            "file_id": str(file_id)
        }

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# DOWNLOAD FILE
@router.get("/download/{file_id}")
async def download(
    file_id: str,
    current_user=Depends(get_current_user)
):
    try:
        file = files_collection.find_one({"_id": ObjectId(file_id)})
        if not file:
            raise HTTPException(status_code=404, detail="File not found")

        if str(file.get("owner_id")) != str(current_user["_id"]):
           raise HTTPException(status_code=403, detail="Not allowed")

        encrypted_data = download_file(file["storage_key"])

        decrypted_data = decrypt(encrypted_data)
        
        return StreamingResponse(
    BytesIO(decrypted_data),
    media_type=file["content_type"],
    headers={
        "Content-Disposition": "inline"
    }
)
    except Exception as e:
        print("DOWNLOAD ERROR:", str(e)) 
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/preview/{file_id}")
async def preview_file(
    file_id: str,
    current_user=Depends(get_current_user)
):
    try:
        file = files_collection.find_one({
            "_id": ObjectId(file_id)
        })

        if not file:
            raise HTTPException(
                status_code=404,
                detail="File not found"
            )

        if str(file["owner_id"]) != str(current_user["_id"]):
            raise HTTPException(
                status_code=403,
                detail="Not allowed"
            )

        encrypted_data = download_file(file["storage_key"])

        decrypted_data = decrypt(encrypted_data)

        return StreamingResponse(
    BytesIO(decrypted_data),
    media_type=file["content_type"],
    headers={
        "Content-Disposition": "inline"
    }
)

    except Exception as e:
        print("PREVIEW ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# GET USER FILES
@router.get("/")
def get_files(current_user=Depends(get_current_user)):
    try:
        files = list(db.files.find({
            "owner_id": current_user["_id"],
            "is_deleted": False
        }))

        for file in files:
            file["_id"] = str(file["_id"])
            file["owner_id"] = str(file["owner_id"])

        return {
    "documents": files,
    "total": len(files)
}
    except Exception as e:
        print("FETCH FILES ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/logout")
def logout(response: StreamingResponse):
    response.delete_cookie(
        key="access_token",
    path="/"
    )
    return {"message": "Logged out"}



#delete
@router.delete("/delete/{file_id}")
def delete_file(file_id: str, user: dict = Depends(get_current_user)):

    file = files_collection.find_one({"_id": ObjectId(file_id)})

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    print("DELETE HIT")
    print(file["owner_id"], type(file["owner_id"]))
    print(user["_id"], type(user["_id"]))

    if file["owner_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    delete_from_storage(file["storage_key"])
    files_collection.delete_one({"_id": ObjectId(file_id)})

    return {"message": "File deleted"}


#share
@router.post("/share/{file_id}")
async def create_share(
    file_id: str,
    request: ShareRequest,
    background_tasks: BackgroundTasks,
    user=Depends(get_current_user)
):
    email = request.email

    file = files_collection.find_one({"_id": ObjectId(file_id)})

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    if file["owner_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    token = generate_token()

    share = {
        "_id": ObjectId(),
        "file_id": ObjectId(file_id),
        "token": token,
        "email": email,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(hours=1) 
    }

    shares_collection.insert_one(share)
    link = f"http://localhost:3000/shared/{token}"

    background_tasks.add_task(send_share_email, email, link)

    return {
    "message": "Share link sent to email",
    "share_url": link
}

@router.get("/shared/info/{token}")
def get_shared_file_info(token: str):

    share = shares_collection.find_one({"token": token})

    if not share:
        raise HTTPException(
            status_code=404,
            detail="Invalid link"
        )

    if (
        share.get("expires_at")
        and share["expires_at"] < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=403,
            detail="Link expired"
        )

    file = files_collection.find_one({
        "_id": share["file_id"]
    })

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    return {
    "filename": file["filename"],
    "content_type": file["content_type"],
    "uploaded_at": file["uploaded_at"],
    "preview_url": f"http://localhost:8000/files/shared/{token}",
    "expires_at": share["expires_at"],
    "shared_with": share.get("email"),
}

@router.get("/shared/{token}")
def access_shared_file(token: str):
    share = shares_collection.find_one({"token": token})

    if not share:
        raise HTTPException(status_code=404, detail="Invalid link")

    # expiry check
    if share.get("expires_at") and share["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=403, detail="Link expired")

    file = files_collection.find_one({"_id": share["file_id"]})

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    encrypted_data = download_file(file["storage_key"])
    decrypted_data = decrypt(encrypted_data)
    
    return StreamingResponse(
    BytesIO(decrypted_data),
    media_type=file["content_type"],
    headers={
        "Content-Disposition": "inline"
    }
)

@router.put("/rename/{file_id}")
async def rename_file(
    file_id: str,
    request: Request,
    user=Depends(get_current_user)
):
    data = await request.json()
    new_filename = data.get("filename")

    if not new_filename:
        raise HTTPException(status_code=400, detail="Filename required")

    result = files_collection.update_one(
    {
        "_id": ObjectId(file_id),
        "owner_id": (user["_id"])
    },
        {
            "$set": {
                "filename": new_filename
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="File not found")

    return {
        "message": "File renamed successfully"
    }