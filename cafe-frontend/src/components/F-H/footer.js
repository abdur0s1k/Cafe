import '../../styles/main.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
function Main() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
  return (
    <section data-bs-version="5.1" className="footer3 cid-uLPOTep7oO" id="footer-3-uLPOTep7oO">
      <div className="container">
        <div className="row">
          <div className="row-links">
            <ul className="header-menu">
              <li className="header-menu-item mbr-fonts-style display-5">
                <a href="/catalog" className="text-white">Меню</a>
              </li>
              <li className="header-menu-item mbr-fonts-style display-5">
                <a href="/reservation" className="text-white">Бронь</a>
              </li>
              <li className="header-menu-item mbr-fonts-style display-5">
                <a href="/#gallery-16-uLPOTenPaI" className="text-white">Галерея</a>
              </li>
              <li className="header-menu-item mbr-fonts-style display-5">
                <a href="/#testimonials-5-uLPOTenS2F" className="text-white">Отзывы</a>
              </li>
            </ul>
          </div>
          <div className="col-12 mt-4">
            <div className="social-row">
<div className="soc-item">
  <a href="https://vk.com/paragraphcoffee" target="_blank" rel="noopener noreferrer">
    <span className="mbr-iconfont socicon socicon-vkontakte display-7"></span>
  </a>
</div>

              <div className="soc-item">
                <a href="https://www.instagram.com/paragraph_coffee/" target="_blank" rel="noopener noreferrer">
                  <span className="mbr-iconfont socicon-instagram socicon"></span>
                </a>
              </div>
              <div className="soc-item">
                <a href="https://www.tiktok.com/@paragraph_coffee" target="_blank" rel="noopener noreferrer">
                  <span className="mbr-iconfont socicon socicon-tiktok"></span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 mt-5">
            <p className="mbr-fonts-style copyright display-7">
              © 2025 Paragraph. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;


