from fastapi import APIRouter, UploadFile, File
from fastapi.responses import Response
from services.storage import upload_file, download_file
from utils.encryption import encrypt, decrypt

router = APIRouter()


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()

    encrypted_data = encrypt(content)
    key = f"uploads/{file.filename}"

    upload_file(encrypted_data, key)

    return {"message": "uploaded securely"}


@router.get("/download/{filename}")
async def download(filename: str):
    key = f"uploads/{filename}"

    encrypted_data = download_file(key)
    decrypted_data = decrypt(encrypted_data)

    return Response(
        content=decrypted_data,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )