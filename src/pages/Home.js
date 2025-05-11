import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-centered">
      <div className="home-content-centered">
        <h1 className="home-title">
          <span role="img" aria-label="cadeado" className="emoji-lock">
            🔐
          </span>{" "}
          Escape Room de <span>Física</span>
        </h1>

        <p className="home-subtitle">
          Resolva desafios, avance por enigmas e mostre que seu grupo é o
          melhor!
        </p>

        <div className="home-rules">
          <h3>🧠 Como funciona:</h3>
          <ul>
            <li>
              ✅ Cada grupo terá <strong>3 vidas</strong> por questão.
            </li>
            <li>📊 Questões com cálculos físicos e variações nos dados.</li>
            <li>💡 Acertos avançam e pontuam. ❌ Erros custam vidas.</li>
            <li>😵 Se perder todas as vidas, avança sem pontuar.</li>
            <li>🏁 Ao final, um ranking mostra os melhores grupos.</li>
          </ul>
        </div>

        <button className="start-button" onClick={() => navigate("/login")}>
          🔓 Iniciar Jogo
        </button>
      </div>
    </div>
  );
};

export default Home;
