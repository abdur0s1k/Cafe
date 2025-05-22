import { useState, useEffect } from "react";
import "./header.css";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      const handleClickOutside = (event) => {
        if (!event.target.closest(".mobile-menu") && !event.target.closest(".burger-menu")) {
          closeMenu();
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <div className="header">
      <Link to="/"  className="logo">
        <h1>Viva Cup</h1>
      </Link>

      <div className="header_buttons">
        <Link to="/" className="header-button">
          Главная
        </Link>
        <Link to="/catalog" className="header-button">
          Каталог
        </Link>
        <Link to="/aboutus" className="header-button">
          О нас
        </Link>
        <Link to="/account" className="header-button">
          Аккаунт
        </Link>
        <Link to="/basket" className="header-button">
        <img src="/CoffeIconsSVG/basket.svg" alt="корзина" />
        </Link>
      </div>

      <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
        <img
          className="burger-menu__icon"
          src="/UserInterfaceSVG/align-justify-editor.svg"
          alt="Открыть меню"
        />
      </div>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <div className="close">
          <img
            className="burger-menu__icon"
            src="/UserInterfaceSVG/x-close-delete.svg"
            alt="Закрыть меню"
            onClick={closeMenu}
          />
        </div>
        <div className="header_buttons">
          <Link to="/" className="header-button" onClick={closeMenu}>
            Главная
          </Link>
          <Link to="/catalog" className="header-button" onClick={closeMenu}>
            Каталог
          </Link>
          <Link to="/aboutus" className="header-button" onClick={closeMenu}>
            О нас
          </Link>
          <Link to="/account" className="header-button" onClick={closeMenu}>
            Аккаунт
          </Link>
          <Link to="/basket" className="header-button" onClick={closeMenu}>
          Корзина
        </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
