import type { Book } from "../types/Book";

export async function fetchBooks(token: string): Promise<Book[]> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/books`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  return await response.json();
}