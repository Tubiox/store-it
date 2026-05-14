import os
import boto3

from botocore.client import Config

s3 = boto3.client(
    "s3",
    endpoint_url="http://127.0.0.1:9000",
    aws_access_key_id=os.getenv("MINIO_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("MINIO_SECRET_KEY"),
    region_name="us-east-1",
    config=Config(signature_version="s3v4"),
)
BUCKET = "storeit"

def ensure_bucket():
    try:
        s3.head_bucket(Bucket=BUCKET)
    except:
        print("Creating bucket:", BUCKET)
        s3.create_bucket(Bucket=BUCKET)

def upload_file(file_bytes, key, content_type):
    try:
        ensure_bucket()

        print("Uploading to MinIO:", key)
        print("File size:", len(file_bytes))
        
        response = s3.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=file_bytes,
            ContentType=content_type        
)

        print("MinIO response:", response)
        print("Upload successful")

    except Exception as e:
        print("MINIO ERROR:", str(e))
        raise e

def download_file(key):
    try:
        ensure_bucket()
        print("Fetching from MinIO:", key)
        response = s3.get_object(Bucket=BUCKET, Key=key)
        print("Download success")
        return response["Body"].read()

    except Exception as e:
        print("MINIO DOWNLOAD ERROR:", str(e))
        raise e
def delete_from_storage(key):
    s3.delete_object(Bucket=BUCKET, Key=key)