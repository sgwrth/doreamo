import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Credentials } from "../types/Credentials";
import logIn from "../services/logIn";

export default function Login() {
  const initialCredentials: Credentials = {
    username: '',
    password: '',
  };

  const [credentials, setCredentials] = useState<Credentials>(initialCredentials);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await logIn(credentials);
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setCredentials((prevCredentials) => {
      return { ...prevCredentials,  [event.target.name]: event.target.value };
    });
  };

  return (
    <>
      <div>Login</div>
      
      <form onSubmit={handleLogin}>

        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" onChange={handleChange} />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" onChange={handleChange} />

        <button type="submit">Log in</button>

      </form>
    </>
  );
}