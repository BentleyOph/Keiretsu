from sqlite3 import Connection
from schemas import UserCreate 
from bcrypt import hashpw, gensalt, checkpw
from datetime import datetime, timedelta,timezone
from jose import jwt
import random


#hardcoded for now 
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#Users
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

def get_filtered_users(db, skills=None, location=None, availability=None):
    """
    Fetch active users with optional filters for skills, location, and availability.
    """
    query = """
    SELECT
        id AS user_id,
        name,
        email,
        location,
        skills,
        type,
        availability,
        bio
    FROM users
    WHERE is_active = 1
    """
    params = []

    # Apply filters
    if skills:
        skill_filters = skills.split(",")  # Split skills into a list
        query += " AND " + " AND ".join(
            [f"skills LIKE ?" for _ in skill_filters]
        )
        params.extend([f"%{skill.strip()}%" for skill in skill_filters])
    if location:
        query += " AND location LIKE ?"
        params.append(f"%{location}%")
    if availability:
        query += " AND availability = ?"
        params.append(availability)

    # Execute query
    cursor = db.cursor()
    cursor.execute(query, params) 
    return cursor.fetchall()






#Projects
def get_filtered_projects(db, title=None, skills=None, owner=None):
    """
    Fetch open projects with optional filters.
    """
    query = """
    SELECT
        p.id AS project_id,
        p.title,
        p.description,
        p.skills_required,
        u.name AS owner_name,
        u.email AS owner_email
    FROM projects p
    JOIN users u ON p.owner_id = u.id
    WHERE p.is_open = 1
    """
    params = []

    # Apply filters
    if title:
        query += " AND p.title LIKE ?"
        params.append(f"%{title}%")
    if skills:
        skill_filters = skills.split(",")  # Split skills into a list
        query += " AND " + " AND ".join(
            [f"p.skills_required LIKE ?" for _ in skill_filters]
        )
        params.extend([f"%{skill.strip()}%" for skill in skill_filters])
    if owner:
        query += " AND (u.name LIKE ? OR u.email LIKE ?)"
        params.append(f"%{owner}%")
        params.append(f"%{owner}%")

    # Execute query
    cursor = db.cursor()
    cursor.execute(query, params)
    return cursor.fetchall()


def create_project(db, owner_id: int, project_data):
    """
    Create a new project with a random unique ID.
    """
    project_id = generate_unique_project_id(db)
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO projects (id, title, description, owner_id, skills_required, is_open)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            project_id,
            project_data.title,
            project_data.description,
            owner_id,
            project_data.skills_required,
            project_data.is_open,
        ),
    )
    db.commit()
    return project_id




def get_project_details(db, project_id: int):
    """
    Fetch project details and its collaborators from the database.
    """
    # Fetch project details
    cursor = db.cursor()
    cursor.execute("""
    SELECT
        p.id AS project_id,
        p.title,
        p.description,
        p.skills_required,
        u.name AS owner_name,
        u.email AS owner_email
    FROM projects p
    JOIN users u ON p.owner_id = u.id
    WHERE p.id = ?
    """, (project_id,))
    project = cursor.fetchone()

    if not project:
        return None

    # Fetch collaborators
    cursor.execute("""
    SELECT
        u.id AS user_id,
        u.name,
        u.email,
        c.role,
        c.status
    FROM collaborations c
    JOIN users u ON c.user_id = u.id
    WHERE c.project_id = ?
    """, (project_id,))
    collaborators = cursor.fetchall()

    return {
        "project": project,
        "collaborators": collaborators
    }


def update_project(db, project_id: int, updates: dict):
    """
    Update the specified project with the given updates.
    """
    query = "UPDATE projects SET "
    params = []
    for key, value in updates.items():
        query += f"{key} = ?, "
        params.append(value)
    query = query.rstrip(", ")  # Remove the trailing comma
    query += " WHERE id = ?"
    params.append(project_id)

    cursor = db.cursor()
    cursor.execute(query, params)
    db.commit()
    return cursor.rowcount


def is_project_owner(db, project_id: int, user_id: int) -> bool:
    """
    Check if the given user is the owner of the specified project.
    """
    cursor = db.cursor()
    cursor.execute("SELECT owner_id FROM projects WHERE id = ?", (project_id,))
    project = cursor.fetchone()
    return project and project["owner_id"] == user_id


