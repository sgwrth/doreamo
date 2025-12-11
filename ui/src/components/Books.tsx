import { useEffect, useState } from "react";
import type { Book } from "../types/Book";
import { fetchBooks } from "../services/fetchBooks";

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            const books = await fetchBooks();
            setBooks(books);
            setLoading(false);
        }
        
        loadBooks();
    }, []);

    useEffect(() => {
        console.log(books);
    }, [books])

    if (loading) return <div>Loading ...</div>

    return (
        <div>
            {books.map(book => (
                <div key={book.id}>{book.bookName}</div>
            ))}
        </div>
    )
}