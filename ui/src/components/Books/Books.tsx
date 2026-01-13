import { useEffect, useState } from "react";
import { fetchBooks } from "../../services/fetchBooks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUser } from "../../user/userSlice";
import BookForm from "../Books/BooksForm/BookForm";
import refreshTokens from "../../services/refreshTokens";
import type { RefreshedTokens } from "../../types/RefreshedTokens";
import type { Book } from "../../types/Book";
import './Books.scss';

export default function Books() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    const books = await fetchBooks(user.token);
    if (books !== undefined) {
      setBooks(books);
      setLoading(false);
    } else {
      const refreshedTokens: RefreshedTokens = await refreshTokens(user);
      dispatch(setUser({
        username: user.username,
        roles: user.roles,
        token: refreshedTokens.token,
        refreshToken: refreshedTokens.refreshToken,
      }));
      const books = await fetchBooks(refreshedTokens.token);
      if (books !== undefined) {
        setBooks(books);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  if (loading) return <div>Loading ...</div>

  return (
    <div className="body-main">
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
      <BookForm onUpdateBooks={loadBooks} />
    </div>
  );
}