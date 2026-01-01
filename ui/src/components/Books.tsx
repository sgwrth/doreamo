import { useEffect, useState } from "react";
import type { Book } from "../types/Book";
import { fetchBooks } from "../services/fetchBooks";
import './Books.scss';
import BookForm from "./BookForm";
import { useAppSelector } from "../store/hooks";

export default function Books() {
  const user = useAppSelector((state) => state.user);

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    const books = await fetchBooks(user.token);
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
      <h2>Books</h2>

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
  );
}