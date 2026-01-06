import type { User } from "../types/User";

export default async function refreshTokens(user: User): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Auth/refreshtokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: user.username,
      refreshToken: user.refreshToken,
    }),
  });
  console.log(await response.json());
}