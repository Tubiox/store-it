from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URL"))

db = client["storeit"]

users_collection = db["users"]
files_collection = db["files"]
shares_collection = db["shares"]