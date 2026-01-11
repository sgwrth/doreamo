import { Link } from "react-router";
import isLoggedIn from "../lib/isLoggedIn";
import { setUser } from "../user/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import './Menu.scss';

type MenuProps = {
  // displayMenu: boolean,
  onHideNav: () => void,
};

export default function Menu({ onHideNav }: MenuProps) {
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
      <div className="menu-container">
        <Link className="nav-a" to="/">
          <button onClick={() => onHideNav()} className="nav-item-button">Home</button>
        </Link>

        {!isLoggedIn(user) &&
          <Link className="nav-a" to="/login">
            <button onClick={() => onHideNav()} className="nav-item-button">Login</button>
          </Link>}

        {isLoggedIn(user) &&
          <Link className="nav-a" to="/books">
            <button onClick={() => onHideNav()} className="nav-item-button">Books</button>
          </Link>}

        <Link className="nav-a" to="/counter">
          <button onClick={() => onHideNav()} className="nav-item-button">Counter</button>
        </Link>

        {isLoggedIn(user) &&
          <Link className="nav-a" to="/">
            <button onClick={() => { onHideNav(); logOut}} className="nav-item-button" type="button">Log out</button>
          </Link>
        }
      </div>
    </>
  )
}