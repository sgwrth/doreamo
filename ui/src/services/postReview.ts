import type { PostReview } from "../types/PostReview";

export default async function postReview(review: PostReview) {
  const response = await fetch(`${import.meta.env.VITE_BACK_END_BASE_URL}/api/review`, {
    method: "POST",
    body: JSON.stringify({
      bookId: review.bookId,
      rating: review.rating,
      text: review.text,
      author: review.author,
    }),
  });
  console.log(await response.json());
}