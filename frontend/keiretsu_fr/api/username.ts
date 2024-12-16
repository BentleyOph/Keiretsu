"use server";


export async function getUsername() {
  try {
    // this would fetch from fastapi server
    const response = await fetch("http://localhost:8000/test");
    const data = await response.json();
    return { username : data.message, error: null };
  } catch (error) {
    return { username: null, error: "Failed to fetch username" };
  }
}


