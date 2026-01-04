import { Link } from "react-router";
import isLoggedIn from "../lib/isLoggedIn";
import { setUser } from "../user/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import './Menu.scss';

export default function Menu() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  function logOut() {
    dispatch(setUser({
      username: '',
      token: '',
      roles: [''],
    }));
  };

  return (
    <>
      <Link to="/">
        <button>Home</button>
      </Link>

      {!isLoggedIn(user) &&
        <Link to="/login">
          <button>Login</button>
        </Link>}

      {isLoggedIn(user) &&
        <Link to="/books">
          <button>Books</button>
        </Link>}

      <Link to="/counter">
        <button>Counter</button>
      </Link>

      {isLoggedIn(user) &&
        <Link to="/">
          <button type="button" onClick={logOut}>Log out</button>
        </Link>
      }
    </>
  )
}