from fastapi import FastAPI, HTTPException, Depends,Query
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from schemas import UserCreate,UserLogin,ProjectCreate,ProjectUpdate,CollaborationRequestCreate,CollaborationRequestUpdate,ResourceCreate,ResourceRequestCreate
from database import get_db
from crud import create_user, get_user_by_email,verify_password,get_user_by_id
from crud import create_access_token,decode_access_token
from crud import get_filtered_projects,create_project,get_project_details,get_filtered_users
from crud import is_project_owner,update_project
from crud import create_collaboration_request,is_user_active,is_project_public,get_incoming_requests,get_outgoing_requests
from crud import update_collaboration_request_status,is_request_target_or_owner
from crud import create_resource,get_resources,create_resource_request,get_resource_requests

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

# @app.get("/users")
# def get_users(db=Depends(get_db)):
#     """
#     Fetch all users from the database.
#     Returns a list of users with non-sensitive information.
#     """
#     users = get_all_users(db)
#     return [
#         {
#             "id": user["id"],
#             "email": user["email"],
#             "name": user["name"],
#             "type": user["type"],
#             "location": user["location"],
#             "skills": user["skills"],
#             "availability": user["availability"],
#             "bio": user["bio"],
#             "is_active": user["is_active"],
#         }
#         for user in users
#     ]


