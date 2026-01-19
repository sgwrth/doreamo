import type { Review } from "../types/Review";

export async function fetchReviews(bookId: string): Promise<Review[]> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Review/${bookId}`, {
    method: "GET",
  });
  return await response.json();
};