"use server";

import { getToken } from "./getToken";

export async function searchUsers(params: {
    skills?: string;
    location?: string;
    availability?: string;
}) {
    const token = await getToken();
    const queryParams = new URLSearchParams();
    
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.location) queryParams.append('location', params.location);
    if (params.availability) queryParams.append('availability', params.availability);

    try {
        const response = await fetch(`http://localhost:8000/users?${queryParams.toString()}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function sendCollaborationRequest(userId: string) {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/collaboration-requests', {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_user_id: userId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send collaboration request');
        }

        return response.json();
    } catch (error) {
        console.error('Error sending collaboration request:', error);
        throw error;
    }
}

export async function getUserDetails(userId: string) {
    const token = await getToken();
    try {
        const response = await fetch(`http://localhost:8000/user/${userId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
}
