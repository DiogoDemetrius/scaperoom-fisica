import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [group, setGroup] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://homologacao-fis-scaperoom.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group, password }),
      });

      if (!response.ok) throw new Error('Grupo ou senha incorretos.');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/game');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Login do Grupo</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Grupo"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="primary-button" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
