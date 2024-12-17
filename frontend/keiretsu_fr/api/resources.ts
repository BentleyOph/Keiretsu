"use server";


import { getToken } from "./getToken";

export async function createResource(data: {
    name: string;
    type: string;
    description: string;
}) {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/resources', {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to create resource');
        }

        return response.json();
    } catch (error) {
        console.error('Error creating resource:', error);
        throw error;
    }
}

export async function requestResource(resourceId) {
    const token = await getToken();
    try {
        console.log('requesting resource with id:', resourceId);
        const response = await fetch('http://localhost:8000/resource-requests', {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resource_id: resourceId }),
        });

        const data = await response.json();
        console.log(JSON.stringify({ resource_id: resourceId }));
        console.log('response from requesting resource', response);
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to request resource');
        }
        
        return data;
    } catch (error) {
        console.error('Error requesting resource:', error);
        throw error;
    }
}


export async function getResources() {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/resources', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch resources');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw error;
    }
}

export async function getOwnedResources() {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/resources/owned', {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch owned resources');
        return response.json();
    } catch (error) {
        console.error('Error fetching owned resources:', error);
        throw error;
    }
}

export async function getSharedResources() {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/resources/shared', {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch shared resources');
        return response.json();
    } catch (error) {
        console.error('Error fetching shared resources:', error);
        throw error;
    }
}

export async function getIncomingRequests() {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/resources/incoming', {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch incoming requests');
        return response.json();
    } catch (error) {
        console.error('Error fetching incoming requests:', error);
        throw error;
    }
}

export async function getOutgoingRequests() {
    const token = await getToken();
    try {
        const response = await fetch('http://localhost:8000/resources/outgoing', {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch outgoing requests');
        return response.json();
    } catch (error) {
        console.error('Error fetching outgoing requests:', error);
        throw error;
    }
}

export async function updateResourceRequest(requestId: number, status: 'accepted' | 'rejected') {
    const token = await getToken();
    try {
        const response = await fetch(`http://localhost:8000/resource-requests/${requestId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update request');
        return response.json();
    } catch (error) {
        console.error('Error updating request:', error);
        throw error;
    }
}
