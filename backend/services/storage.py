import boto3

from botocore.client import Config

s3 = boto3.client(
    "s3",
    aws_access_key_id="b22ce4d8d16efef515ed6913a31649f8",
    aws_secret_access_key="1ccb3bc856857f8f1e855f4196d2fee32fbb95abeb5cf75ec4d366455a634918",
    endpoint_url="https://f718feec151f8c39383e7c6c5fb7ce8c.r2.cloudflarestorage.com",
    region_name="auto",
    config=Config(signature_version="s3v4"),
)
BUCKET = "adeeb"

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