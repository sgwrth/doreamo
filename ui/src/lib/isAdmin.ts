import { Role } from "../types/Role";
import type { User } from "../types/User";

export default function isAdmin(user: User) {
  return (user.roles.includes(Role.ADMIN)) ? true : false;
}