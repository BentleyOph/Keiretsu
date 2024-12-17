"use server";
import { cookies } from "next/headers";

export async function login(email, password) {
	try {
		const response = await fetch("http://localhost:8000/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new Error("Login failed");
		}
		const data = await response.json();

		const cookiesInstance = await cookies();
		cookiesInstance.set("Authorization", `Bearer ${data.access_token}`, {
			httpOnly: false, // Prevent JavaScript access to the cookie
			secure: false, // Ensure cookie is only sent over HTTPS
			sameSite: "strict", // Protect against CSRF
		});
		const authCookie = cookiesInstance.get("Authorization");
		console.log("Cookie set:", authCookie);
        console.log("data from login.js:", data);


        return {data : data , message: "Login successful"};
	} catch (error) {
		console.error("Login error:", error);
		throw error;
	}
}

export async function logout() {
    const cookiesInstance = cookies();
    cookiesInstance.delete("Authorization");
}
