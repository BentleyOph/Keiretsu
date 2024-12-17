from pydantic import BaseModel, EmailStr,validator,Field
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    type: str  # Must match allowed types
    location: str
    skills: str
    availability: str = "available"
    bio: str = None

    @validator("type")
    def validate_type(cls, value):
        allowed_types = {"freelancer", "company", "individual"}
        if value not in allowed_types:
            raise ValueError(f"type must be one of {allowed_types}")
        return value
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProjectCreate(BaseModel):
    title: str
    description: str
    skills_required: Optional[str] = None
    is_open: Optional[bool] = True

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    skills_required: Optional[str] = None
    is_public: Optional[bool] = None

class CollaborationRequestCreate(BaseModel):
    target_user_id: Optional[int] = Field(None, description="ID of the target user for direct collaboration")
    target_project_id: Optional[int] = Field(None, description="ID of the target project to join")

    @property
    def is_valid_request(self) -> bool:
        return self.target_user_id is not None or self.target_project_id is not None
    
class CollaborationRequestUpdate(BaseModel):
    status: str

    @validator("status")
    def validate_status(cls, value):
        allowed_statuses = {"accepted", "declined"}
        if value not in allowed_statuses:
            raise ValueError(f"Status must be one of {allowed_statuses}")
        return value
    

class ResourceCreate(BaseModel):
    name: str = Field(..., description="Name of the resource")
    type: str = Field(..., description="Type of the resource")
    description: str = Field(None, description="Brief description of the resource")
class ResourceRequestCreate(BaseModel):
    resource_id: int = Field(..., description="ID of the resource being requested")

class ResourceRequestUpdate(BaseModel):
    status: str  # "accepted" or "denied"