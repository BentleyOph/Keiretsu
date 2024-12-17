"use server";
import { getToken } from "./getToken";

export async function getIncomingCollabRequests() {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/collab-requests/incoming', {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch incoming collaboration requests');
        return response.json();
    } catch (error) {
        console.error('Error fetching incoming collaboration requests:', error);
        throw error;
    }
}

export async function getOutgoingCollabRequests() {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/collab-requests/outgoing', {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch outgoing collaboration requests');
        return response.json();
    } catch (error) {
        console.error('Error fetching outgoing collaboration requests:', error);
        throw error;
    }
}

export async function updateCollabRequest(requestId: number, status: 'accepted' | 'declined') {
    const token = await getToken();
    try {
        const response = await fetch(`http://localhost:8000/collaboration-requests/${requestId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update collaboration request');
        return response.json();
    } catch (error) {
        console.error('Error updating collaboration request:', error);
        throw error;
    }
}
