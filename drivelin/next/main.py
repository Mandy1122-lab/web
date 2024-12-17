import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from firebase_admin import credentials, initialize_app, firestore
from typing import List

# 設定 Firebase JSON 檔案的路徑
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CREDENTIALS_PATH = os.path.join(BASE_DIR, "routers/serviceAccount.json")

# 檢查 Firebase 憑證是否存在
if not os.path.exists(FIREBASE_CREDENTIALS_PATH):
    raise FileNotFoundError(f"Firebase credentials file not found at {FIREBASE_CREDENTIALS_PATH}")

# 初始化 Firebase
try:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    initialize_app(cred)
    print("Firebase connection successful")
except Exception as e:
    print(f"Error initializing Firebase: {str(e)}")
    raise


# 初始化 Firestore 客戶端
db = firestore.client()

# 初始化 FastAPI 應用程式
app = FastAPI()

from routers import spot

app.include_router(spot.router)


# 設定 CORS 中介軟體
origins = [
    "http://localhost:3000",  # Next.js 前端的網址
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 主頁路由
@app.get("/")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

# 優化的搜尋功能，僅搜尋 `s_name` 和 `s_tag`
@app.get("/search_spots")
async def search_spots(q: str = Query(..., description="搜尋景點關鍵字"), limit: int = 10, page: int = 1):
    # 從 Firestore 查詢景點資料
    spots_ref = db.collection('spot')  # 使用 'spot' 集合
    
    # 搜尋名稱和標籤
    query_name = spots_ref.where('s_name', '>=', q).where('s_name', '<=', q + '\uf8ff')
    query_tag = spots_ref.where('s_tag', 'array_contains', q)  # 使用 `array_contains` 搜尋標籤

    # 分頁處理：限制每次查詢的資料筆數
    query_name = query_name.limit(limit).offset((page - 1) * limit)
    query_tag = query_tag.limit(limit).offset((page - 1) * limit)

    # 獲取查詢結果
    results_name = query_name.stream()
    results_tag = query_tag.stream()

    # 合併所有結果
    all_results = list(results_name) + list(results_tag)

    # 將查詢結果轉換成列表
    filtered_spots = []
    for doc in all_results:
        spot = doc.to_dict()
        filtered_spots.append({
            "id": doc.id,
            "s_name": spot.get('s_name', ''),
            "s_tag": spot.get('s_tag', [])
        })
    
    return {"spots": filtered_spots, "total": len(all_results)}

# 設定靜態檔案路徑
static_dir = os.path.join(os.getcwd(), 'fast', 'static')  
app.mount("/static", StaticFiles(directory=static_dir), name="static")

