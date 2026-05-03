from fastapi import Depends, HTTPException, APIRouter, UploadFile, File
from fastapi.responses import Response
from routes.auth import get_current_user
from services.storage import upload_file, download_file
from utils.encryption import encrypt, decrypt
from bson import ObjectId
from datetime import datetime
from database import db

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

        upload_file(encrypted_data, storage_key)

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
        file = db.files.find_one({"_id": ObjectId(file_id)})

        if not file:
            raise HTTPException(status_code=404, detail="File not found")

        if file["owner_id"] != current_user["_id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")

        # Download encrypted file
        encrypted_data = download_file(file["storage_key"])

        # Decrypt file
        decrypted_data = decrypt(encrypted_data)

        return Response(
            content=decrypted_data,
            media_type=file["content_type"],
            headers={
                "Content-Disposition": f"attachment; filename={file['filename']}"
            }
        )

    except Exception as e:
        print("DOWNLOAD ERROR:", str(e)) 
        raise HTTPException(status_code=500, detail=str(e))


# GET USER FILES
@router.get("/files")
def get_files(current_user=Depends(get_current_user)):
    try:
        files = list(db.files.find({
            "owner_id": current_user["_id"],
            "is_deleted": False
        }))

        # Convert ObjectId to string
        for file in files:
            file["_id"] = str(file["_id"])
            file["owner_id"] = str(file["owner_id"])

        #  ALWAYS return structured response
        return {
    "documents": files,
    "total": len(files)
}
    except Exception as e:
        print("FETCH FILES ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
    path="/"
    )
    return {"message": "Logged out"}