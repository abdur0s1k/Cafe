import React, { useState, useEffect } from "react";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      const userData = localStorage.getItem("user"); // ключ 'user' — проверь у себя, как точно называется
      const user = userData ? JSON.parse(userData) : null;
      const userId = user ? user.userId || user.id : null;

      if (!userId) {
        setError("User ID не задан");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5189/api/orders/${userId}`
        );
        if (!response.ok) throw new Error("Ошибка при загрузке заказов");

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading)  return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  if (error)
    return (
      <div className="order-history-wrapper">
        <p style={{ color: "red" }}>Ошибка: {error}</p>
      </div>
    );
  if (orders.length === 0)
    return (
      <div className="order-history-wrapper">
        <p>У вас пока нет заказов.</p>
      </div>
    );

  return (
    <div className="order-history-wrapper">
      <div className="order-history">
        <h2>История заказов</h2>
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                marginBottom: "1rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
              }}
            >
              <p>
                <strong>Номер заказа:</strong> {order.id}
              </p>
              <p>
                <strong>Дата:</strong>{" "}
                {new Date(order.orderDate).toLocaleString()}
              </p>
              <p>
                <strong>Адрес получения:</strong> {order.pickupAddress}
              </p>
              <p>
                <strong>Способ оплаты:</strong>{" "}
                {order.paymentMethod === "pickup"
                  ? "На кассе"
                  : order.paymentMethod === "card"
                  ? "Онлайн оплата"
                  : order.paymentMethod}
              </p>

              <p>
                <strong>Сумма:</strong> {order.totalPrice} BYN
              </p>
               <p>
                <strong>Заказ:</strong> {order.status} 
              </p>
              <p>
                <strong>Содержимое:</strong> {order.orderDescription || "-"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderHistory;
