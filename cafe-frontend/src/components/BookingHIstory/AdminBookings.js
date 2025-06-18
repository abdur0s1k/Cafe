import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Orders/OrderManagement.css"; // предполагаю, что стили из твоего примера

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5189/api/bookings");
        setBookings(response.data);
      } catch (error) {
        setError("Ошибка при получении всех бронирований");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleClearBookings = async () => {
    if (!window.confirm("Вы действительно хотите очистить все бронирования?"))
      return;

    try {
      const response = await axios.delete("http://localhost:5189/api/bookings");
      console.log(
        "Ответ сервера при удалении:",
        response.status,
        response.data
      );
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(
          `Не удалось очистить бронирования, статус: ${response.status}`
        );
      }
      setBookings([]);
      alert("Все бронирования успешно удалены");
    } catch (error) {
      console.error("Ошибка при очистке:", error.response || error.message);
      alert(
        "Ошибка при очистке бронирований: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Загрузка...</div>
      </div>
    );

  return (
    <div className="order-management">
      <button onClick={handleGoBack} style={{ marginRight: "10px" }}>
        Назад
      </button>

      <button onClick={handleClearBookings} style={{ marginBottom: "10px" }}>
        Очистить все бронирования
      </button>

      {bookings.length === 0 ? (
        <p>Бронирований пока нет.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Столик</th>
              <th>Дата и время</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td data-label="ID">{b.id}</td>
                <td data-label="Пользователь">{b.username}</td>
                <td data-label="Email">{b.userEmail}</td>
                <td data-label="Столик">{b.tableId}</td>
                <td data-label="Дата и время">
                  {new Date(b.bookingDateTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
