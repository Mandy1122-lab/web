from fastapi import FastAPI, HTTPException, APIRouter
from google.cloud import firestore
import os

router = APIRouter(prefix="/search", tags=["search", "spot"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CREDENTIALS_PATH = os.path.join(BASE_DIR, "serviceAccount.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = FIREBASE_CREDENTIALS_PATH



db = firestore.Client()
collection_name = "spot"

app = FastAPI()

# 搜尋函數，搜尋景點名稱和標籤
def search_firestore(query):
    results = []
    query_ref = db.collection("spot").where("s_name", "==", query)
    docs = query_ref.stream()
    for doc in docs:
        results.append(doc.to_dict())
    
    query_ref_tags = db.collection("spot").where("s_tag", "array_contains", query)
    docs_tags = query_ref_tags.stream()
    for doc in docs_tags:
        if doc.to_dict() not in results:
            results.append(doc.to_dict())
    
    return results

@router.get("/search")
async def search(q: str):
    results = search_firestore(q)
    if not results:
        raise HTTPException(status_code=404, detail="No results found")
    return results
