import React, { useState, useEffect } from 'react';

function AuthForm({ formType, onSubmit, onSwitchForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // Добавляем состояние для имени
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false); // Новый флаг для отслеживания состояния поля пароля

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType === 'register') {
      if (!name) {
        setError('Имя обязательно');
        return;
      }

      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }

      if (!isPasswordValid(password)) {
        setError('Пароль должен содержать минимум 8 символов, включая цифры и заглавные буквы');
        return;
      }

      if (password === confirmPassword) {
        setError('');
      }
    }

    onSubmit({ name, email, password }); // Отправляем имя вместе с email и паролем
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // Убрали спецсимволы
    return passwordRegex.test(password);
  };

  const getPasswordStrength = () => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 8;

    return {
      hasUpperCase,
      hasNumber,
      isValidLength,
    };
  };

  const passwordStrength = getPasswordStrength();

  // Эффект для отслеживания, когда пользователь начинает вводить пароль
  useEffect(() => {
    if (password) {
      setPasswordTouched(true);
    } else {
      setPasswordTouched(false);
    }
  }, [password]);

  return (
    <div className={formType === 'login' ? 'login-form' : 'register-form'}>
      <h2>{formType === 'login' ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {formType === 'register' && (
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <div className="password-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? '🙈' : '👁️'} {/* Иконки для отображения/скрытия пароля */}
            </button>
          </div>

          {/* Показывать подсказки только если пароль был введен и только для формы регистрации */}
          {formType === 'register' && passwordTouched && (
            <div className="password-info">
              {!passwordStrength.isValidLength && <p>Пароль должен содержать минимум 8 символов.</p>}
              {!passwordStrength.hasUpperCase && <p>Пароль должен содержать хотя бы одну заглавную букву.</p>}
              {!passwordStrength.hasNumber && <p>Пароль должен содержать хотя бы одну цифру.</p>}
            </div>
          )}
        </div>
        {formType === 'register' && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <div className="password-container">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? '🙈' : '👁️'} {/* Иконки для отображения/скрытия пароля */}
              </button>
            </div>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className='btn_log_reg btn-log'>{formType === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
      <p>
        {formType === 'login'
          ? 'Нет аккаунта?'
          : 'Уже есть аккаунт?'}{' '}
        <button onClick={onSwitchForm} className='btn_log_reg btn-reg'>
          {formType === 'login' ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;
