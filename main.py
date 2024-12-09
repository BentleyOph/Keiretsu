from fastapi import FastAPI, HTTPException, Depends
from schemas import UserCreate,UserLogin
from database import get_db
from crud import create_user, get_user_by_email,verify_password

app = FastAPI()

@app.post("/register")
def register_user(user: UserCreate, db=Depends(get_db)):
    # Check if user already exists
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="email already registered")
    
    # Create the user
    user_id = create_user(db, user)
    return {"id": user_id, "email": user.email, "message": "user registered successfully"}


@app.post("/login")
def login_user(credentials: UserLogin, db=Depends(get_db)):
    # Fetch user by email
    user = get_user_by_email(db, credentials.email)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    # Validate password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="invalid credentials")

    # Login success
    return {"message": "Login successful", "user_id": user["id"], "email": user["email"]}
