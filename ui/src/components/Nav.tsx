import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser } from "../user/userSlice";
import isLoggedIn from "../lib/isLoggedIn.ts";
import Menu from "./Menu.tsx";
import { useState } from "react";

export default function Nav() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [displayMenu, setDisplayMenu] = useState(false);

  function menu() {
    if (displayMenu) {
      setDisplayMenu(false);
    } else {
      setDisplayMenu(true);
    }
  }

  function logOut() {
    dispatch(setUser({
      username: '',
      token: '',
      roles: [''],
    }));
  };

  return (
    <>
      <div>
        <button type="button" onClick={menu}>&#9776;</button>
        {displayMenu && <Menu />}

        {/* <Link to="/">
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
        } */}
      </div>
    </>
  );
}