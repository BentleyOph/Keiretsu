# Keiretsu - Open Innovation Platform

Keiretsu is a full-stack application that facilitates collaboration between professionals, companies, and freelancers.


## Features

- User Authentication & Profile Management
- Project Creation and Management
- Resource Sharing System
- Real-time Collaboration
- Skills-based Matching
- Advanced Search & Filtering

## Tech Stack

### Backend
- FastAPI
- SQLite
- JWT Authentication
- Python 3.8+

### Frontend
- Next.js 15 
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- Motion/React for Animations

## Getting Started

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

##run backend in project root 
fastapi dev main.py

will start backend in http://localhost:8000

cd frontend/keiretsu_fr
npm install
npm run dev

The frontend will be available at http://localhost:3000 .Visit that 
