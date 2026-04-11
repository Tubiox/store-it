import boto3

s3 = boto3.client(
    "s3",
    endpoint_url="http://127.0.0.1:9000",
    aws_access_key_id="minioadmin",
    aws_secret_access_key="minioadmin",
    region_name="us-east-1",
)

BUCKET = "storeit"


def ensure_bucket():
    buckets = s3.list_buckets()["Buckets"]
    if not any(b["Name"] == BUCKET for b in buckets):
        print("Creating bucket:", BUCKET)
        s3.create_bucket(Bucket=BUCKET)


def upload_file(file_bytes, key):
    try:
        ensure_bucket()

        print("Uploading to MinIO:", key)
        print("File size:", len(file_bytes))

        s3.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=file_bytes,
            ContentType="application/octet-stream"
        )

        print("Upload successful")

    except Exception as e:
        print("MINIO ERROR:", str(e))
        raise e


def download_file(key):
    response = s3.get_object(Bucket=BUCKET, Key=key)
    return response["Body"].read()