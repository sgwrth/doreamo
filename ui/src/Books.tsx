import { useEffect, useState } from "react";

export default function Books() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/books`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(books => setBooks(books))
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        console.log(books);
    }, [books])

    return <div>Books</div>
}