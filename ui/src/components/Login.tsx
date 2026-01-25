import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Credentials } from "../types/Credentials";
import logIn from "../services/logIn";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser } from '../user/userSlice';
import type { LoginResponse } from "../types/LoginResponse";
import isLoggedIn from "../lib/isLoggedIn";
import refreshTokens from "../services/refreshTokens";

export default function Login() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const initialCredentials: Credentials = {
    username: '',
    password: '',
  };

  const [credentials, setCredentials] = useState<Credentials>(initialCredentials);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const LoginResponse: LoginResponse = await logIn(credentials);
    dispatch(setUser({
      username: credentials.username,
      token: LoginResponse.token,
      roles: LoginResponse.roles,
      refreshToken: LoginResponse.refreshToken,
    }));
    console.log(user);
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setCredentials((prevCredentials) => {
      return { ...prevCredentials,  [event.target.name]: event.target.value };
    });
  };

  return (
    <div className="cell">
      <h2>Login</h2>

      {!isLoggedIn(user) && 
        <form onSubmit={handleLogin}>

          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" onChange={handleChange} />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" onChange={handleChange} />

          <div>
            <button className="std" type="submit">Log in</button>
          </div>

        </form>}

      {isLoggedIn(user) &&
        <div>
          <div>You are logged in!</div>
        </div>}
    </div>
  );
}