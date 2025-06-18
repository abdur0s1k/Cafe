import React, { useState, useEffect, useRef } from "react";
import "./TableMap.css";

const initialTables = [
  { id: 1, topPercent: 5, leftPercent: 10, capacity: 2 },
  { id: 2, topPercent: 5, leftPercent: 40, capacity: 4 },
  { id: 3, topPercent: 5, leftPercent: 70, capacity: 2 },
  { id: 4, topPercent: 24, leftPercent: 20, capacity: 6 },
  { id: 5, topPercent: 24, leftPercent: 50, capacity: 4 },
  { id: 6, topPercent: 43, leftPercent: 10, capacity: 2 },
  { id: 7, topPercent: 43, leftPercent: 36, capacity: 2 },
  { id: 8, topPercent: 43, leftPercent: 62, capacity: 4 },
  { id: 9, topPercent: 62, leftPercent: 10, capacity: 2 },
  { id: 10, topPercent: 62, leftPercent: 40, capacity: 6 },
  { id: 11, topPercent: 62, leftPercent: 70, capacity: 2 },
  { id: 12, topPercent: 81, leftPercent: 36, capacity: 4 },
];

function TableMap() {
  const [tables] = useState(initialTables);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [userId, setUserId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const notificationTimeoutRef = useRef(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj && userObj.userId && userObj.email) {
          setUserId(userObj.userId);
          setUserEmail(userObj.email);
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

  const handleSelect = (id) => {
    setSelectedTableId(id);
  };

const handleBooking = async () => {
  setErrorMessage(null);

  if (!userId) {
    alert("Ошибка: Вы не авторизованы. Пожалуйста, войдите в аккаунт.");
    return;
  }

  if (!bookingDate || !bookingTime) {
    alert("Пожалуйста, укажите дату и время бронирования");
    return;
  }

  if (!selectedTableId) {
    alert("Пожалуйста, выберите столик");
    return;
  }

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const bookingDateTime = new Date(
    `${bookingDate}T${bookingTime}`
  ).toISOString();

  const bookingData = {
    tableId: selectedTable.id,
    capacity: selectedTable.capacity,
    bookingDateTime,
    userId,
    userEmail,
  };

  console.log("Отправляем бронирование:", bookingData);

  try {
    const token = localStorage.getItem("token"); // предполагаем, что токен сохраняется сюда

    const response = await fetch("http://localhost:5189/api/bookings/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ токен в заголовке
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    setNotification({
      tableId: selectedTable.id,
      date: bookingDate,
      time: bookingTime,
    });

    setBookingDate("");
    setBookingTime("");
    setSelectedTableId(null);

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    notificationTimeoutRef.current = setTimeout(
      () => setNotification(null),
      5000
    );
  } catch (e) {
    console.error("Ошибка бронирования:", e);
    setErrorMessage(e.message);
  }
};


  return (
    <div className="tablemap-wrapper">

      <div className="room-layout">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table ${
              selectedTableId === table.id ? "selected" : ""
            }`}
            style={{
              top: `${table.topPercent}%`,
              left: `${table.leftPercent}%`,
            }}
            onClick={() => handleSelect(table.id)}
          >
            {table.capacity} чел.
          </div>
        ))}
      </div>

      {selectedTableId && (
        <div className="booking-form">
          <label>
            Дата:
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </label>
          <label>
            Время:
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </label>
          <button onClick={handleBooking}>Забронировать</button>
        </div>
      )}
{notification && (
  <div className="notification">
    ✅ Столик №{notification.tableId} забронирован на {notification.date}{" "}
    в {notification.time}
  </div>
)}

{errorMessage && (
  <div className="error-message">
    ❌ {errorMessage}
  </div>
)}

    </div>
  );
}

export default TableMap;
