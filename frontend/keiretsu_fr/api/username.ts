"use server";
import { getToken } from './getToken';


export async function getUsername() {
  try {
    const token = await getToken();

    const response = await fetch("http://localhost:8000/me", {
      headers: {
        'Authorization': `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    console.log('Data from getUsername:', data);
    return { username : data.name, error: null }
  } catch (error) {
    console.error('Error fetching user:', error);
    return { user: null, error: "Failed to fetch user data" };
  }
}


