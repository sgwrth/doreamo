import { useEffect, useState } from "react";
import { fetchBooks } from "../../services/fetchBooks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUser } from "../../user/userSlice";
import BookForm from "../Books/BooksForm/BookForm";
import refreshTokens from "../../services/refreshTokens";
import deleteBook from "../../services/deleteBook";
import type { RefreshedTokens } from "../../types/RefreshedTokens";
import type { Book } from "../../types/Book";
import './Books.scss';
import type { Review } from "../../types/Review";
import { fetchReviews } from "../../services/fetchReviews";

export default function Books() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadBooks = async () => {
    setLoading(true);
    let books = await fetchBooks(user.token);

    if (books !== undefined) {
      setBooks(books);
      setLoading(false);
      return;
    }

    const refreshedTokens: RefreshedTokens = await refreshTokens(user);
    dispatch(setUser({
      username: user.username,
      roles: user.roles,
      token: refreshedTokens.token,
      refreshToken: refreshedTokens.refreshToken,
    }));
    books = await fetchBooks(refreshedTokens.token);

    if (books !== undefined) {
      setBooks(books);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  if (loading) return (
    <div className="cell">
      Loading ...
    </div>
  )

  return (
    <>
      <div className="cell">
        <h2>Books</h2>

        <table>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Author</th>
              <th>Reviews</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <>
                <tr key={book.id}>
                  <td>{book.bookName}</td>
                  <td>{book.price}</td>
                  <td>{book.category}</td>
                  <td>{book.author}</td>
                  <td onClick={async () => setReviews(await fetchReviews(book.id))}>Show</td>
                  <td className="center"><button
                    className="std bold"
                    onClick={async () => {
                      await deleteBook({bookId: book.id}, user.token);
                      await loadBooks()
                    }}
                  >
                    X
                  </button></td>
                </tr>
                {reviews.length > 0 && reviews.some(review => review.bookId === book.id) &&
                  <tr>
                    <td colSpan={6}>
                      {reviews.map(review => (
                        <div>
                          <div>Review by: {review.author} | Rating: {review.rating}</div>
                          <div><em>"{review.text}"</em></div>
                        </div>
                      ))}
                    </td>
                  </tr>}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <BookForm onUpdateBooks={loadBooks} />
    </>
  );
}