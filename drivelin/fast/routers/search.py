from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, initialize_app, firestore
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CREDENTIALS_PATH = os.path.join(BASE_DIR, "serviceAccount.json")

if not os.path.exists(FIREBASE_CREDENTIALS_PATH):
    raise FileNotFoundError(f"Firebase credentials file not found at {FIREBASE_CREDENTIALS_PATH}")

cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
try:
    if not initialize_app._apps:
        initialize_app(cred)
except Exception as e:
    print(f"Firebase 初始化錯誤: {e}")

db = firestore.client()

app = FastAPI()
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


def search_firestore(query):
    results = []
    # 搜尋name
    query_ref = db.collection("spot").where("s_name", "==", query)
    docs = query_ref.stream()
    for doc in docs:
        results.append(doc.to_dict())

    # 搜尋tag
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


# 測試 Firestore 連接
@router.get("/test-firestore")
async def test_firestore():
    try:
        test_ref = db.collection("spot").limit(1)
        docs = test_ref.stream()
        for doc in docs:
            return {"message": "Firestore connected successfully!", "doc": doc.to_dict()}
        return {"message": "Firestore connected, but no documents found."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firestore connection error: {e}")

app.include_router(router)
