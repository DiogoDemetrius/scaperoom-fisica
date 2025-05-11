import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [group, setGroup] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // Adicionado estado loading
  const [error, setError] = useState('');         // Adicionado estado error
  
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://homologacao-fis-scaperoom.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group, password }),
        credentials: 'include',  // Adiciona suporte para cookies/credentials
        mode: 'cors'            // Explicitamente define o modo como CORS
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Grupo ou senha incorretos.' }));
        throw new Error(errorData.message || 'Grupo ou senha incorretos.');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/game');
    } catch (error) {
      console.error('Erro de login:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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
        <button 
          className="primary-button" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;