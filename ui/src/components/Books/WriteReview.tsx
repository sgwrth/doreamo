import { useState, type ChangeEvent, type FormEvent } from "react";
import type { PostReview } from "../../types/PostReview"

export default function WriteReview() {
  const initialReview: PostReview = {
    bookId: "",
    rating: 5,
    text: "",
    author: "",
  };

  const [review, setReview] = useState<PostReview>(initialReview);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setReview((prevReview) => {
      return { ...prevReview, [event.target.name]: event.target.value };
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(review);
  };

  return (
    <tr>
      <td colSpan={6}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="block"
            type="text"
            name="author"
            onChange={handleChange}
            value={review.author}
          ></input>
          <label htmlFor="rating">Rating</label>
          <select
              id="rating"
              className="block"
              name="rating"
              onChange={handleChange}
              value={review.rating}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            className="review block"
            name="text"
            onChange={handleChange}
            value={review.text}
            rows={5}
            cols={30}
          ></textarea>
          <button className="std mouse">Send</button>
        </form>
      </td>
    </tr>
  )
}
