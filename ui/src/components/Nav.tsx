import Menu from "./Menu.tsx";
import { useState } from "react";
import './Nav.scss';

export default function Nav() {

  const [displayMenu, setDisplayMenu] = useState(false);

  function menu() {
    if (displayMenu) {
      setDisplayMenu(false);
    } else {
      setDisplayMenu(true);
    }
  }

  return (
    <>
      <div>
        <button className="menu-button" type="button" onClick={menu}>Menu</button>
        {displayMenu && <Menu onHideNav={menu} />}
      </div>
    </>
  );
}