"use server";

export async function getCollabs() {
    const collabs = await fetch("http://localhost:8000/collaborations");
    const data  = await collabs.json();
    return {
        name : data.collaborator.name,
        email : data.collaborator.email,
        role : data.collaborator.role,
    }
}