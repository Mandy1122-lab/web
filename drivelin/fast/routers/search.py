from fastapi import FastAPI, HTTPException
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("path/to/your/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

# 搜尋函數，搜尋景點名稱和標籤
def search_firestore(query):
    results = []
    query_ref = db.collection("your_collection").where("s_name", "==", query)
    docs = query_ref.stream()
    for doc in docs:
        results.append(doc.to_dict())
    
    query_ref_tags = db.collection("your_collection").where("s_tag", "array_contains", query)
    docs_tags = query_ref_tags.stream()
    for doc in docs_tags:
        if doc.to_dict() not in results:
            results.append(doc.to_dict())
    
    return results

@app.get("/search")
async def search(q: str):
    results = search_firestore(q)
    if not results:
        raise HTTPException(status_code=404, detail="No results found")
    return results
