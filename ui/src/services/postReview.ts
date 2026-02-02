import type { PostReview } from "../types/PostReview";

export default async function postReview(review: PostReview) {
  await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookId: review.bookId,
      rating: review.rating,
      text: review.text,
      author: review.author,
    }),
  });
}