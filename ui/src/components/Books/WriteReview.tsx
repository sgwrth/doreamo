export default function WriteReview() {
  return (
    <tr>
      <td colSpan={6}>
        <form>
          <label htmlFor="name">Name</label>
          <input id="name" className="block" type="text"></input>
          <label htmlFor="rating">Rating</label>
          <select id="rating" className="block">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
          <label htmlFor="review">Review</label>
          <input id="review" className="review block" type="text"></input>
          <button className="std mouse">Send</button>
        </form>
      </td>
    </tr>
  )
}
