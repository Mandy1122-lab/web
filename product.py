from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/product", tags=["product_api", "db"])

class Product(BaseModel):
    desc:str
    price:int

# creating list
list = []
 
# appending instances to list
list.append(Product(desc='iPad', price=20000))
list.append(Product(desc='iPhone 8', price=20000))
list.append(Product(desc='iPhone X', price=30000))
list.append(Product(desc='iPhone 14', price=30000))

@router.get("/")
async def getProducts(skip: int = 0, limit: int = len(list)):
    return list[skip: skip+limit]
@router.get("/{product_id}")
async def getProduct(product_id:int):
    if (product_id <0 or product_id >= len(list)):
        raise HTTPException(status_code=404, detail="錯誤產品編號")
    return list[product_id]

@router.post("/")
async def create_item(product: Product):
    list.append(product)
    return product