def get_ongoing_projects(db, user_id: int):
    """
    Fetch all projects where the user is either the owner or an accepted collaborator.
    """
    cursor = db.cursor()
    cursor.execute("""
    SELECT
        p.id AS project_id,
        p.title,
        p.description,
        p.skills_required,
        u.name AS owner_name,
        u.email AS owner_email
    FROM projects p
    JOIN users u ON p.owner_id = u.id
    WHERE p.owner_id = ? OR p.id IN (
        SELECT c.project_id FROM collaborations c WHERE c.user_id = ? AND c.status = 'accepted'
    )
    """, (user_id, user_id))
    return cursor.fetchall()

def get_ongoing_collaborations(db, user_id: int):
    """
    Fetch all active collaborations where the user is either the owner or collaborator.
    Handles cases where project_id can be a user_id (if < 10000) or a project_id (if >= 10000).
    """
    cursor = db.cursor()
    cursor.execute("""
    SELECT DISTINCT
        c.id AS collaboration_id,
        CASE 
            WHEN c.project_id < 10000 THEN NULL 
            ELSE p.id 
        END AS project_id,
        CASE 
            WHEN c.project_id < 10000 THEN NULL 
            ELSE p.title 
        END AS project_title,
        u.name AS collaborator_name,
        u.email AS collaborator_email,
        c.role,
        po.name AS project_owner_name,
        po.email AS project_owner_email
    FROM collaborations c
    LEFT JOIN projects p ON c.project_id = p.id AND c.project_id >= 10000
    JOIN users u ON c.user_id = u.id
    LEFT JOIN users po ON p.owner_id = po.id
    WHERE (
        (c.project_id < 10000 AND c.project_id = ?) -- Direct user collaboration requests
        OR (p.owner_id = ? AND c.project_id >= 10000) -- Collaborations on owned projects
    )
    AND c.status = 'accepted'
    """, (user_id, user_id))
    
    return cursor.fetchall()


