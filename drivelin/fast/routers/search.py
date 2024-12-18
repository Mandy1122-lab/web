

from fastapi import FastAPI, HTTPException, APIRouter, JSONResponse
from google.cloud import firestore
import os

# --- Firebase 設定 ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CREDENTIALS_PATH = os.path.join(BASE_DIR, "serviceAccount.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = FIREBASE_CREDENTIALS_PATH

db = firestore.Client()

app.include_router(router)
app = FastAPI()
router = APIRouter(prefix="/search", tags=["search"])

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# 搜尋函數
def search_firestore(query):
    results = []
    query_ref = db.collection("spot").where("s_name", "==", query)
    docs = query_ref.stream()
    for doc in docs:
        doc_data = doc.to_dict()
        doc_data["id"] = doc.id
        results.append(doc_data)

    query_ref_tags = db.collection("spot").where("s_tag", "array_contains", query)
    docs_tags = query_ref_tags.stream()
    for doc in docs_tags:
        doc_data = doc.to_dict()
        doc_data["id"] = doc.id
        if doc_data not in results:
            results.append(doc_data)

    return results


@router.get("/")
async def search(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")
    results = search_firestore(q)
    if not results:
        raise HTTPException(status_code=404, detail="No results found")
    return results
