export default async function fetchReviewNumbers() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Review/numbers`, {
    method: "GET",
  });
  return await response.json();
}