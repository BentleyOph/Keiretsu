from sqlite3 import Connection
from schemas import UserCreate
from bcrypt import hashpw, gensalt, checkpw

def create_user(db: Connection, user: UserCreate):
    cursor = db.cursor()


    hashed_pw = hash_password(user.password)
    cursor.execute("""
    INSERT INTO users (email, password, name, type, location, skills, availability, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, (user.email, hashed_pw, user.name, user.type, user.location, user.skills, user.availability, user.bio))
    db.commit()
    return cursor.lastrowid

def get_user_by_email(db: Connection, email: str):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    return cursor.fetchone()




def hash_password(password: str) -> str:
    return hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

def verify_password(input_password: str, stored_password: str) -> bool:
    return checkpw(input_password.encode('utf-8'), stored_password.encode('utf-8'))
