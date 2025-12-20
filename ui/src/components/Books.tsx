import { useEffect, useState } from "react";
import type { Book } from "../types/Book";
import { fetchBooks } from "../services/fetchBooks";
import './Books.scss';
import BookForm from "./BookForm";
import { Counter } from "./Counter";

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const loadBooks = async () => {
        setLoading(true);
        const books = await fetchBooks();
        setBooks(books);
        setLoading(false);
    }

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        console.log(`les books: ${books}`);
    }, [books])

    if (loading) return <div>Loading ...</div>

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Book Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td>{book.bookName}</td>
                            <td>{book.price}</td>
                            <td>{book.category}</td>
                            <td>{book.author}</td>
                        </tr>
                    ))}
            </tbody>
            </table>
            <BookForm books={books} onUpdateBooks={loadBooks} />
        </>
    )
}