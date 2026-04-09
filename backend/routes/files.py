from fastapi import Depends, HTTPException, APIRouter, UploadFile, File
from routes.auth import get_current_user
from fastapi.responses import Response
from services.storage import upload_file, download_file
from utils.encryption import encrypt, decrypt
from bson import ObjectId
from datetime import datetime
from database import db

router = APIRouter()

@router.post("/upload")
async def upload(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    content = await file.read()

    encrypted_data = encrypt(content)

    file_id = ObjectId()
    storage_key = f"{current_user['_id']}/{file_id}.enc"

    upload_file(encrypted_data, storage_key)

    file_data = {
        "_id": file_id,
        "owner_id": current_user["_id"],
        "filename": file.filename,
        "storage_key": storage_key,
        "file_size": len(content),
        "content_type": file.content_type,
        "uploaded_at": datetime.utcnow(),
        "encryption": {"algorithm": "Fernet"},
        "hash": "temp",
        "is_deleted": False
    }

    db.files.insert_one(file_data)

    return {
        "message": "uploaded securely",
        "file_id": str(file_id)
    }

@router.get("/download/{file_id}")
async def download(file_id: str, current_user=Depends(get_current_user)):
    file = db.files.find_one({"_id": ObjectId(file_id)})

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    if file["owner_id"] != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    encrypted_data = download_file(file["storage_key"])
    decrypted_data = decrypt(encrypted_data)

    return Response(
        content=decrypted_data,
        media_type=file["content_type"],
        headers={
            "Content-Disposition": f"attachment; filename={file['filename']}"
        }
    )


@router.get("/files")
def get_files(current_user=Depends(get_current_user)):
    files = list(db.files.find({
        "owner_id": current_user["_id"],
        "is_deleted": False
    }))

    # convert ObjectId to string
    for file in files:
        file["_id"] = str(file["_id"])

    return files