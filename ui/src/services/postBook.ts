import type { Book } from "../types/Book";

export default async function postBook(book: Book): Promise<void> {
    await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book),
    });
}