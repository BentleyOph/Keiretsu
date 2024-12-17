"use server";

export async function registerUser(data: {
    email: string;
    password: string;
    name: string;
    type: string;
    location: string;
    skills: string;
    availability: string;
    bio: string;
}) {
    try {
        const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }

        return response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}


