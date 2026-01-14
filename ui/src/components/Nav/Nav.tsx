import Menu from "./Menu/Menu.tsx";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (displayMenu) {
      document.body.style.overflow = 'hidden';
    };

    return () => {
      document.body.style.overflow = '';
    };
  }, [displayMenu]);

  return (
    <>
      <button className="menu-button" type="button" onClick={menu}>Menu</button>
      {displayMenu && <Menu onHideNav={menu} />}
    </>
  );
}