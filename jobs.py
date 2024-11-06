from fastapi import APIRouter
from pydantic import BaseModel
from db import getDB

router = APIRouter(prefix="/job", tags=["job_api"])
class Job(BaseModel):
  company:str
  content:str

@router.get("/")
async def getJobs():
  mydb = getDB()
  mycursor = mydb.cursor(dictionary=True)
  mycursor.execute("SELECT * FROM job")
  myresult = mycursor.fetchall()
  return myresult