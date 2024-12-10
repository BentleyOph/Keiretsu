from sqlite3 import Connection
from schemas import UserCreate 
from bcrypt import hashpw, gensalt, checkpw
from datetime import datetime, timedelta,timezone
from jose import jwt


#hardcoded for now 
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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


def get_user_by_id(db: Connection, user_id: int):
    """Fetch a user by ID from the database."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    return cursor.fetchone()

def get_all_users(db: Connection):
    """Fetch all users from the database."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    return cursor.fetchall()

def hash_password(password: str) -> str:
    return hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

def verify_password(input_password: str, stored_password: str) -> bool:
    return checkpw(input_password.encode('utf-8'), stored_password.encode('utf-8'))


def create_access_token(data: dict):
    """Generate a JWT token."""
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Decode and validate a JWT token."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])