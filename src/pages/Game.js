import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game.css';

// Definição das questões termodinâmicas com variáveis que serão substituídas por grupo
const questoesBase = [
  {
    id: 1,
    tipo: 'temperatura',
    contexto: 'Alerta! Câmara de secagem necessita reajuste de pressão. Aplique os parâmetros corretos para estabilização.',
    titulo: 'Reativação da Câmara de Secagem',
    texto: ({ pressaoInicial, pressaoFinal, temperaturaInicial }) =>
      `Para reativar a câmara de secagem, você precisa elevar a pressão de ${pressaoInicial} atm para ${pressaoFinal} atm mantendo o volume constante. Se a temperatura inicial é ${temperaturaInicial} K, calcule a temperatura final em K.`,
    formula: ({ pressaoInicial, pressaoFinal, temperaturaInicial }) => 
      (pressaoFinal * temperaturaInicial) / pressaoInicial,
    variavelPorGrupo: {
      grupo1: { pressaoInicial: 2.0, pressaoFinal: 4.0, temperaturaInicial: 300 },
      grupo2: { pressaoInicial: 1.5, pressaoFinal: 3.0, temperaturaInicial: 350 },
      grupo3: { pressaoInicial: 2.5, pressaoFinal: 5.0, temperaturaInicial: 320 },
      grupo4: { pressaoInicial: 3.0, pressaoFinal: 6.0, temperaturaInicial: 280 },
      grupo5: { pressaoInicial: 1.8, pressaoFinal: 4.5, temperaturaInicial: 310 }
    },
    unidade: 'K',
    animacao: 'termometro',
    feedback: {
      sucesso: 'Câmara de secagem reativada com sucesso! Pressão estabilizada.',
      falha: 'Parâmetros incorretos. A câmara continua instável!'
    }
  },
  {
    id: 2,
    tipo: 'trabalho',
    contexto: 'Sistema de expansão em falha! Calcule o trabalho necessário para liberar vapor no trocador de calor.',
    titulo: 'Expansão do Gás no Trocador',
    texto: ({ volume, temperatura, pressaoExterna }) =>
      `Uma expansão isotérmica de ${volume} L a ${temperatura} K ocorre contra uma pressão externa de ${pressaoExterna} atm. Qual o trabalho realizado pelo gás em J? (Use 1 atm = 101300 Pa)`,
    formula: ({ volume, pressaoExterna }) => 
      -1 * pressaoExterna * 101300 * volume * 0.001, // Convertendo L para m³ e atm para Pa
    variavelPorGrupo: {
      grupo1: { volume: 5.0, temperatura: 300, pressaoExterna: 1.5 },
      grupo2: { volume: 6.0, temperatura: 310, pressaoExterna: 1.8 },
      grupo3: { volume: 4.5, temperatura: 290, pressaoExterna: 1.2 },
      grupo4: { volume: 5.5, temperatura: 320, pressaoExterna: 2.0 },
      grupo5: { volume: 4.0, temperatura: 305, pressaoExterna: 1.7 }
    },
    unidade: 'J',
    animacao: 'pistao',
    feedback: {
      sucesso: 'Pistão ativado! Vapor liberado no trocador de calor com sucesso.',
      falha: 'Falha no cálculo do trabalho! O pistão não atingiu a posição ideal.'
    }
  },
  {
    id: 3,
    tipo: 'energia',
    contexto: 'Sensores descalibrados! Calcule a energia interna para sincronizar o sistema de refrigeração.',
    titulo: 'Calibração dos Sensores Criogênicos',
    texto: ({ temperatura, mols }) =>
      `A energia interna de ${mols} mol de gás monoatômico a ${temperatura} K é requerida para calibrar sensores. Calcule U em J. (Use R = 8.31 J/(mol·K))`,
    formula: ({ temperatura, mols }) => 
      (3/2) * mols * 8.31 * temperatura,
    variavelPorGrupo: {
      grupo1: { temperatura: 400, mols: 1 },
      grupo2: { temperatura: 450, mols: 1.2 },
      grupo3: { temperatura: 380, mols: 0.9 },
      grupo4: { temperatura: 420, mols: 1.5 },
      grupo5: { temperatura: 390, mols: 1.1 }
    },
    unidade: 'J',
    animacao: 'sensor',
    feedback: {
      sucesso: 'Sistema de refrigeração sincronizado! Sensores operando normalmente.',
      falha: 'Falha na calibração! Sensores continuam descalibrados.'
    }
  },
  {
    id: 4,
    tipo: 'primeira-lei',
    contexto: 'Instabilidade térmica detectada! Determine a variação da energia interna para ativar o protocolo correto.',
    titulo: 'Estabilização Térmica da Câmara',
    texto: ({ calor, trabalho }) =>
      `Para resfriar a câmara, foram fornecidos ${calor} J de calor e o gás realizou ${trabalho} J de trabalho. Qual a variação de energia interna (ΔU) em J?`,
    formula: ({ calor, trabalho }) => 
      calor - trabalho,
    variavelPorGrupo: {
      grupo1: { calor: 200, trabalho: 50 },
      grupo2: { calor: 250, trabalho: 80 },
      grupo3: { calor: 180, trabalho: 40 },
      grupo4: { calor: 220, trabalho: 70 },
      grupo5: { calor: 190, trabalho: 60 }
    },
    unidade: 'J',
    animacao: 'valvula',
    feedback: {
      sucesso: 'Protocolo de estabilização ativado com sucesso! Temperatura normalizada.',
      falha: 'Protocolo incorreto! A câmara continua com instabilidade térmica.'
    }
  },
  {
    id: 5,
    tipo: 'transformacao',
    contexto: 'Módulos de estabilização em espera! Calcule o trabalho na transformação isobárica para ativar o compressor principal.',
    titulo: 'Ativação dos Módulos de Estabilização',
    texto: ({ pressao, volumeInicial, volumeFinal }) =>
      `Em uma transformação isobárica a ${pressao} atm, um gás expande de ${volumeInicial} L para ${volumeFinal} L. Qual o trabalho realizado pelo gás em J? (Use 1 atm = 101300 Pa)`,
    formula: ({ pressao, volumeInicial, volumeFinal }) => 
      pressao * 101300 * (volumeFinal - volumeInicial) * 0.001, // Convertendo L para m³ e atm para Pa
    variavelPorGrupo: {
      grupo1: { pressao: 2.0, volumeInicial: 3.0, volumeFinal: 5.0 },
      grupo2: { pressao: 2.5, volumeInicial: 2.5, volumeFinal: 4.0 },
      grupo3: { pressao: 1.8, volumeInicial: 3.5, volumeFinal: 6.0 },
      grupo4: { pressao: 2.2, volumeInicial: 2.8, volumeFinal: 4.5 },
      grupo5: { pressao: 1.5, volumeInicial: 4.0, volumeFinal: 7.0 }
    },
    unidade: 'J',
    animacao: 'compressor',
    feedback: {
      sucesso: 'Compressor principal ativado! Módulos de estabilização operacionais.',
      falha: 'Compressor em estado crítico! Recalcule os parâmetros imediatamente.'
    }
  }
];

