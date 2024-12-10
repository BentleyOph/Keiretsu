from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from schemas import UserCreate,UserLogin
from database import get_db
from crud import create_user, get_user_by_email,verify_password,get_user_by_id, get_all_users
from crud import create_access_token,decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") #OAuth2PasswordBearer is a class that provides a dependency for handling OAuth2 password flow. 

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
    """
    Authenticate user and issue a JWT token.
    """
    user = get_user_by_email(db, credentials.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    access_token = create_access_token(data={"sub": str(user["id"])})
    return {"access_token": access_token, "token_type": "bearer"}




oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user_from_token(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    """
    Extract and validate the JWT token, and fetch the current user.
    """
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub") 
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")




@app.get("/me")
def get_current_user(request_user=Depends(get_current_user_from_token)):
    """
    Return the current user's details using JWT authentication.
    """
    return {
        "id": request_user["id"],
        "email": request_user["email"],
        "name": request_user["name"],
        "type": request_user["type"],
        "location": request_user["location"],
        "skills": request_user["skills"],
        "availability": request_user["availability"],
        "bio": request_user["bio"],
        "is_active": request_user["is_active"],
    }

@app.get("/users")
def get_users(db=Depends(get_db)):
    """
    Fetch all users from the database.
    Returns a list of users with non-sensitive information.
    """
    users = get_all_users(db)
    return [
        {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "type": user["type"],
            "location": user["location"],
            "skills": user["skills"],
            "availability": user["availability"],
            "bio": user["bio"],
            "is_active": user["is_active"],
        }
        for user in users
    ]




