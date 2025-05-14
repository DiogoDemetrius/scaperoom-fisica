import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game.css';

// Definição das questões termodinâmicas com variáveis que serão substituídas por grupo
const questoesBase = [
  {
    id: 1,
    tipo: 'pressao',
    contexto: 'Alerta! Tanque de estabilização comprometido! Calcule a pressão ideal para preservar as espécies.',
    titulo: 'Estabilização do Tanque de Cultivo',
    texto: ({ volume, mols, temperaturaMax }) =>
      `A pressão no tanque de estabilização foi comprometida, sabendo que as espécies aguentam até ${temperaturaMax}ºC e que esse tanque possui ${volume}L e ${mols} mols desse gás. Qual é a pressão ideal para o tanque?`,
    variavelPorGrupo: {
      grupo1: { volume: 10000, mols: 5, temperaturaMax: 200, respostaCorreta: 12.45 },
      grupo2: { volume: 5000, mols: 10, temperaturaMax: 100, respostaCorreta: 15.78 },
      grupo3: { volume: 1000, mols: 2, temperaturaMax: 195, respostaCorreta: 14.92 },
      grupo4: { volume: 11000, mols: 5.5, temperaturaMax: 205, respostaCorreta: 13.25 },
      grupo5: { volume: 10500, mols: 5.2, temperaturaMax: 215, respostaCorreta: 13.85 }
    },
    unidade: 'atm',
    animacao: 'termometro',
    feedback: {
      sucesso: 'Pressão ideal estabelecida! As espécies estão seguras e o tanque estabilizado.',
      falha: 'Pressão incorreta! As espécies ainda correm risco no ambiente instável!'
    }
  },
  {
    id: 2,
    tipo: 'trabalho',
    contexto: 'Falha na válvula de compressão! Determine a energia necessária para estabilizar a reação química.',
    titulo: 'Calibração da Válvula de Compressão',
    texto: ({ pressao, volumeInicial, volumeFinal }) =>
      `Uma determinada válvula de compressão de misturas é responsável pela estabilização da reação química. Para isso, essa mistura que está a ${pressao} atm precisa sofrer uma compressão de ${volumeInicial}L para ${volumeFinal}L. Qual é o trabalho realizado pela máquina e consequentemente a quantidade de energia necessária em J? Lembrando que o trabalho realizado pela máquina e pelo gás são opostos. (Use 1 atm = 101300 Pa)`,
    variavelPorGrupo: {
      grupo1: { pressao: 2, volumeInicial: 24, volumeFinal: 20, respostaCorreta: 810.40 },
      grupo2: { pressao: 2.5, volumeInicial: 26, volumeFinal: 21, respostaCorreta: 1266.25 },
      grupo3: { pressao: 1.8, volumeInicial: 22, volumeFinal: 18, respostaCorreta: 729.36 },
      grupo4: { pressao: 2.2, volumeInicial: 25, volumeFinal: 20, respostaCorreta: 1114.30 },
      grupo5: { pressao: 1.9, volumeInicial: 23, volumeFinal: 19, respostaCorreta: 766.88 }
    },
    unidade: 'J',
    animacao: 'pistao',
    feedback: {
      sucesso: 'Válvula calibrada com sucesso! Reação química estabilizada.',
      falha: 'Energia insuficiente! A válvula continua comprometida.'
    }
  },
  {
    id: 3,
    tipo: 'energia',
    contexto: 'Anomalia térmica detectada! Espécime causando flutuações de temperatura. Calcule a variação de energia interna.',
    titulo: 'Anomalia Térmica do Novo Espécime',
    texto: ({ mols, temperaturaInicial, pressaoFinal, volumeFinal }) =>
      `Um tanque contendo um novo espécime com uma habilidade única de controlar a velocidade das partículas ao seu redor está atingindo temperaturas fora do esperado. Sabendo que esse tanque possui ${mols} mols de gás, a temperatura original era de ${temperaturaInicial}ºC e ele passou para o estado de P = ${pressaoFinal}Pa, V = ${volumeFinal}m³. Calcule a variação de energia interna que o tanque sofreu para que os sistemas consigam manter a amostra viva em J. (Use R = 8.31 J/(mol·K))`,
    variavelPorGrupo: {
      grupo1: { mols: 5, temperaturaInicial: 39, pressaoFinal: 50, volumeFinal: 500, respostaCorreta: 2493.00 },
      grupo2: { mols: 5.5, temperaturaInicial: 40, pressaoFinal: 55, volumeFinal: 520, respostaCorreta: 2867.45 },
      grupo3: { mols: 4.8, temperaturaInicial: 38, pressaoFinal: 48, volumeFinal: 490, respostaCorreta: 2285.95 },
      grupo4: { mols: 5.2, temperaturaInicial: 41, pressaoFinal: 52, volumeFinal: 510, respostaCorreta: 2680.22 },
      grupo5: { mols: 4.9, temperaturaInicial: 37, pressaoFinal: 49, volumeFinal: 480, respostaCorreta: 2389.48 }
    },
    unidade: 'J',
    animacao: 'sensor',
    feedback: {
      sucesso: 'Variação de energia calculada corretamente! Sistemas de contenção ajustados.',
      falha: 'Cálculo incorreto! A amostra continua instável e afetando os sistemas.'
    }
  },
  {
    id: 4,
    tipo: 'calor',
    contexto: 'Câmara de resfriamento defeituosa! Calcule o calor a ser removido para evitar dano às amostras.',
    titulo: 'Manutenção da Câmara de Resfriamento',
    texto: ({ mols, variacaoTemperatura }) =>
      `Uma câmara de resfriamento defeituosa não consegue detectar quanto de calor precisa retirar da amostra. Sabendo que se trata de uma câmara isovolumétrica e que a mistura de ${mols} mols ganhou ${variacaoTemperatura}ºC indesejados, qual é a quantidade de calor que deve ser retirada em J? (Use R = 8.31 J/(mol·K) e Cv = 3R/2 para gás monoatômico)`,
    variavelPorGrupo: {
      grupo1: { mols: 3, variacaoTemperatura: 50, respostaCorreta: 1871.48 },
      grupo2: { mols: 3.5, variacaoTemperatura: 55, respostaCorreta: 2405.77 },
      grupo3: { mols: 2.8, variacaoTemperatura: 48, respostaCorreta: 1677.65 },
      grupo4: { mols: 3.2, variacaoTemperatura: 52, respostaCorreta: 2076.91 },
      grupo5: { mols: 2.9, variacaoTemperatura: 49, respostaCorreta: 1774.56 }
    },
    unidade: 'J',
    animacao: 'valvula',
    feedback: {
      sucesso: 'Calor removido com sucesso! Câmara de resfriamento operando normalmente.',
      falha: 'Cálculo incorreto! A câmara continua superaquecendo.'
    }
  },
  {
    id: 5,
    tipo: 'transformacao',
    contexto: 'Sistema de transformação termodinâmica crítico! Identifique o processo e aplique a primeira lei corretamente.',
    titulo: 'Análise de Transformação Termodinâmica',
    texto: ({ tipo, calor, trabalho, energiaInterna }) => {
      if (tipo === 'isotermica') {
        return `Identifique o tipo de transformação onde ΔU = 0, Q = ${calor} J e W = ${trabalho} J. Insira o valor correto para completar a equação da primeira lei da termodinâmica (ΔU = Q - W) em J.`;
      } else if (tipo === 'adiabatica') {
        return `Identifique o tipo de transformação onde Q = 0, ΔU = ${energiaInterna} J e W = ${trabalho} J. Insira o valor correto para completar a equação da primeira lei da termodinâmica (ΔU = Q - W) em J.`;
      } else if (tipo === 'isovolumetrica') {
        return `Identifique o tipo de transformação onde W = 0, ΔU = ${energiaInterna} J e Q = ${calor} J. Insira o valor correto para completar a equação da primeira lei da termodinâmica (ΔU = Q - W) em J.`;
      }
    },
    variavelPorGrupo: {
      grupo1: { tipo: 'isotermica', calor: 500, trabalho: 500, energiaInterna: 0, respostaCorreta: 0 },
      grupo2: { tipo: 'adiabatica', calor: 0, trabalho: -300, energiaInterna: 300, respostaCorreta: 300 },
      grupo3: { tipo: 'isovolumetrica', calor: 400, trabalho: 0, energiaInterna: 400, respostaCorreta: 400 },
      grupo4: { tipo: 'isotermica', calor: 600, trabalho: 600, energiaInterna: 0, respostaCorreta: 0 },
      grupo5: { tipo: 'adiabatica', calor: 0, trabalho: -350, energiaInterna: 350, respostaCorreta: 350 }
    },
    unidade: 'J',
    animacao: 'compressor',
    feedback: {
      sucesso: 'Análise termodinâmica correta! Sistema estabilizado.',
      falha: 'Análise incorreta! O sistema continua em estado crítico.'
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

    // Obtém a resposta correta diretamente das variáveis do grupo
    const respostaCorreta = atual.variaveis.respostaCorreta;
    const userResposta = Number(parseFloat(resposta).toFixed(2));

    // Verifica com tolerância para arredondamentos
    const acertou = Math.abs(userResposta - respostaCorreta) < 0.01;

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