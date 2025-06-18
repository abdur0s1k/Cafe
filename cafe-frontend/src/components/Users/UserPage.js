import React, { useState, useEffect } from "react";
import "./UserPage.css";
import { useNavigate } from "react-router-dom";

function UserPage({ name, email, userId, onLogout }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(name || "");
  const [emailInput, setEmailInput] = useState(email || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "User");

  // --- Новое состояние для смены пароля ---
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Проверка на валидность пароля
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  // Получаем состояние по сложности пароля
  const getPasswordStrength = () => {
    return {
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      isValidLength: newPassword.length >= 8,
    };
  };

  const passwordStrength = getPasswordStrength();

  useEffect(() => {
    setPasswordTouched(newPassword.length > 0);
  }, [newPassword]);

  // Горячие клавиши для переключения роли
  useEffect(() => {
    const handleKeyCombo = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        const currentRole = localStorage.getItem("role");
        const newRole = currentRole === "Admin" ? "User" : "Admin";
        localStorage.setItem("role", newRole);
        setRole(newRole);
        alert(
          `Режим ${
            newRole === "Admin" ? "администратора" : "пользователя"
          } активирован!`
        );
      }
    };

    window.addEventListener("keydown", handleKeyCombo);
    return () => window.removeEventListener("keydown", handleKeyCombo);
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!userId || isNaN(userId)) {
      alert("Ошибка: не удалось получить ID пользователя.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5189/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          name: nameInput,
          email: emailInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении профиля");
      }

      alert("Профиль успешно обновлён");
      const updatedUser = { name: nameInput, email: emailInput, userId };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Не удалось обновить профиль");
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId || isNaN(userId)) {
      alert("Ошибка: не удалось получить ID пользователя.");
      return;
    }

    if (!window.confirm("Вы уверены, что хотите удалить аккаунт?")) return;

    try {
      const response = await fetch(`http://localhost:5189/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении аккаунта");
      }

      alert("Аккаунт удалён");

      localStorage.clear();
      onLogout();
    } catch (error) {
      console.error(error);
      alert("Не удалось удалить аккаунт");
    }
  };

const handleChangePasswordSubmit = async (e) => {
  e.preventDefault();

  const oldPassword = localStorage.getItem("password") || "";

  if (newPassword === oldPassword) {
    setError("Новый пароль не должен совпадать со старым паролем");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Пароли не совпадают");
    return;
  }

  if (!isPasswordValid(newPassword)) {
    setError(
      "Пароль должен содержать минимум 8 символов, включая цифры и заглавные буквы"
    );
    return;
  }

  setError("");

  try {
    const response = await fetch("http://localhost:5189/api/users/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        newPassword: newPassword,
      }),
    });

    if (!response.ok) throw new Error("Ошибка при смене пароля");

    alert("Пароль успешно изменён");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  } catch (error) {
    console.error(error);
    setError("Не удалось изменить пароль");
  }
};


  return (
    <div className="user-page">
      <header className="user-header">
        <div className="user-info">
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Имя"
                required
              />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email"
                required
              />
              <button type="submit">Сохранить</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Отмена
              </button>
            </form>
          ) : (
            <>
              <h1>{nameInput}</h1>
              <p className="user-email">{emailInput}</p>
              <p className="user-role">Роль: {role}</p>
              <p className="user-joined">Дата регистрации: 14 мая 2025</p>
            </>
          )}
        </div>
        <button className="logout-button" onClick={onLogout}>
          Выйти
        </button>
      </header>

      <section className="user-actions">
        <h3>Настройки</h3>
        <ul>
          <li>
            <button onClick={() => setIsEditing(true)}>Редактировать профиль</button>
          </li>
          <li>
            {isChangingPassword && (
              <form onSubmit={handleChangePasswordSubmit} className="change-password-form">
                <div className="form-group">
                  <label htmlFor="newPassword">Новый пароль</label>
                  <div className="password-container">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      tabIndex={-1}
                    >
                      {passwordVisible ? "🙈" : "👁️"}
                    </button>
                  </div>

                  {passwordTouched && (
                    <div className="password-info">
                      {!passwordStrength.isValidLength && (
                        <p>Пароль должен содержать минимум 8 символов.</p>
                      )}
                      {!passwordStrength.hasUpperCase && (
                        <p>Пароль должен содержать хотя бы одну заглавную букву.</p>
                      )}
                      {!passwordStrength.hasNumber && (
                        <p>Пароль должен содержать хотя бы одну цифру.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Подтвердите пароль</label>
                  <div className="password-container">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      tabIndex={-1}
                    >
                      {confirmPasswordVisible ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit">Сменить пароль</button>
                <button type="button" onClick={() => setIsChangingPassword(false)}>
                  Отмена
                </button>
              </form>
            )}

            {!isChangingPassword && (
              <button onClick={() => setIsChangingPassword(true)}>Изменить пароль</button>
            )}
          </li>
          <li>
            <button
              onClick={handleDeleteAccount}
              style={{ backgroundColor: "#ff4d4f" }}
            >
              Удалить аккаунт
            </button>
          </li>
          {role === "Admin" && (
            <li>
              <button
                onClick={() => navigate("/admin")}
                style={{ backgroundColor: "#0f3739" }}
              >
                Перейти в админ-панель
              </button>
            </li>
          )}
        </ul>
      </section>

<section className="user-history">
  <h3>История действий</h3>

  <div>
    {role === "Admin" ? (
      <button onClick={() => navigate("/admin/orders")}>
        Управление заказами
      </button>
    ) : (
      <button onClick={() => navigate("/order-history")}>
        История заказов
      </button>
    )}
  </div>

  <div>
    {role === "Admin" ? (
      <button onClick={() => navigate("/admin/bookings")}>
        Управление бронью
      </button>
    ) : (
      <button onClick={() => navigate("/bookinghistory")}>
        История брони
      </button>
    )}
  </div>
</section>


    </div>
  );
}

export default UserPage;
