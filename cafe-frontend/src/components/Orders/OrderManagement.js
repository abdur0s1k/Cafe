import React, { useEffect, useState } from "react";
import "./OrderManagement.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57"];

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false); // <— добавили

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
        setOrders(data.sort((a, b) => a.id - b.id));
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Не удалось обновить статус");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Ошибка при обновлении статуса: " + err.message);
    }
  };

  const handleGoBack = () => window.history.back();

  const handleExportToExcel = () => {
    const filteredOrders = orders.filter(
      (order) => order.status === "Готово" || order.status === "Отменён"
    );

    const totalReadySum = filteredOrders
      .filter((order) => order.status === "Готово")
      .reduce((sum, order) => sum + order.totalPrice, 0);

    const worksheetData = filteredOrders.map((order) => ({
      Номер: order.id,
      Дата: new Date(order.orderDate).toLocaleString(),
      Имя: order.userName || "—",
      Email: order.userEmail || "—",
      Адрес: order.pickupAddress,
      Оплата:
        order.paymentMethod === "pickup"
          ? "На кассе"
          : order.paymentMethod === "card"
          ? "Онлайн оплата"
          : order.paymentMethod,
      Сумма: `${order.totalPrice} BYN`,
      Содержимое: order.orderDescription || "—",
      Статус: statusOptions[order.status] || order.status,
    }));

    worksheetData.push({
      Номер: "",
      Дата: "",
      Имя: "",
      Email: "",
      Адрес: "",
      Оплата: "",
      Сумма: `Общая сумма (Готово): ${totalReadySum} BYN`,
      Содержимое: "",
      Статус: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Заказы");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Готовые_и_Отмененные_заказы.xlsx");
  };

  const handleClearOrders = async () => {
    if (!window.confirm("Вы действительно хотите очистить все заказы?")) return;

    try {
      const response = await fetch("http://localhost:5189/api/orders", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Не удалось очистить заказы на сервере");

      setOrders([]);
      alert("Все заказы успешно удалены");
    } catch (err) {
      alert("Ошибка при очистке заказов: " + err.message);
    }
  };

  // === 🧮 Подготовка данных для графика ===
  const chartData = () => {
    const itemCounts = {};

    orders.forEach((order) => {
      if (order.orderDescription) {
        const items = order.orderDescription.split(",").map((s) => s.trim());
        items.forEach((item) => {
          itemCounts[item] = (itemCounts[item] || 0) + 1;
        });
      }
    });

    return Object.entries(itemCounts).map(([name, value]) => ({ name, value }));
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
      <button onClick={handleClearOrders} style={{ marginBottom: "10px" }}>
        Очистить таблицу
      </button>
      <button
        onClick={handleExportToExcel}
        style={{ marginBottom: "10px", marginLeft: "10px" }}
      >
        Экспорт в Excel
      </button>
      <button
        onClick={() => setShowChart(!showChart)}
        style={{ marginBottom: "10px", marginLeft: "10px" }}
      >
        {showChart ? "Скрыть диаграмму" : "Показать диаграмму заказов"}
      </button>

      {showChart && (
        <div style={{ width: "100%", height: 400, marginBottom: "20px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                label
              >
                {chartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

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
