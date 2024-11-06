import mysql.connector
def getDB():
  mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="practice")
  return mydb