import { useEffect, useState } from "react";
import type { Book } from "./types/Book";
import { fetchBooks } from "./services/fetchBooks";

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const loadBooks = async () => {
            const books = await fetchBooks();
            setBooks(books);
        }
        
        loadBooks();
    }, []);


    useEffect(() => {
        console.log(books);
    }, [books])

    return <div>Books</div>
}