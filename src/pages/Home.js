import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [animatedText, setAnimatedText] = useState("");
  const titleText = "Escape Room de Física";
  
  // Efeito de digitação para o título
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= titleText.length) {
        setAnimatedText(titleText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <div className="particles-background">
        {Array(10).fill().map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
      
      <main className="home-centered">
        <div className="home-content-centered">
          <header className="logo-container">
            <div className="logo-icon">🔐</div>
          </header>
          
          <h1 className="home-title">
            <span className="title-text">{animatedText}</span>
            <span className="cursor">|</span>
          </h1>
          
          <p className="home-subtitle">
            Resolva desafios, avance por enigmas e mostre que seu grupo é o melhor!
          </p>
          
          <section className="card-container">
            <div className="home-rules">
              <h3><span className="rule-icon">🧠</span> Como funciona:</h3>
              <ul className="rules-list">
                <li className="rule-item">
                  <span className="rule-emoji">✅</span>
                  <span className="rule-text">Cada grupo terá <strong>3 vidas</strong> por questão.</span>
                </li>
                <li className="rule-item">
                  <span className="rule-emoji">📊</span>
                  <span className="rule-text">Questões com cálculos físicos e variações nos dados.</span>
                </li>
                <li className="rule-item">
                  <span className="rule-emoji">💡</span>
                  <span className="rule-text">Acertos avançam e pontuam. <span className="error-text">❌</span> Erros custam vidas.</span>
                </li>
                <li className="rule-item">
                  <span className="rule-emoji">😵</span>
                  <span className="rule-text">Se perder todas as vidas, avança sem pontuar.</span>
                </li>
                <li className="rule-item">
                  <span className="rule-emoji">🏁</span>
                  <span className="rule-text">Ao final, um ranking mostra os melhores grupos.</span>
                </li>
              </ul>
            </div>
          </section>
          
          <footer>
            <button 
              className="start-button" 
              onClick={() => navigate("/login")}
            >
              <span className="button-icon">🔓</span>
              <span className="button-text">Iniciar Jogo</span>
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Home;