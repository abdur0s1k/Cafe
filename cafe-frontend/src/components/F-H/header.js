import { useState, useEffect } from "react";
import "../../styles/main.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
  if (menuOpen) {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".navbar-collapse") &&
        !event.target.closest(".navbar-toggler")
      ) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }
}, [menuOpen]);


  return (
    <section
      data-bs-version="5.1"
      className="menu menu2 cid-uLPOTehxnK"
      once="menu"
      id="menu-5-uLPOTehxnK"
    >
      <nav className="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
        <div className="container">
          <div className="navbar-brand">
            <span className="navbar-logo">
              <a href="/">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMdS7WLLfSsfIh5NKmro-jR3IkkjFdCuiC1g&s"
                  alt=""
                  style={{ height: "4.3rem" }}
                />
              </a>
            </span>
            <span className="navbar-caption-wrap">
              <a className="navbar-caption text-black display-4" href="/">
                Paragraph
              </a>
            </span>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarSupportedContent"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          <div
            className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav nav-dropdown" data-app-modern-menu="true">
                            <li className="nav-item">
                <a
                  className="nav-link link text-black display-4"
                  href="/"
                >
                  Главная
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link link text-black display-4"
                  href="/catalog"
                >
                  Каталог
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link link text-black display-4"
                  href="/aboutus"
                  aria-expanded="false"
                >
                  О нас
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link link text-black display-4" href="/reservation">
                  Бронь
                </a>
              </li>
            </ul>

            <div className="navbar-buttons mbr-section-btn">
              <a className="btn btn-primary display-4" href="/account">
                <i className="fas fa-user"></i>
              </a>
            </div>
            <div className="navbar-buttons mbr-section-btn">
              <a className="btn btn-primary display-4" href="/basket">
                <i className="fas fa-shopping-cart"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
}

export default Header;
