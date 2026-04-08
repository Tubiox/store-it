import boto3
import os
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client(
    "s3",
    endpoint_url="http://127.0.0.1:9000",
    aws_access_key_id=os.getenv("MINIO_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("MINIO_SECRET_KEY"),
)

BUCKET = os.getenv("MINIO_BUCKET")


def upload_file(file_bytes, key):
    s3.put_object(
        Bucket=BUCKET,
        Key=key,
        Body=file_bytes
    )    

def download_file(key):
    response = s3.get_object(Bucket=BUCKET, Key=key)
    return response["Body"].read()