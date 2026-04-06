from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["storeit"]

users_collection = db["users"]