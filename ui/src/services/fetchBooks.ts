import type { Book } from "../types/Book";

export async function fetchBooks(): Promise<Book[]> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/books`, {
        method: 'GET'
    });
    return await response.json();
}