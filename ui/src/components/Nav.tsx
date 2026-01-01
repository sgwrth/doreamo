import { Link } from "react-router";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../user/userSlice";

export default function Nav() {
  const dispatch = useAppDispatch();

  function logOut() {
    dispatch(setUser({ username: '', token: '' }));
  };

  return (
    <>
      <div>
        <Link to="/"><button>Home</button></Link>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/books"><button>Books</button></Link>
        <Link to="/counter"><button>Counter</button></Link>
        <button type="button" onClick={logOut}>Log out</button>
      </div>
    </>
  );
}