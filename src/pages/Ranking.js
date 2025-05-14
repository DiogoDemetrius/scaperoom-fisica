import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ranking.css";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch('https://homologacao-fis-scaperoom.vercel.app/api/game/ranking', {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Erro ao carregar ranking');
        }

        const data = await res.json();
        // Ordena por pontuação, do maior para o menor
        const ordenado = data.sort((a, b) => b.score - a.score);
        setRanking(ordenado);
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [token]);

  if (loading) {
    return (
      <div className="ranking-wrapper">
        <div className="loading-container">
          <p>Carregando ranking...</p>
          <div className="loading-animation">
            <div className="loading-circle"></div>
            <div className="loading-circle"></div>
            <div className="loading-circle"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-wrapper">
        <div className="error-container">
          <h2>❌ Erro ao carregar ranking</h2>
          <p>{error}</p>
          <button className="ranking-btn" onClick={() => navigate("/")}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ranking-wrapper">
      <h1 className="ranking-title">🏆 Ranking Final</h1>
      
      {ranking.length === 0 ? (
        <div className="no-ranking-message">
          <p>Ainda não há pontuações registradas.</p>
          <p>Seja o primeiro a completar o desafio!</p>
        </div>
      ) : (
        <div className="ranking-list">
          {ranking.map((item, index) => (
            <div
              key={item.group}
              className={`ranking-card ${index < 3 ? "top-rank" : ""}`}
            >
              <div className="rank-badge">
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : `${index + 1}º`}
              </div>
              <div className="rank-group">{item.group.toUpperCase()}</div>
              <div className="rank-points">{item.score} pontos</div>
            </div>
          ))}
        </div>
      )}

      <button className="ranking-btn" onClick={() => navigate("/")}>
        ⬅️ Voltar ao início
      </button>
    </div>
  );
};

export default Ranking;
