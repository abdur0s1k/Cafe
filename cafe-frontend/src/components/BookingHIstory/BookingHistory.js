import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingHistory.css";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Получаем userId и email из localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj && userObj.userId && userObj.email) {
          setUserId(userObj.userId);
          // если нужно, setUserEmail(userObj.email);
        } else {
          setErrorMessage("Ошибка: Данные пользователя некорректны");
        }
      } catch {
        setErrorMessage("Ошибка: Не удалось разобрать данные пользователя");
      }
    } else {
      setErrorMessage(
        "Ошибка: Пользователь не авторизован. Пожалуйста, войдите."
      );
    }
  }, []);

  // Загружаем брони, когда есть userId
  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5189/api/bookings/user?userId=${userId}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке брони:", error);
      }
      finally {
  setLoading(false);
}
    };

    fetchBookings();
  }, [userId]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  return (
    <div className="center-wrapper">
      <div className="order-history">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {bookings.length === 0 ? (
          <p className="no-bookings">Бронирований пока нет.</p>
        ) : (
          <ul className="booking-list">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <span className="booking-table">Столик #{booking.tableId}</span>
                <span className="booking-date">
                  {new Date(booking.bookingDateTime).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
