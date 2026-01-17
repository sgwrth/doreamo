import type { DeleteBook } from "../types/DeleteBook";

export default async function deleteBook(deleteBook: DeleteBook, token: string) {
  console.log("delete");
  await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/books`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      bookId: deleteBook.bookId,
    }),
  });
};