import './footer.css';

function Main() {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-logo">Viva Cup</div>
        <div className="footer-links">
          <a href="/about" className="footer-link">О нас</a>
          <a href="/contact" className="footer-link">Контакты</a>
          <a href="/privacy" className="footer-link">Политика конфиденциальности</a>
        </div>
        <div className="footer-social">
          <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
            <img src="/SocialMediaSVG/Color/facebook.svg" alt="Facebook" />
          </a>
          <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
            <img src="/SocialMediaSVG/Color/instagram.svg" alt="Instagram" />
          </a>
          <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
            <img src="/SocialMediaSVG/Color/twitter.svg" alt="Twitter" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Viva Cup. Все права защищены.</p>
      </div>
    </div>
  );
}

export default Main;
