import { useState, useEffect, useRef } from "react";
import "./catalog.css";
import '../../styles/main.css';

function Catalog() {
  const [userId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [notification, setNotification] = useState(null);
  const notificationTimeoutRef = useRef(null);  // <-- для хранения таймера

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserId(user.userId);
    } else {
      console.log("Пользователь не найден");
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5189/api/products");
        const data = await response.json();
        setProducts(data);
        setActiveCategory(data[0]?.category);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
  if (!userId) {
    alert("Пользователь не авторизован");
    return;
  }

  try {
    const response = await fetch("http://localhost:5189/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        productId: productId,
        quantity: 1,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при добавлении товара в корзину");
    }

    const result = await response.json();

    const addedProduct = products.find((p) => p.id === productId);
    if (addedProduct) {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }

      // Добавляем уникальный id (например, timestamp)
      setNotification({
        id: Date.now(),
        name: addedProduct.name,
        quantity: 1,
      });

      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(null);
        notificationTimeoutRef.current = null;
      }, 5000);
    }
  } catch (error) {
    console.error(error);
  }
};

    if (!products.length) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  const categories = Array.from(new Set(products.map((product) => product.category)));

  return (
    <div className="catalog">
      <h1>Каталог</h1>
      <div className="category-menu">
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="category-content">
        {products
          .filter((product) => product.category === activeCategory)
          .map((product) => (
<div key={product.id} className="product-image-wrapper">
  <img
    src={`http://localhost:5189${product.imageUrl}`}
    alt={product.name}
    className="product-image"
  />
  <div className="overlay-info">
    <h3>{product.name}</h3>
    <p>{product.description}</p>
    <p>
      {product.weight} {product.category === "Coffee" ? "мл." : "гр."}
    </p>
    <p className="price">{parseFloat(product.price).toFixed(2)} BYN</p>
    <button
      onClick={() => handleAddToCart(product.id)}
      className="add-to-cart-btn"
    >
      В корзину
    </button>
  </div>
</div>
          ))}
      </div>

      {notification && (
        <div key={notification.id} className="notification">
          ✅ Добавлен: <strong>{notification.name}</strong> (x{notification.quantity})
        </div>
      )}
    </div>
  );
}

export default Catalog;