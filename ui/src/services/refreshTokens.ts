import type { RefreshedTokens } from "../types/RefreshedTokens";
import type { User } from "../types/User";

export default async function refreshTokens(user: User): Promise<RefreshedTokens> {
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
  const data = await response.json();
  const tokens: RefreshedTokens = {
    token: data.token,
    refreshToken: data.refreshToken,
  }
  return tokens;
}