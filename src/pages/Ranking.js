import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ranking.css";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("ranking");
    if (raw) {
      const parsed = JSON.parse(raw);
      const ordenado = parsed.sort((a, b) => b.pontos - a.pontos);
      setRanking(ordenado);
    }
  }, []);

  return (
    <div className="ranking-wrapper">
      <h1 className="ranking-title">🏆 Ranking Final</h1>
      <div className="ranking-list">
        {ranking.map((item, index) => (
          <div
            key={item.grupo}
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
            <div className="rank-group">{item.grupo.toUpperCase()}</div>
            <div className="rank-points">{item.pontos} pontos</div>
          </div>
        ))}
      </div>

      <button className="ranking-btn" onClick={() => navigate("/")}>
        ⬅️ Voltar ao início
      </button>
    </div>
  );
};

export default Ranking;
