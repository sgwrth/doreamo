import type { User } from "../types/User";

export default function isLoggedIn(user: User) {
  return (user.token !== '') ? true : false;
};