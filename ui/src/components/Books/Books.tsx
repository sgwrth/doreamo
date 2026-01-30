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
import fetchReviewNumbers from "../../services/fetchReviewNumbers";
import type { ReviewNumber } from "../../types/ReviewNumber";

export default function Books() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isShowReviews, setIsShowReviews] = useState<boolean>(false);
  const [isShowCreateReview, setIsShowCreateReview] = useState<boolean>(false);
  const [bookIdToReview, setBookIdToReview] = useState<string | null>(null);
  const [reviewNumbers, setReviewNumbers] = useState<ReviewNumber>();
  const [deletingBook, setDeletingBook] = useState<string | null>(null);
  const [fetchingReviews, setFetchingReviews] = useState<string | null>(null);

  const loadReviewNumbers = async () => {
    const reviewNumbers = await fetchReviewNumbers();
    console.log(reviewNumbers);
    setReviewNumbers(reviewNumbers);
  };

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

  function toggleShowReviews() {
    setIsShowReviews((isShowReviews) ? false : true);
    if (reviews.length !== 0) {
      setReviews([]);
    }
  }

  const handleDeleteBook = async (book: Book) => {
    setDeletingBook(book.id);
    await deleteBook({bookId: book.id}, user.token);
    await loadBooks();
    setDeletingBook(null);
  }

  function deleteBookTd(book: Book) {
    return (
      <td className="center">
        <button
            className="std bold mouse"
            onClick={() => handleDeleteBook(book)}
        >
          X
        </button>
      </td>
    );
  }

  const handleToggleReviews = async (book: Book) => {
    setFetchingReviews(book.id);
    setReviews(await fetchReviews(book.id));
    toggleShowReviews();
    setFetchingReviews(null);
  }

  function showHideReviews(reviews: Review[], book: Book) {
    return (
      isShowReviews && reviews?.some(review => review.bookId === book.id)
        ? <span className="mouse">Hide</span>
        : <span>
            {reviewNumbers && reviewNumbers[book.id]
              ? <span className="mouse">Show ({reviewNumbers[book.id]})</span>
              : <span onClick={() => toggleShowCreateReviewRow(book.id)}>
                  {(isShowCreateReview && bookIdToReview === book.id) ? "Close" : "Write"}
                </span>}
          </span>
      )
  }

  function toggleShowCreateReviewRow(bookId: string) {
    setBookIdToReview((bookIdToReview) ? null : bookId);
    setIsShowCreateReview((isShowCreateReview) ? false : true);
  }

  function reviewsContent(book: Book, reviews: Review[]) {
    return (
      <tr key={`reviews-${book.id}`}>
        <td colSpan={6}>
          {reviews.map(review => (
            <div key={review.id}>
              <div>Review by: {review.author} | Rating: {review.rating}</div>
              <div className="mb-1"><em>"{review.text}"</em></div>
            </div>
          ))}
        </td>
      </tr>
    )
  }

  useEffect(() =>{
    loadBooks();
    loadReviewNumbers();
  }, []);

  if (loading) return (
    <div className="cell">
      Loading ...
    </div>
  )

  function bookRows(book: Book) {
    return (
      <tr>
        <td>{book.bookName}</td>
        <td>{book.price}</td>
        <td>{book.category}</td>
        <td>{book.author}</td>
        <td onClick={() => handleToggleReviews(book)}>
          {showHideReviews(reviews, book)}
        </td>
        {deleteBookTd(book)}
      </tr>
    );
  }

  function reviewsRow(book: Book, reviews: Review[]) {
    return (
      <>
        {reviews.length > 0
          && reviews.some(review => review.bookId === book.id)
          && isShowReviews
          && reviewsContent(book, reviews)}
        {reviews.length === 0
          && isShowCreateReview
          && book.id === bookIdToReview
          && createReviewRow()}
      </>
    );
  }

  function createReviewRow() {
    return (
      <>
        <tr>
          <td colSpan={6}>
            Hi there!
          </td>
        </tr>
      </>
    )
  }

  function booksAndReviews(books: Book[], reviews: Review[]) {
    return (
      <>
        {books.map((book) => (
          <>
            {bookRows(book)}
            {reviewsRow(book, reviews)}
          </>
        ))}
      </>
    )
  }

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
            {booksAndReviews(books, reviews)}
          </tbody>
        </table>
      </div>

      <BookForm onUpdateBooks={loadBooks} />
    </>
  );
}