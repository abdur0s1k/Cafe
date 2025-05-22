import React, { useEffect, useState } from "react";
import "./OrderManagement.css";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusOptions = {
    В_обработке: "В обработке",
    Приготовление: "Приготовление",
    Готово: "Готово",
    Отменён: "Отменён",
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:5189/api/orders");
        if (!response.ok) throw new Error("Ошибка при загрузке заказов");
        const data = await response.json();

        // Сортировка от меньшего к большему ID
        const sortedData = data.sort((a, b) => a.id - b.id);
        setOrders(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5189/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Не удалось обновить статус");

      // Обновим локальное состояние
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Ошибка при обновлении статуса: " + err.message);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleClearOrders = async () => {
    if (!window.confirm("Вы действительно хотите очистить все заказы?")) return;

    try {
      const response = await fetch("http://localhost:5189/api/orders", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Не удалось очистить заказы на сервере");

      setOrders([]); // Очистка локального состояния после успешного удаления
      alert("Все заказы успешно удалены");
    } catch (err) {
      alert("Ошибка при очистке заказов: " + err.message);
    }
  };

  if (loading) return <p>Загрузка заказов...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <div className="order-management">
      <h2>Управление заказами</h2>

      {/* Кнопка Назад */}
      <button onClick={handleGoBack} style={{ marginRight: "10px" }}>
        Назад
      </button>

      {/* Кнопка Очистить таблицу */}
      <button onClick={handleClearOrders} style={{ marginBottom: "10px" }}>
        Очистить таблицу
      </button>

      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Дата</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Адрес</th>
            <th>Оплата</th>
            <th>Сумма</th>
            <th>Содержимое</th>
            <th>Статус</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>{order.userName || "—"}</td>
              <td>{order.userEmail || "—"}</td>
              <td>{order.pickupAddress}</td>
              <td>
                {order.paymentMethod === "pickup"
                  ? "На кассе"
                  : order.paymentMethod === "card"
                  ? "Онлайн оплата"
                  : order.paymentMethod}
              </td>
              <td>{order.totalPrice} BYN</td>
              <td>{order.orderDescription || "—"}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {Object.entries(statusOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManagement;
