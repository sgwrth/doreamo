import { Link } from "react-router";
import isLoggedIn from "../../../lib/isLoggedIn";
import { setUser } from "../../../user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import './Menu.scss';

type MenuProps = {
  onHideNav: () => void,
};

export default function Menu({ onHideNav }: MenuProps) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  function logOut() {
    dispatch(setUser({
      username: '',
      token: '',
      refreshToken: '',
      roles: [''],
    }));
  };

  return (
    <div className="menu-container" onClick={() => onHideNav()}>
      <div className="menu">

        <Link className="nav-link" to="/">
          <button
              onClick={() => onHideNav()}
              className="nav-item-button"
          >
            Home
          </button>
        </Link>

        {!isLoggedIn(user) &&
          <Link className="nav-link" to="/login">
            <button
                onClick={() => onHideNav()}
                className="nav-item-button"
            >
              Login
            </button>
          </Link>}

        {isLoggedIn(user) &&
          <Link className="nav-link" to="/books">
            <button
                onClick={() => onHideNav()}
                className="nav-item-button"
            >
              Books
            </button>
          </Link>}

        {isLoggedIn(user) &&
          <Link className="nav-link" to="/">
            <button
                onClick={() => { onHideNav(); logOut() }}
                className="nav-item-button"
                type="button"
            >
              Log out
            </button>
          </Link>
        }

      </div>
    </div>
  )
}