"use server";

import { getToken } from "./getToken";

export async function getCollabs() {
    try {
        const token = await getToken();
        const response = await fetch("http://localhost:8000/collaborations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        });
        const data = await response.json();
        console.log("data from all_collabs.js:", data);
        
        // Ensure we always return an array
        if (!Array.isArray(data)) {
            console.log("Data is not an array, wrapping in array:", data);
            return data.collaborations || [];  // Assuming the data might be wrapped in an object
        }
        return data;
    } catch (error) {
        console.error("Error fetching collaborations:", error);
        return [];
    }
}
