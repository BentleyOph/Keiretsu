from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    type: str
    location: str
    skills: str
    availability: str = "available"
    bio: str = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str