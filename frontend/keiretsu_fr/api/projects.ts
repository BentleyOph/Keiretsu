"use server";
import { getToken } from "./getToken";

export async function getProjects(params: {
    title?: string;
    skills?: string;
    owner?: string;
}) {
    const token = await getToken();
    const queryParams = new URLSearchParams();
    
    if (params.title) queryParams.append('title', params.title);
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.owner) queryParams.append('owner', params.owner);

    try {
        const response = await fetch(`http://localhost:8000/projects?${queryParams}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

export async function getProjectDetails(projectId: number) {
    const token = await getToken();
    try {
        const response = await fetch(`http://localhost:8000/projects/${projectId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch project details');
        return response.json();
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
}

export async function sendProjectCollaborationRequest(projectId: number) {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/collaboration-requests', {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_project_id: projectId
            })
        });
        if (!response.ok) throw new Error('Failed to send collaboration request');
        return response.json();
    } catch (error) {
        console.error('Error sending collaboration request:', error);
        throw error;
    }
}

export async function createProject(data: {
    title: string;
    description: string;
    skills_required?: string;
    is_open?: boolean;
}) {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/projects', {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}
