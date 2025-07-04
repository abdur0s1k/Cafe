import React, { useState, useEffect } from "react";
import "./basket.css";
import '../../styles/main.css';

const visaIconUrl =
  "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png";
const mastercardIconUrl =
  "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";

const Basket = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(
    "ул. Карла Маркса 9, Минск, Минская область 220036, Беларусь"
  );
  const [paymentMethod, setPaymentMethod] = useState("pickup");
  const [selectedCard, setSelectedCard] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        console.error("User data не найден в localStorage");
        setCart([]);
        return;
      }

      let userId;
      try {
        const userObj = JSON.parse(userJson);
        userId = userObj.userId;
      } catch (error) {
        console.error("Ошибка парсинга user", error);
        setCart([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5189/api/cart?userId=${userId}`
        );
        if (!response.ok) throw new Error("Ошибка загрузки корзины");
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error(error);
      }
            finally {
  setLoading(false);
}
    };

    fetchCart();
  }, []);

  const detectCardType = (number) => {
    const cleaned = number.replace(/\D/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]|720))/.test(cleaned))
      return "mastercard";
    return "unknown";
  };

  useEffect(() => {
    const type = detectCardType(cardNumber);
    if (type !== "unknown") {
      setSelectedCard(type);
    }
  }, [cardNumber]);

  const totalPrice = cart.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Корзина пуста.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        alert("Пожалуйста, заполните все данные карты.");
        return;
      }
      if (cardNumber.length < 12 || cardCvv.length < 3) {
        alert("Неверные данные карты.");
        return;
      }
    }

    let userId;
    try {
      const userObj = JSON.parse(localStorage.getItem("user"));
      userId = userObj.userId;
    } catch {
      alert("Пользователь не авторизован");
      return;
    }

    const orderDescription = cart
      .map(
        (item) =>
          `${item.name} ${item.weight}${
            item.category === "Coffee" ? "мл" : "гр"
          } - ${item.quantity} шт`
      )
      .join(", ");

    const orderData = {
      userId: userId,
      pickupAddress: selectedAddress,
      paymentMethod: paymentMethod,
      orderDescription: orderDescription,
      totalPrice: Number(totalPrice.toFixed(2)),
      status: "В обработке",
      CardNumber: paymentMethod === "pickup" ? "" : cardNumber,
      CardExpiry: paymentMethod === "pickup" ? "" : cardExpiry,
      CardCvv: paymentMethod === "pickup" ? "" : cardCvv,
    };

    try {
      // Создаём заказ
      const response = await fetch("http://localhost:5189/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ошибка от сервера:", errorText);
        throw new Error("Ошибка оформления заказа");
      }

      // Если заказ создан успешно — очищаем корзину на сервере
      const deleteResponse = await fetch(
        `http://localhost:5189/api/cart/clear?userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!deleteResponse.ok) {
        throw new Error("Ошибка очистки корзины на сервере");
      }

      // Очищаем корзину в UI
      setCart([]);

      alert("Заказ успешно оформлен!");
    } catch (error) {
      console.error(error);
      alert("Не удалось оформить заказ. Попробуйте позже.");
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5189/api/cart/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Ошибка удаления товара из корзины");
      setCart(cart.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const increaseQuantity = async (id) => {
    try {
      const item = cart.find((i) => i.id === id);
      if (!item) return;
      const newQuantity = item.quantity + 1;

      const response = await fetch(`http://localhost:5189/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) throw new Error("Ошибка обновления количества");

      setCart(
        cart.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      const item = cart.find((i) => i.id === id);
      if (!item) return;
      const newQuantity = Math.max(1, item.quantity - 1);

      const response = await fetch(`http://localhost:5189/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) throw new Error("Ошибка обновления количества");

      setCart(
        cart.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
      );
    } catch (error) {
      console.error(error);
    }
    
  };
    if (loading)  return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Загрузка...</div>
      </div>
    );

  return (
    <div className="basket-container">
      <h2 className="basket-title">Корзина ({cart.length} товаров)</h2>
      {cart.length === 0 ? (
        <p className="empty-basket">Корзина пуста</p>
      ) : (
        <div className="basket-container-list">
          <ul className="basket-list">
            {cart.map((item) => (
              <li key={item.id} className="basket-item">
                <img
                  className="basket-item-img"
                  src={`http://localhost:5189${item.img}`}
                  alt={item.name}
                />

                <div className="basket-item-info">
                  <p className="basket-item-name">{item.name}</p>
                  <p className="rating">
                    {item.weight} {item.category === "Coffee" ? "мл." : "гр."}
                  </p>
                  <p className="basket-item-price">{item.price} BYN</p>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="basket-total">
            <p>
              Итого:{" "}
              <span className="total-price">{totalPrice.toFixed(2)} BYN</span>
            </p>

            <div className="basket-total_pick-upPoint">
              <label>Точка самовывоза:</label>
              <select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <option value="ул. Карла Маркса 9, Минск, Минская область 220036, Беларусь">
                  ул. Карла Маркса 9, Минск, Минская область 220036, Беларусь
                </option>
              </select>
            </div>
<div className="basket-total_payment">
  <label>Способ оплаты:</label>
  <div className="custom-payment-methods">
    <div
      className={`custom-method ${paymentMethod === "pickup" ? "selected" : ""}`}
      onClick={() => setPaymentMethod("pickup")}
    >
      <i className="fas fa-hand-holding-usd"></i>
      <span>При получении</span>
    </div>
    <div
      className={`custom-method ${paymentMethod === "card" ? "selected" : ""}`}
      onClick={() => setPaymentMethod("card")}
    >
      <i className="fas fa-credit-card"></i>
      <span>Картой онлайн</span>
    </div>
  </div>





{paymentMethod === "card" && (
  <>
  
    <div className="card-inputs">
      <div className="card-brand">
        {selectedCard === "visa" && (
          <img src={visaIconUrl} alt="Visa" className="card-logo" />
        )}
        {selectedCard === "mastercard" && (
          <img
            src={mastercardIconUrl}
            alt="Mastercard"
            className="card-logo"
          />
        )}
      </div>
      <div className="card-container">
        <div className="card-main card-inputs">
      <input
        type="text"
        placeholder="Номер карты"
        value={cardNumber}
        onChange={(e) => {
          const input = e.target.value.replace(/\D/g, ""); // Удаляем нецифры
          const formatted = input.match(/.{1,4}/g)?.join(" ") ?? input; // По 4 символа
          setCardNumber(formatted);
        }}
        maxLength={19} // 16 цифр + 3 пробела
        className="card-input"
      />
      
<div className="card-inputs_holder">
        <input
        type="text"
        placeholder=""
        value={cardHolder}
        onChange={(e) => {
          const input = e
            .target.value.toUpperCase()
            .replace(/[^A-Z\s]/g, ""); // Только латинские и пробел
          setCardHolder(input);
        }}
        className="card-input"
      />
      <input
        type="text"
        placeholder="Срок действия (MM/YY)"
        value={cardExpiry}
        onChange={(e) => {
          const input = e.target.value.replace(/\D/g, ""); // Удаляем нецифры
          let formatted = input;

          if (input.length >= 3) {
            formatted = input.slice(0, 2) + "/" + input.slice(2, 4); // Вставляем слэш
          }

          setCardExpiry(formatted);
        }}
        maxLength={5} // MM/YY
        className="card-input"
      />
    </div>    </div>
    
        <div className="card-cvv card-inputs">
      <input
        type="password"
        placeholder="CVV"
        value={cardCvv}
        onChange={(e) => setCardCvv(e.target.value)}
        maxLength={3}
        className="cvv-input"
      />
    </div></div></div>
  </>
)}


            </div>
            <button className="order-button" onClick={handleCheckout}>
              Заказать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Basket;
