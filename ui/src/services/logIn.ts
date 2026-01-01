import type { Credentials } from "../types/Credentials";

export default async function logIn(credentials: Credentials) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
        })
    });
    return await response.json();
};