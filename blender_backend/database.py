from pymongo import MongoClient

# Connect to MongoDB (Update with your MongoDB URI)
MONGO_URI = "mongodb+srv://budsnest123:busd2612@cluster0.ckib3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)

# Select Database and Collection
db = client["buds-crochet"]  # Your database name
users_collection = db["users"]  # Collection name
patterns_collection = db["patterns"]  # ✅ Patterns Collection