const totalQuestoes = questoesBase.length;

const Game = () => {
  const [progress, setProgress] = useState(null);
  const [resposta, setResposta] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [animState, setAnimState] = useState('idle');
  const [questoes, setQuestoes] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const tokenData = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const groupName = token ? tokenData.group.toUpperCase() : 'AGENTES-THERMO';
  
  // Normaliza o nome do grupo para corresponder às chaves em variavelPorGrupo
  const getGroupId = (group) => {
    // Extrai apenas os dígitos do nome do grupo
    const groupNumber = group.match(/\d+/);
    if (groupNumber) {
      return `grupo${groupNumber[0]}`;
    }
    return 'grupo1'; // Grupo padrão
  };
  
  const groupId = token ? getGroupId(tokenData.group) : 'grupo1';

  // Efeito para configurar as questões com base no grupo do usuário
  useEffect(() => {
    if (token) {
      console.log("Grupo identificado:", groupId); // Log para debugging
      
      // Configura as questões com as variáveis específicas do grupo
      const questoesConfiguradas = questoesBase.map(questao => {
        // Se o grupo existe nas variáveis, usa as do grupo, senão usa grupo1 como padrão
        const variaveis = questao.variavelPorGrupo[groupId] || questao.variavelPorGrupo.grupo1;
        
        console.log(`Questão ${questao.id} para ${groupId}:`, variaveis); // Log para debugging
        
        return {
          ...questao,
          variaveis: variaveis
        };
      });
      
      setQuestoes(questoesConfiguradas);
    }
  }, [token, groupId]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Requisição para o backend
        const res = await fetch('https://homologacao-fis-scaperoom.vercel.app/api/game/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error('Erro ao carregar progresso');
        }

        const data = await res.json();
        setProgress({
          ...data,
          lives: 3 // Inicia com 3 vidas para cada questão
        });
      } catch (err) {
        alert('Erro ao carregar progresso');
      }
    };

    setTimeout(() => {
      fetchProgress();
    }, 3000); // Tempo para mostrar a introdução
  }, [token]);

  // Redireciona para o ranking se tiver terminado
  useEffect(() => {
    if (progress && progress.currentQuestion >= totalQuestoes) {
      navigate('/ranking');
    }
  }, [progress, navigate]);

  const handleResponder = async (e) => {
    e.preventDefault();
    const atual = questoes[progress.currentQuestion];
    if (!atual) return;

    // Log para debugging
    console.log("Respondendo questão:", progress.currentQuestion + 1);
    console.log("Grupo:", groupId);
    console.log("Variáveis:", atual.variaveis);
    console.log("Fórmula:", atual.formula.toString());

    const correta = Number(atual.formula(atual.variaveis).toFixed(2));
    const userResposta = Number(parseFloat(resposta).toFixed(2));

    console.log("Resposta correta:", correta);
    console.log("Resposta do usuário:", userResposta);

    // Verifica com tolerância para arredondamentos
    const acertou = Math.abs(userResposta - correta) < 0.01;

    const novasVidas = acertou ? 3 : progress.lives - 1;
    const novaPontuacao = acertou ? progress.score + 1 : progress.score;
    const novaQuestao = acertou || novasVidas <= 0 ? progress.currentQuestion + 1 : progress.currentQuestion;

    // Atualiza animação
    setAnimState(acertou ? 'success' : 'error');

    // Tempo para mostrar a animação
    setTimeout(async () => {
      const atualizado = {
        ...progress,
        currentQuestion: novaQuestao,
        score: novaPontuacao,
        lives: novasVidas > 0 ? novasVidas : 3 // Reseta vidas ao avançar
      };

      try {
        // Requisição para atualizar o progresso no backend
        const res = await fetch('https://homologacao-fis-scaperoom.vercel.app/api/game/progress', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(atualizado)
        });

        if (!res.ok) {
          throw new Error('Erro ao atualizar progresso');
        }

        const data = await res.json();
        setProgress(data);
        setFeedback(acertou ? atual.feedback.sucesso : atual.feedback.falha);
        setResposta('');
        setAnimState('idle');
      } catch (err) {
        alert('Erro ao atualizar progresso');
      }
    }, 1500);
  };

  // Renderiza a animação específica para cada tipo de questão
  const renderAnimacao = (tipo, estado) => {
    switch (tipo) {
      case 'termometro':
        return (
          <div className={`animation-container ${estado}`}>
            <div className="termometro">
              <div className="tubo">
                <div className={`mercurio ${estado}`}></div>
              </div>
              <div className="bulbo"></div>
            </div>
          </div>
        );
      case 'pistao':
        return (
          <div className={`animation-container ${estado}`}>
            <div className="pistao-container">
              <div className={`pistao-topo ${estado}`}></div>
              <div className="pistao-camara">
                <div className={`gas-particulas ${estado}`}></div>
              </div>
            </div>
          </div>
        );
      case 'sensor':
        return (
          <div className={`animation-container ${estado}`}>
            <div className="sensor-container">
              <div className={`sensor-display ${estado}`}></div>
              <div className="sensor-leds">
                <div className={`led ${estado}`}></div>
                <div className={`led ${estado} delay-1`}></div>
                <div className={`led ${estado} delay-2`}></div>
              </div>
            </div>
          </div>
        );
      case 'valvula':
        return (
          <div className={`animation-container ${estado}`}>
            <div className="valvula-container">
              <div className="valvula-corpo"></div>
              <div className={`valvula-alavanca ${estado}`}></div>
              <div className={`valvula-fluxo ${estado}`}></div>
            </div>
          </div>
        );
      case 'compressor':
        return (
          <div className={`animation-container ${estado}`}>
            <div className="compressor-container">
              <div className="compressor-corpo"></div>
              <div className={`compressor-pistao ${estado}`}></div>
              <div className={`compressor-indicador ${estado}`}></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Intro screen
  if (showIntro) {
    return (
      <div className="page-container">
        <div className="intro-card fade-in">
          <h1 className="intro-title">ESTAÇÃO CRYONOVA</h1>
          <div className="intro-classified">CONFIDENCIAL</div>
          
          <p className="intro-text">
            Agentes‑Thermo, sejam bem‑vindos à Estação CryoNova, um laboratório secreto de biocombustíveis 
            oculto nas profundezas montanhosas. Nas últimas horas, sensores indicaram flutuações críticas de 
            pressão e temperatura em vários tanques criogênicos, colocando em risco toda a pesquisa e a 
            segurança da base.
          </p>
          
          <p className="intro-text">
            Sua missão é restabelecer a estabilidade interna ajustando remotamente variáveis termodinâmicas 
            por meio do sistema de controle virtual ConfidentialLink®. 
          </p>
          
          <p className="intro-text highlight">
            O destino da Estação CryoNova está em suas mãos; confiem no método científico, colaborem em equipe 
            e iniciem já o protocolo de salvamento.
          </p>
          
          <button 
            className="intro-button pulse" 
            onClick={() => setShowIntro(false)}
          >
            INICIAR PROTOCOLO DE EMERGÊNCIA
          </button>
          
          <div className="intro-loader">
            <div className="loader-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!progress || questoes.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <p>Estabelecendo conexão segura com CryoNova...</p>
          <div className="loading-animation">
            <div className="loading-circle"></div>
            <div className="loading-circle"></div>
            <div className="loading-circle"></div>
          </div>
        </div>
      </div>
    );
  }

  const atual = questoes[progress.currentQuestion];

  if (!atual) {
    return (
      <div className="page-container">
        <div className="game-card">
          <h2>⚠️ Falha na conexão com o servidor</h2>
          <p>Verifique o status do sistema ou contate a Central CryoNova.</p>
          <button className="primary-button" onClick={() => navigate('/')}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="top-bar">
        <p className="group-name">
          🧪 Equipe: <strong>{groupName}</strong>
        </p>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          🔓 Desconectar
        </button>
      </div>

      <div className="system-status">
        SISTEMA CRYONOVA — <span className="status-critical">ESTADO CRÍTICO</span>
      </div>

      <div className="game-card">
        <div className="card-header">
          <h2 className="game-title">Protocolo #{progress.currentQuestion + 1}: {atual.titulo}</h2>
          <div className="alerta-container">
            <div className="alerta-badge">ALERTA</div>
          </div>
        </div>

        <div className="card-content">
          <div className="animation-section">
            {renderAnimacao(atual.animacao, animState)}
          </div>
          
          <div className="question-section">
            <div className="contexto-message fade-in">
              {atual.contexto}
            </div>
            
            <p className="game-texto fade-in">{atual.texto(atual.variaveis)}</p>

            <div className="game-vidas">
              {"❤️".repeat(progress.lives)}
              {"🖤".repeat(3 - progress.lives)}
            </div>

            <form onSubmit={handleResponder} className="game-form">
              <div className="input-group">
                <input
                  type="number"
                  step="0.01"
                  placeholder={`Resposta em ${atual.unidade}`}
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  required
                />
                <span className="input-unit">{atual.unidade}</span>
              </div>
              <button type="submit" className="primary-button">
                SUBMETER PARÂMETROS
              </button>
            </form>

            {feedback && (
              <div className={`game-feedback fade-in ${feedback.includes('sucesso') ? 'success' : 'error'}`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
        
        <div className="card-footer">
          <p className="game-score">Protocolos resolvidos: {progress.score}/{totalQuestoes}</p>
          <div className="terminal-line">
            <span className="terminal-prompt">cryonova@secure:~$</span> <span className="terminal-cursor">_</span>
          </div>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-label">Status de Estabilização</div>
        <progress
          className="progress-bar"
          value={progress.currentQuestion}
          max={totalQuestoes}
        />
        <div className="progress-percentage">{Math.round((progress.currentQuestion / totalQuestoes) * 100)}%</div>
      </div>
    </div>
  );
};

export default Game;