

# class Product(BaseModel):
#     desc: str
#     price: int

# # 使用更具意義的變數名稱
# products = []

# # 初始化產品列表
# products.append(Product(desc='iPad', price=20000))
# products.append(Product(desc='iPhone 8', price=20000))
# products.append(Product(desc='iPhone X', price=30000))
# products.append(Product(desc='iPhone 14', price=30000))

# @app.get("/")
# def hello_fast_api():
#     return {"message": "Hello from FastAPI"}

# @app.get("/product")
# async def get_products(skip: int = 0, limit: int = 10):
#     return products[skip: skip + limit]

# @app.get("/product/{product_id}")
# async def get_product(product_id: int):
#     if product_id < 0 or product_id >= len(products):
#         raise HTTPException(status_code=404, detail="錯誤產品編號")
#     return products[product_id]

# @app.post("/product/")
# async def create_product(product: Product):
#     products.append(product)
#     return product

# @app.put("/product/{product_id}", response_model=Product)
# async def update_product(product_id: int, item: Product):
#     if product_id < 0 or product_id >= len(products):
#         raise HTTPException(status_code=404, detail="錯誤產品編號")
    
#     products[product_id] = item
#     return item

# @app.delete("/product/{product_id}", response_model=dict)
# async def delete_product(product_id: int):
#     if product_id < 0 or product_id >= len(products):
#         raise HTTPException(status_code=404, detail="錯誤產品編號")
    
#     # 刪除項目
#     deleted_item = products.pop(product_id)
    
#     # 返回刪除成功的訊息
#     return {"detail": "Product deleted successfully", "item": deleted_item}
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from firebase_admin import credentials, initialize_app

# 設定 Firebase JSON 檔案的路徑
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CREDENTIALS_PATH = os.path.join(BASE_DIR, "config/firebase-adminsdk.json")

# 檢查 Firebase 憑證是否存在
if not os.path.exists(FIREBASE_CREDENTIALS_PATH):
    raise FileNotFoundError(f"Firebase credentials file not found at {FIREBASE_CREDENTIALS_PATH}")

# 初始化 Firebase
cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
initialize_app(cred)

# 初始化 FastAPI 應用程式
app = FastAPI()

# 引入路由
from routers import product, job, uploadFile
app.include_router(product.router)
app.include_router(job.router)
app.include_router(uploadFile.router)

# 設定 CORS 中介軟體
origins = [
    "http://localhost:3000",
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

# 設定靜態檔案路徑
static_dir = os.path.join(os.getcwd(), 'fast', 'static')  
app.mount("/static", StaticFiles(directory=static_dir), name="static")
