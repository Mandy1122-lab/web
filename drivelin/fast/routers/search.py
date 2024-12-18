# # from fastapi import FastAPI, HTTPException, APIRouter
# # from fastapi.middleware.cors import CORSMiddleware
# # from google.cloud import firestore
# # import os

# # --- Firebase 設定 ---
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# FIREBASE_CREDENTIALS_PATH = os.path.join(BASE_DIR, "serviceAccount.json")
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = FIREBASE_CREDENTIALS_PATH

# # 初始化 Firestore 客戶端
# db = firestore.Client()
# collection_name = "spot"

# # --- FastAPI 應用 ---
# app = FastAPI()
# router = APIRouter(prefix="/search", tags=["search"])

# # --- CORS 設定 ---
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # 允許的前端來源
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Firestore 搜尋功能 ---
# def search_firestore(query: str):
#     results = []
    
#     # 搜尋 s_name 欄位
#     query_ref = db.collection(collection_name).where("s_name", "==", query)
#     for doc in query_ref.stream():
#         results.append(doc.to_dict())
    
#     # 搜尋 s_tag 陣列
#     query_ref_tags = db.collection(collection_name).where("s_tag", "array_contains", query)
#     for doc in query_ref_tags.stream():
#         if doc.to_dict() not in results:  # 避免重複加入結果
#             results.append(doc.to_dict())

#     return results

# # --- 搜尋路由 ---
# @router.get("/")  # 修改這行
# async def search(q: str):
#     results = search_firestore(q)
#     if not results:
#         raise HTTPException(status_code=404, detail="No results found")
#     return results



# # --- 載入路由 ---

from fastapi import FastAPI, HTTPException, APIRouter
from google.cloud import firestore
import os

# --- Firebase 設定 ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CREDENTIALS_PATH = os.path.join(BASE_DIR, "serviceAccount.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = FIREBASE_CREDENTIALS_PATH

# 初始化 Firestore 客戶端
db = firestore.Client()

# --- FastAPI 應用 ---
app = FastAPI()
router = APIRouter(prefix="/search", tags=["search"])

# 搜尋函數，搜尋景點名稱和標籤
def search_firestore(query):
    results = []
    query_ref = db.collection("spot").where("s_name", "==", query)
    docs = query_ref.stream()
    for doc in docs:
        print(f"Found by s_name: {doc.id} => {doc.to_dict()}")
        results.append(doc.to_dict())
    
    query_ref_tags = db.collection("spot").where("s_tag", "array_contains", query)
    docs_tags = query_ref_tags.stream()
    for doc in docs_tags:
        print(f"Found by s_tag: {doc.id} => {doc.to_dict()}")
        if doc.to_dict() not in results:
            results.append(doc.to_dict())
    
    return results

@router.get("/")
async def search(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")
    results = search_firestore(q)
    if not results:
        raise HTTPException(status_code=404, detail="No results found")
    return results

# --- 載入路由 ---
app.include_router(router)
