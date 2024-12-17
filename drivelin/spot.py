from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4
import firebase_admin
from firebase_admin import credentials, firestore
import os

router = APIRouter(prefix="/spot", tags=["spot_api", "spot"])

# --- Firebase 初始化 ---
SERVICE_ACCOUNT_FILE = os.environ.get("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
    firebase_admin.initialize_app(cred)

db = firestore.client()
collection_name = "spot"

# --- 定義景點模型 ---
class Spot(BaseModel):
    id: str | None = None
    s_name: str
    s_add: str
    map: str
    s_intro: str
    imageUrl: str | None = None  # 景點圖片
    coverUrls: list[str] = []  # 劇照圖片 URL 列表
    s_tag: list[str] = []  # 標籤字段，這裡將其設為列表類型

# --- 取得所有景點 ---
@router.get("/")
async def get_spots(skip: int = 0, limit: int = 10):
    spots_ref = db.collection(collection_name).stream()
    spots = [doc.to_dict() for doc in spots_ref]
    return spots[skip: skip + limit]

# --- 取得單個景點 ---
@router.get("/{spot_id}")
async def get_spot(spot_id: str):
    spot_ref = db.collection(collection_name).document(spot_id).get()
    if not spot_ref.exists:
        raise HTTPException(status_code=404, detail="景點不存在")
    return spot_ref.to_dict()

# --- 新增景點 ---
@router.post("/")
async def create_spot(spot: Spot):
    spot.id = str(uuid4())  # 為每個景點生成唯一 ID
    spot_data = spot.dict()

    # 儲存景點資料到 Firestore
    db.collection(collection_name).document(spot.id).set(spot_data)
    return spot_data

# --- 更新景點 ---
@router.put("/{spot_id}")
async def update_spot(spot_id: str, spot: Spot):
    spot_ref = db.collection(collection_name).document(spot_id)
    if not spot_ref.get().exists:
        raise HTTPException(status_code=404, detail="景點不存在")
    
    spot_data = spot.dict()
    spot_data["id"] = spot_id  # 不更新 ID
    
    # 更新景點資料
    spot_ref.update(spot_data)
    return spot_data

# --- 刪除景點 ---
@router.delete("/{spot_id}")
async def delete_spot(spot_id: str):
    spot_ref = db.collection(collection_name).document(spot_id)
    if not spot_ref.get().exists:
        raise HTTPException(status_code=404, detail="景點不存在")
    
    spot_ref.delete()
    return {"message": "景點已刪除", "id": spot_id}
