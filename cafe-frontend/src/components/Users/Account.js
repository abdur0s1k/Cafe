import React, { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import UserPage from './UserPage';
import './Account.css';
import axios from 'axios';

function Account() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null); // Добавляем роль пользователя
  const [formType, setFormType] = useState('login');
  const [loading, setLoading] = useState(true);

  // При загрузке пытаемся восстановить сессию из localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      const user = JSON.parse(savedUser);

      // Если у тебя есть токен авторизации (например, JWT), лучше использовать его для запроса
      // В данном примере попробуем восстановить сразу из localStorage
      setName(user.name);
      setEmail(user.email);
      setUserId(user.userId);
      setRole(user.role || null);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // При смене isAuthenticated и данных пользователя синхронизируем localStorage
  useEffect(() => {
    if (isAuthenticated) {
      // Сохраняем минимальный набор данных (не пароль!)
      localStorage.setItem(
        'user',
        JSON.stringify({ userId, name, email, role })
      );
    } else {
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, userId, name, email, role]);

  // Логин — получаем данные с сервера и обновляем состояние
  const handleLogin = async ({ email, password }) => {
    try {
      const response = await axios.post('http://localhost:5189/api/users/login', { email, password });
      const { id, name, email: userEmail } = response.data;
      setIsAuthenticated(true);
      setName(name);
      setEmail(userEmail);
      setUserId(id);

      localStorage.setItem('password', password);  // сохраняем пароль
    } catch (err) {
      alert('Ошибка входа: ' + (err.response?.data?.message || 'Проверьте данные'));
    }
  };

  // Регистрация — то же самое, только регистрируем пользователя
  const handleRegister = async ({ email, password, name }) => {
    try {
      const response = await axios.post('http://localhost:5189/api/users/register', {
        email,
        password,
        name,
      });

      const { id, name: userName, email: userEmail, role: userRole } = response.data;

      setIsAuthenticated(true);
      setName(userName);
      setEmail(userEmail);
      setUserId(id);
      setRole(userRole || null);

    } catch (err) {
      alert('Ошибка регистрации: ' + (err.response?.data?.message || 'Попробуйте позже'));
    }
  };

  // Логаут — очищаем состояние и localStorage
  const handleLogout = () => {
    setIsAuthenticated(false);
    setName('');
    setEmail('');
    setUserId(null);
    setRole(null);
    setFormType('login');
    localStorage.removeItem('user');
  };

  const switchForm = () => {
    setFormType(formType === 'login' ? 'register' : 'login');
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Загрузка...</div>
      </div>
    );

  return (
    <div className="account-container">
      {!isAuthenticated ? (
        <AuthForm
          formType={formType}
          onSubmit={formType === 'login' ? handleLogin : handleRegister}
          onSwitchForm={switchForm}
        />
      ) : (
        <UserPage
          name={name}
          email={email}
          userId={userId}
          role={role}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default Account;
