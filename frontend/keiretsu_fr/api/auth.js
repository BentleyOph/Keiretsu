"use server";

export async function login(username, password) {
    try {
      const response = await fetch(`http:localhost:8000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
  
      // Store the token securely
      localStorage.setItem('Authorization', `Bearer ${data.access_token}`);
  
      console.log(data); // Return the token for immediate use if needed
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  

  // lib/auth.js

export function getAuthToken() {
    return localStorage.getItem('token'); // Retrieve from localStorage
  }
  