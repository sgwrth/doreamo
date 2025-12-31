import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import './BookForm.scss';
import type { Book } from '../types/Book';
import postBook from '../services/postBook';

type BookFormProps = {
    books: Book[];
    onUpdateBooks: () => void;
};

export default function BookForm({ books, onUpdateBooks }: BookFormProps) {
    const initialBook: Book = {
        bookName: '',
        price: 0.0,
        category: '',
        author: '',
    };

    const [book, setBook] = useState<Book>(initialBook);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setBook((prevBook) => {
            return { ...prevBook, [event.target.name]: event.target.value };
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await postBook(book);
        onUpdateBooks();
    }

    useEffect(() => {
        console.log(`number of books: ${books.length}`);
    });

    return (
        <>
            <h2>Insert Book:</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="bookName">Book Name</label>
                    <input
                        id="bookName"
                        type="text"
                        name="bookName"
                        onChange={handleChange}
                        value={book.bookName}
                        data-testid="bookName"
                    />
                </div>

                <div>
                    <label htmlFor="price">Price</label>
                    <input
                        id="price"
                        type="text"
                        name="price"
                        onChange={handleChange}
                        value={book.price}
                        data-testid="price"
                    />
                </div>

                <div>
                    <label htmlFor="category">Category</label>
                    <input
                        id="category"
                        type="text"
                        name="category"
                        onChange={handleChange}
                        value={book.category}
                        data-testid="category"
                    />
                </div>

                <div>
                    <label htmlFor="author">Author</label>
                    <input
                        id="author"
                        type="text"
                        name="author"
                        onChange={handleChange}
                        value={book.author}
                        data-testid="author"
                    />
                </div>

                <div>
                    <button type="submit" data-testid="submit">Insert</button>
                </div>
            </form>
        </>
    );
}