#Collaborations
def create_collaboration_request(db, sender_id: int, target_user_id=None, target_project_id=None):
    """
    Create a new collaboration request.
    """
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO collaborations (user_id, project_id, status)
        VALUES (?, ?, ?)
        """,
        (sender_id, target_project_id or target_user_id, 'pending'),
    )
    db.commit()
    return cursor.lastrowid

def get_incoming_requests(db, user_id: int):
    """
    Fetch incoming collaboration requests for the current user.
    Includes:
    - Requests targeting projects owned by the user.
    - Requests targeting the user directly.
    """
    cursor = db.cursor()
    cursor.execute("""
    SELECT
        c.id AS request_id,
        u.name AS from_user,
        CASE
            WHEN c.project_id IN (SELECT id FROM projects WHERE owner_id = ?) THEN 'project'
            ELSE 'user'
        END AS target_type,
        CASE
            WHEN c.project_id IN (SELECT id FROM projects WHERE owner_id = ?) THEN p.title
            ELSE 'Direct Collaboration'
        END AS target_name,
        c.status
    FROM collaborations c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN projects p ON c.project_id = p.id
    WHERE
        c.project_id IN (SELECT id FROM projects WHERE owner_id = ?)
        OR c.project_id = ?
    """, (user_id, user_id, user_id, user_id))
    rows = cursor.fetchall()

    # Structure the response
    return [
        {
            "request_id": row["request_id"],
            "from_user": row["from_user"],
            "target_type": row["target_type"],  # 'user' or 'project'
            "target_name": row["target_name"],  # User name or project title
            "status": row["status"]
        }
        for row in rows
    ]





def get_outgoing_requests(db, user_id: int):
    """
    Fetch outgoing collaboration requests sent by the current user.
    Includes:
    - Target project titles if the request is for a project.
    - Target user names if the request is for a user.
    """
    cursor = db.cursor()
    cursor.execute("""
    SELECT
        c.id AS request_id,
        CASE
            WHEN p.title IS NOT NULL THEN 'project'
            ELSE 'user'
        END AS target_type,
        CASE
            WHEN p.title IS NOT NULL THEN p.title
            WHEN u.name IS NOT NULL THEN u.name
            ELSE 'Unknown'
        END AS target_name,
        c.status
    FROM collaborations c
    LEFT JOIN projects p ON c.project_id = p.id
    LEFT JOIN users u ON c.project_id = u.id AND p.id IS NULL
    WHERE c.user_id = ?
    """, (user_id,))
    
    rows = cursor.fetchall()
    return [
        {
            "request_id": row["request_id"],
            "target_type": row["target_type"],
            "target_name": row["target_name"],
            "status": row["status"]
        }
        for row in rows
    ]

def update_collaboration_request_status(db, request_id: int, status: str):
    """
    Update the status of a collaboration request.
    """
    cursor = db.cursor()
    cursor.execute("""
    UPDATE collaborations
    SET status = ?
    WHERE id = ?
    """, (status, request_id))
    db.commit()
    return cursor.rowcount  # Returns the number of rows updated

def is_request_target_or_owner(db, request_id: int, user_id: int):
    """
    Check if the current user is the owner or target of the collaboration request.
    """
    cursor = db.cursor()
    cursor.execute("""
    SELECT c.id
    FROM collaborations c
    LEFT JOIN projects p ON c.project_id = p.id
    WHERE c.id = ? AND (p.owner_id = ? OR c.project_id = ?)
    """, (request_id, user_id, user_id))
    return cursor.fetchone() is not None



#Resources 
def create_resource(db, owner_id: int, resource_data):
    """
    Create a new resource in the database.
    """
    cursor = db.cursor()
    cursor.execute("""
    INSERT INTO resources (name, description, resource_type, owner_id)
    VALUES (?, ?, ?, ?)
    """, (resource_data.name, resource_data.description, resource_data.type, owner_id))
    db.commit()
    return cursor.lastrowid


def get_resources(db, resource_type=None, resource_name=None, owner_name=None):
    """
    Fetch resources from the database with optional filters for type, resource name, and owner name.
    """
    query = """
    SELECT
        r.id AS resource_id,
        u.name AS owner_name,
        r.name AS resource_name,
        r.description
    FROM resources r
    LEFT JOIN users u ON r.owner_id = u.id
    """
    params = []


    conditions = []
    if resource_type:
        conditions.append("r.resource_type = ?")
        params.append(resource_type)
    if resource_name:
        conditions.append("r.name LIKE ?")
        params.append(f"%{resource_name}%")
    if owner_name:
        conditions.append("u.name LIKE ?")
        params.append(f"%{owner_name}%")

    if conditions:
        query += "WHERE " + " AND ".join(conditions)

    query += " ORDER BY r.created_at DESC"

    cursor = db.cursor()
    cursor.execute(query, params)
    return cursor.fetchall()



def create_resource_request(db, resource_id: int, requester_id: int):
    """
    Create a new resource access request.
    """
    cursor = db.cursor()

    # Check if the resource exists
    cursor.execute("SELECT owner_id FROM resources WHERE id = ?", (resource_id,))
    resource = cursor.fetchone()
    if not resource:
        raise ValueError("Resource not found")

    # Ensure the requester is not the owner
    if resource["owner_id"] == requester_id:
        raise ValueError("You cannot request access to your own resource")

    # Insert the access request
    cursor.execute("""
    INSERT INTO resource_requests (resource_id, requester_id)
    VALUES (?, ?)
    """, (resource_id, requester_id))
    db.commit()
    return cursor.lastrowid


def get_resource_requests(db, user_id: int, incoming: bool):
    """
    Fetch resource requests for the user.
    - Incoming: Requests for the user's resources.
    - Outgoing: Requests sent by the user.
    """
    query = """
    SELECT
        rr.id AS request_id,
        r.name AS resource_name,
        u.name AS requester_name,
        rr.status
    FROM resource_requests rr
    JOIN resources r ON rr.resource_id = r.id
    JOIN users u ON rr.requester_id = u.id
    """
    if incoming:
        query += "WHERE r.owner_id = ?"
    else:
        query += "WHERE rr.requester_id = ?"

    cursor = db.cursor()
    cursor.execute(query, (user_id,))
    return cursor.fetchall()










#helpers
def is_project_public(db, project_id: int) -> bool:
    """
    Check if the project is public and open for collaboration.
    """
    cursor = db.cursor()
    cursor.execute("SELECT is_open FROM projects WHERE id = ?", (project_id,))
    project = cursor.fetchone()
    return project and project["is_open"] == 1

def is_user_active(db, user_id: int) -> bool:
    """
    Check if the user is active.
    """
    cursor = db.cursor()
    cursor.execute("SELECT is_active FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    return user and user["is_active"] == 1


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

def generate_unique_project_id(db):
    """
    Generate a unique random project ID between 10000 and 500000.
    """
    while True:
        random_id = random.randint(10000, 500000)
        cursor = db.cursor()
        cursor.execute("SELECT 1 FROM projects WHERE id = ?", (random_id,))
        if not cursor.fetchone():
            return random_id