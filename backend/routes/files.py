from fastapi import Depends, HTTPException, APIRouter, UploadFile, Request,File
from fastapi.responses import StreamingResponse
from io import BytesIO
from routes.auth import get_current_user
from services.storage import upload_file, download_file
from utils.encryption import encrypt, decrypt
from utils.gemini import generate_file_summary
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
    expiry: str
    permission: str

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
            "is_deleted": False,
            "ai_summary": None,
            "ai_summary_generated_at": None
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

    expiry_map = {
        "1h": timedelta(hours=1),
        "24h": timedelta(hours=24),
        "7d": timedelta(days=7),
    }

    expires_at = datetime.utcnow() + expiry_map.get(
        request.expiry,
        timedelta(hours=1)
    )
    
    share = {
    "_id": ObjectId(),
    "file_id": ObjectId(file_id),
    "token": token,

    "email": email,

    "permission": request.permission,

    "watermark": True,

    "expires_at": expires_at,

    "created_at": datetime.utcnow(),

    "revoked": False,

    "preview_count": 0,
    "download_count": 0,

    "last_accessed_at": None
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
    if share.get("revoked"):
        raise HTTPException(
            status_code=403,
            detail="Link revoked"
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

    "download_url": f"http://localhost:8000/files/shared/download/{token}",

    "permission": share.get("permission", "view"),

    "expires_at": share["expires_at"],

    "shared_with": share.get("email"),
}

@router.get("/shared/{token}")
def access_shared_file(token: str):
    share = shares_collection.find_one({"token": token})

    if not share:
        raise HTTPException(status_code=404, detail="Invalid link")
    if share.get("revoked"):
        raise HTTPException(
            status_code=403,
            detail="Link revoked"
        )
    # expiry check
    if share.get("expires_at") and share["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=403, detail="Link expired")

    file = files_collection.find_one({"_id": share["file_id"]})

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    encrypted_data = download_file(file["storage_key"])
    decrypted_data = decrypt(encrypted_data)
    
    shares_collection.update_one(
    {"_id": share["_id"]},
    {
        "$inc": {
            "preview_count": 1
        },
        "$set": {
            "last_accessed_at": datetime.utcnow()
        }
    }
)
    shares_collection.update_one(
    {"_id": share["_id"]},
    {
        "$inc": {"preview_count": 1},
        "$set": {
            "last_accessed_at": datetime.utcnow()
        }
    }
)

    return StreamingResponse(
    BytesIO(decrypted_data),
    media_type=file["content_type"],
    headers={
        "Content-Disposition": "inline"
    }
)

@router.get("/shared/download/{token}")
def shared_download(token: str):

    share = shares_collection.find_one({"token": token})

    if not share:
        raise HTTPException(
            status_code=404,
            detail="Invalid link"
        )

    # revoked check
    if share.get("revoked"):
        raise HTTPException(
            status_code=403,
            detail="Link revoked"
        )

    # expiry check
    if (
        share.get("expires_at")
        and share["expires_at"] < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=403,
            detail="Link expired"
        )

    # permission check
    if share.get("permission") != "download":
        raise HTTPException(
            status_code=403,
            detail="Downloads disabled"
        )

    file = files_collection.find_one({
        "_id": share["file_id"]
    })

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    encrypted_data = download_file(
        file["storage_key"]
    )

    decrypted_data = decrypt(encrypted_data)

    # LOG DOWNLOAD
    shares_collection.update_one(
        {"_id": share["_id"]},
        {
            "$inc": {
                "download_count": 1
            },
            "$set": {
                "last_accessed_at": datetime.utcnow()
            }
        }
    )

    return StreamingResponse(
        BytesIO(decrypted_data),
        media_type=file["content_type"],
        headers={
            "Content-Disposition":
            f'attachment; filename="{file["filename"]}"'
        }
    )

#download 
@router.get("/shared/download/{token}")
def shared_download(token: str):

    share = shares_collection.find_one({"token": token})

    if not share:
        raise HTTPException(status_code=404, detail="Invalid link")

    if share.get("revoked"):
        raise HTTPException(status_code=403, detail="Link revoked")

    if share["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=403, detail="Link expired")

    if share.get("permission") != "download":
        raise HTTPException(status_code=403, detail="Downloads disabled")

    file = files_collection.find_one({
        "_id": share["file_id"]
    })

    encrypted_data = download_file(file["storage_key"])
    decrypted_data = decrypt(encrypted_data)

    shares_collection.update_one(
        {"_id": share["_id"]},
        {
            "$inc": {"download_count": 1},
            "$set": {"last_accessed_at": datetime.utcnow()}
        }
    )

    return StreamingResponse(
        BytesIO(decrypted_data),
        media_type=file["content_type"],
        headers={
            "Content-Disposition":
            f'attachment; filename="{file["filename"]}"'
        }
    )

@router.put("/share/revoke/{token}")
def revoke_share(
    token: str,
    user=Depends(get_current_user)
):
    share = shares_collection.find_one({"token": token})

    if not share:
        raise HTTPException(status_code=404)

    file = files_collection.find_one({
        "_id": share["file_id"]
    })

    if file["owner_id"] != user["_id"]:
        raise HTTPException(status_code=403)

    shares_collection.update_one(
        {"token": token},
        {
            "$set": {"revoked": True}
        }
    )

    return {"message": "Link revoked"}

#share dashboard 
@router.get("/shares")
def get_shares(user=Depends(get_current_user)):

    user_files = list(files_collection.find({
        "owner_id": user["_id"]
    }))

    file_ids = [f["_id"] for f in user_files]

    shares = list(shares_collection.find({
        "file_id": {"$in": file_ids}
    }))

    result = []

    for share in shares:
        file = files_collection.find_one({
            "_id": share["file_id"]
        })

        result.append({
            "token": share["token"],
            "email": share.get("email"),
            "filename": file["filename"],
            "permission": share.get("permission"),
            "expires_at": share.get("expires_at"),
            "preview_count": share.get("preview_count", 0),
            "download_count": share.get("download_count", 0),
            "revoked": share.get("revoked", False),
        })

    return result

@router.put("/share/revoke/{token}")
def revoke_share(
    token: str,
    user=Depends(get_current_user)
):

    share = shares_collection.find_one({
        "token": token
    })

    if not share:
        raise HTTPException(
            status_code=404,
            detail="Share not found"
        )

    file = files_collection.find_one({
        "_id": share["file_id"]
    })

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    if file["owner_id"] != user["_id"]:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    shares_collection.update_one(
        {"token": token},
        {
            "$set": {
                "revoked": True
            }
        }
    )

    return {
        "message": "Share revoked"
    }   

#rename
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

@router.get("/shares")
def get_all_shares(user=Depends(get_current_user)):

    # get all user files
    user_files = list(
        files_collection.find({
            "owner_id": user["_id"]
        })
    )

    file_ids = [file["_id"] for file in user_files]

    # get all shares of those files
    shares = list(
        shares_collection.find({
            "file_id": {
                "$in": file_ids
            }
        })
    )

    results = []

    for share in shares:

        file = files_collection.find_one({
            "_id": share["file_id"]
        })

        if not file:
            continue

        results.append({
            "token": share["token"],

            "filename": file["filename"],

            "email": share.get("email"),

            "permission": share.get(
                "permission",
                "view"
            ),

            "expires_at": share.get(
                "expires_at"
            ),

            "preview_count": share.get(
                "preview_count",
                0
            ),

            "download_count": share.get(
                "download_count",
                0
            ),

            "revoked": share.get(
                "revoked",
                False
            ),

            "created_at": share.get(
                "created_at"
            ),
        })

    return results


# GENERATE AI SUMMARY
@router.post("/generate-summary/{file_id}")
async def generate_summary(
    file_id: str,
    current_user=Depends(get_current_user)
):
    """
    Generate an AI summary for a file using Gemini API.
    Caches the summary in the database for future retrieval.
    """
    try:
        # Verify user owns the file
        file = files_collection.find_one({"_id": ObjectId(file_id)})
        
        if not file:
            raise HTTPException(status_code=404, detail="File not found")
        
        if str(file["owner_id"]) != str(current_user["_id"]):
            raise HTTPException(status_code=403, detail="Not authorized to access this file")
        
        # Check if summary already cached
        if file.get("ai_summary") is not None:
            return {
                "summary": file["ai_summary"],
                "cached": True,
                "generated_at": file.get("ai_summary_generated_at")
            }
        
        # Download and decrypt file
        encrypted_data = download_file(file["storage_key"])
        decrypted_data = decrypt(encrypted_data)
        
        # Generate summary using Gemini
        summary = await generate_file_summary(
            decrypted_data,
            file["content_type"],
            file["filename"]
        )
        
        # Cache the summary in database
        files_collection.update_one(
            {"_id": ObjectId(file_id)},
            {
                "$set": {
                    "ai_summary": summary,
                    "ai_summary_generated_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "summary": summary,
            "cached": False,
            "generated_at": datetime.utcnow()
        }
    
    except ValueError as e:
        # File size or type error
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary: {str(e)}"
        )