@app.get("/users")
def search_users(
    skills: str = Query(None),
    location: str = Query(None),
    availability: str = Query(None),
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    Search for active users (collaborators) with optional filters for skills, location, and availability.
    """
    users = get_filtered_users(db, skills=skills, location=location, availability=availability)
    return [
        {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "type": user["type"],
            "location": user["location"],
            "skills": user["skills"],
            "availability": user["availability"],
            "bio": user["bio"],
        }
        for user in users
    ]



@app.get("/projects")
def browse_projects(
    title: str = Query(None),
    skills: str = Query(None),
    owner: str = Query(None),
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    Browse open projects with optional filters for title, skills, and owner.
    """
    projects = get_filtered_projects(db, title=title, skills=skills, owner=owner)
    return [
        {
            "project_id": project["project_id"],
            "title": project["title"],
            "description": project["description"],
            "required_skills": project["skills_required"],
            "owner_info": {
                "name": project["owner_name"],
                "email": project["owner_email"],
            },
        }
        for project in projects
    ]


@app.post("/projects")
def create_new_project(
    project_data: ProjectCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    Create a new project for the authenticated user.
    """
    # Get the owner ID from the authenticated user
    owner_id = current_user["id"]

    # Create the project
    project_id = create_project(db, owner_id, project_data)

    # Return the created project details
    return {
        "project_id": project_id,
        "title": project_data.title,
        "description": project_data.description,
        "skills_required": project_data.skills_required,
        "is_open": project_data.is_open,
        "owner_id": owner_id,
    }



@app.get("/projects/{project_id}")
def view_project_details(
    project_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    View the details of a specific project, including collaborators.
    """
    project_data = get_project_details(db, project_id)
    if not project_data:
        raise HTTPException(status_code=404, detail="Project not found")

    project = project_data["project"]
    collaborators = project_data["collaborators"]

    # Format the response
    return {
        "project_id": project["project_id"],
        "title": project["title"],
        "description": project["description"],
        "required_skills": project["skills_required"],
        "owner": {
            "name": project["owner_name"],
            "email": project["owner_email"]
        },
        "collaborators": [
            {
                "user_id": collaborator["user_id"],
                "name": collaborator["name"],
                "email": collaborator["email"],
                "role": collaborator["role"],
                "status": collaborator["status"]
            }
            for collaborator in collaborators
        ]
    }


@app.put("/projects/{project_id}")
def update_project_details(
    project_id: int,
    project_data: ProjectUpdate,
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    Update the details of a specific project. Only the project owner is allowed.
    """
    # Check if the current user is the owner of the project
    if not is_project_owner(db, project_id, current_user["id"]):
        raise HTTPException(status_code=403, detail="You are not authorized to update this project")

    # Prepare the updates
    updates = {key: value for key, value in project_data.dict().items() if value is not None}

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Perform the update
    rows_updated = update_project(db, project_id, updates)
    if rows_updated == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"message": "Project updated successfully", "updated_fields": updates}



@app.post("/collaboration-requests")
def send_collaboration_request(
    request: CollaborationRequestCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    Send a request to either a user for direct collaboration or to join a public project.
    """
    # Validate the request body
    if not request.target_user_id and not request.target_project_id:
        raise HTTPException(status_code=400, detail="Either target_user_id or target_project_id must be provided")

    if request.target_user_id:
        # Validate target user
        if not is_user_active(db, request.target_user_id):
            raise HTTPException(status_code=404, detail="Target user not found or inactive")
        target = request.target_user_id
    elif request.target_project_id:
        # Validate target project
        if not is_project_public(db, request.target_project_id):
            raise HTTPException(status_code=404, detail="Target project not found or not public")
        target = request.target_project_id
    else:
        raise HTTPException(status_code=400, detail="Invalid collaboration request")

    # Create the collaboration request
    request_id = create_collaboration_request(
        db=db,
        sender_id=current_user["id"],
        target_user_id=request.target_user_id,
        target_project_id=request.target_project_id,
    )

    return {"request_id": request_id, "status": "pending"}


@app.get("/collaboration-requests")
def view_collaboration_requests(
    incoming: bool = Query(None, description="View incoming requests"),
    outgoing: bool = Query(None, description="View outgoing requests"),
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    View incoming or outgoing collaboration requests for the current user.
    """
    if incoming and outgoing:
        raise HTTPException(status_code=400, detail="Only one of 'incoming' or 'outgoing' can be true")

    if not incoming and not outgoing:
        raise HTTPException(status_code=400, detail="Specify either 'incoming' or 'outgoing'")

    if incoming:
        requests = get_incoming_requests(db, current_user["id"])
    elif outgoing:
        requests = get_outgoing_requests(db, current_user["id"])

    return requests


@app.patch("/collaboration-requests/{request_id}")
def update_collaboration_request(
    request_id: int,
    request_data: CollaborationRequestUpdate,
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    Update the status of a collaboration request.
    Only the target user or project owner can update the status.
    """
    # Check if the user is authorized to update the request
    if not is_request_target_or_owner(db, request_id, current_user["id"]):
        raise HTTPException(status_code=403, detail="You are not authorized to update this request")

    # Update the request status
    rows_updated = update_collaboration_request_status(db, request_id, request_data.status)
    if rows_updated == 0:
        raise HTTPException(status_code=404, detail="Collaboration request not found")

    return {"message": "Collaboration request updated successfully", "status": request_data.status}



@app.post("/resources")
def list_resource(
    resource_data: ResourceCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    List a resource that the authenticated user can offer.
    """
    resource_id = create_resource(db, current_user["id"], resource_data)

    return {
        "resource_id": resource_id,
        "name": resource_data.name,
        "type": resource_data.type,
        "description": resource_data.description,
        "owner_id": current_user["id"]
    }

@app.get("/resources")
def browse_resources(
    resource_type: str = Query(None, description="Filter by resource type"),
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    Browse available resources with an optional filter for type.
    """
    resources = get_resources(db, resource_type=resource_type)
    return [
        {
            "resource_id": resource["resource_id"],
            "owner_name": resource["owner_name"],
            "name": resource["resource_name"],
            "description": resource["description"]
        }
        for resource in resources
    ]

@app.post("/resource-requests")
def request_resource_access(
    request_data: ResourceRequestCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    Create a new access request for a resource.
    """
    try:
        request_id = create_resource_request(db, request_data.resource_id, current_user["id"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Access request created successfully", "request_id": request_id}

@app.get("/resource-requests")
def view_resource_requests(
    incoming: bool = Query(False, description="View incoming requests"),
    db=Depends(get_db),
    current_user=Depends(get_current_user_from_token),
):
    """
    View incoming or outgoing resource requests.
    """
    requests = get_resource_requests(db, current_user["id"], incoming)
    return [
        {
            "request_id": request["request_id"],
            "resource_name": request["resource_name"],
            "requester_name": request["requester_name"],
            "status": request["status"]
        }
        for request in requests
    ]
