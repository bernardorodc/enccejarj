import React, { useState, useEffect } from 'react';
import { Trophy, Star, MapPin, Users, CheckCircle, Rocket, Brain, Target, Lock, PartyPopper, Phone, Calendar, User, Home, Clock, X } from 'lucide-react';
import './index.css';

const WEBHOOK_URL = 'https://webhook.ifpvps.com/webhook/f9936d06-8898-4143-a99c-6dd0e99dc160';

// Dados das unidades e turmas
const UNIDADES_TURMAS = {
  'IFP - Madureira': [
    'CURSO: EXATAS — SEG-QUA — 19:00 - 21:00 — Beatriz Scarinchi — Início: 03/07/2025',
    'CURSO: HUMANAS — SEG-QUA — 19:00 - 21:00 — Ana Caroline Luz — Início: 03/07/2025',
    'CURSO: EXATAS — TER - SEX — 09:00 - 11:00 — Cristiane Murillo — Início: 07/07/2025',
    'CURSO: EXATAS — QUI - SEX — 19:00 - 21:00 — Beatriz Scarinchi — Início: 09/07/2025'
  ],
  'Estácio - Ilha do Governador': [
    'CURSO: HUMANAS — QUA - QUI — 15:00 - 17:00 — Beatriz Scarinchi — Início: 10/07/2025',
    'CURSO: HUMANAS — TER - QUI — 17:00 - 19:00 — Beatriz Scarinchi — Início: 10/07/2025'
  ],
  'Casa Nails - Brás de Pina': [
    'CURSO: HUMANAS — TER - QUI — 09:00 - 11:00 — Tânia Márcia — Início: 08/07/2025',
    'CURSO: HUMANAS — TER - QUI — 18:00 - 20:00 — Milena — Início: 08/07/2025'
  ],
  'Casa Nails - Penha': [
    'CURSO: HUMANAS — SEG - QUA — 09:00 - 11:00 — Milena — Início: 08/07/2025',
    'CURSO: HUMANAS — QUA - SEX — 18:00 - 20:00 — Tânia Márcia — Início: 09/07/2025'
  ]
};

// Sistema de pontuação
const PONTUACAO_ETAPAS = {
  1: { pontos: 10, icone: '🚀', titulo: "Jornada Iniciada!", copy: "Primeiro passo dado! Faltam só 4!" },
  2: { pontos: 15, icone: '🧠', titulo: "Identidade desbloqueada!", copy: "Você tá mais perto do certificado." },
  3: { pontos: 25, icone: '📍', titulo: "Rota personalizada criada!", copy: "Já encontramos onde você vai se destacar." },
  4: { pontos: 20, icone: '🔒', titulo: "Dados salvos com sucesso!", copy: "Agora é oficial: você tá quase lá!" },
  5: { pontos: 30, icone: '🎉', titulo: "Parabéns! Jornada completa!", copy: "Você acaba de conquistar sua vaga!" }
};

// Frases motivacionais por progresso
const FRASES_PROGRESSO = {
  0: "A maioria desiste aqui... mas você não é qualquer um, né?",
  25: "Metade do caminho! Continua que teu certificado tá piscando!",
  50: "Só mais um passo. Não morre na praia, campeão!",
  75: "Inscrição garantida! Agora é brilhar no ENCCEJA!"
};

// Mensagens de notificação flutuante
const NOTIFICACOES = [
  "📦 Restam 14 Vagas Para Sua Região",
  "👏 Você está entre os 20% que chegaram até aqui...",
  "🔓 Conquista Desbloqueada: Mente Brilhante!",
  "⚡ Mais de 500 pessoas se inscreveram hoje!",
  "🎯 Foco! Você está quase conquistando sua vaga!",
  "🌟 Parabéns! Você é persistente!"
];

function App() {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [pontuacao, setPontuacao] = useState(0);
  const [vagasRestantes, setVagasRestantes] = useState(14);
  const [mostrarPontuacao, setMostrarPontuacao] = useState(false);
  const [mostrarConquista, setMostrarConquista] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    dataNascimento: '',
    sexo: '',
    cep: '',
    localEstudo: '',
    turmaHorario: '',
    cpf: '',
    consentimento: false
  });
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [errors, setErrors] = useState({});

  // Sistema de notificações flutuantes
  useEffect(() => {
    if (etapaAtual > 1 && etapaAtual < 5) {
      const interval = setInterval(() => {
        const mensagem = NOTIFICACOES[Math.floor(Math.random() * NOTIFICACOES.length)];
        const novaNotificacao = {
          id: Date.now(),
          mensagem,
          timestamp: Date.now()
        };
        
        setNotificacoes(prev => [...prev, novaNotificacao]);
        
        // Remove automaticamente após 4 segundos
        setTimeout(() => {
          setNotificacoes(prev => prev.filter(n => n.id !== novaNotificacao.id));
        }, 4000);
      }, 30000); // A cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [etapaAtual]);

  // Simular diminuição de vagas
  useEffect(() => {
    const interval = setInterval(() => {
      setVagasRestantes(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
    }, 45000); // A cada 45 segundos

    return () => clearInterval(interval);
  }, []);

  // Atualizar turmas quando local é selecionado
  useEffect(() => {
    if (formData.localEstudo) {
      setTurmasDisponiveis(UNIDADES_TURMAS[formData.localEstudo] || []);
      setFormData(prev => ({ ...prev, turmaHorario: '' }));
    }
  }, [formData.localEstudo]);

  const calcularProgresso = () => {
    return (etapaAtual - 1) * 20;
  };

  const obterFraseProgresso = () => {
    const progresso = calcularProgresso();
    return FRASES_PROGRESSO[progresso] || FRASES_PROGRESSO[0];
  };

  const atualizarFormData = (campo, valor) => {
    // Formatação simples para telefone (apenas DDD + número)
    if (campo === 'telefone') {
      // Remove todos os caracteres não numéricos
      let raw = valor.replace(/\D/g, '');
      
      // Limita a 11 dígitos (DDD + 9 dígitos)
      if (raw.length > 11) {
        raw = raw.slice(0, 11);
      }
      
      // Formatar para exibição (XX) XXXXX-XXXX
      let formatted = raw;
      if (raw.length >= 2) {
        formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        [campo]: raw, // Armazena apenas os números
        telefoneDisplay: formatted // Para exibição
      }));
    } else {
      setFormData(prev => ({ ...prev, [campo]: valor }));
    }
    
    // Limpar erro quando campo é preenchido
    if (errors[campo] && valor) {
      setErrors(prev => ({ ...prev, [campo]: '' }));
    }
  };

  const fecharConquista = () => {
    setMostrarConquista(false);
  };

  const ganharPontos = (etapa) => {
    const pontosGanhos = PONTUACAO_ETAPAS[etapa].pontos;
    setPontuacao(prev => prev + pontosGanhos);
    setMostrarPontuacao(true);
    setTimeout(() => setMostrarPontuacao(false), 1200); // Reduzido de 3000 para 1200ms
    
    // Mostrar conquista na parte inferior
    setMostrarConquista(true);
    setTimeout(() => setMostrarConquista(false), 1000); // Reduzido de 2000 para 1000ms
  };

  const proximaEtapa = () => {
    if (validarEtapa()) {
      ganharPontos(etapaAtual);
      setEtapaAtual(prev => prev + 1);
      setErrors({});
    }
  };

  const validarEtapa = () => {
    const newErrors = {};
    
    switch (etapaAtual) {
      case 2:
        if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
        
        // Validação do telefone (DDD + 9 dígitos)
        if (!formData.telefone) {
          newErrors.telefone = 'Telefone é obrigatório';
        } else if (formData.telefone.length !== 11) {
          newErrors.telefone = 'Telefone deve ter DDD + 9 dígitos';
        }
        
        if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
        if (!formData.sexo) newErrors.sexo = 'Sexo é obrigatório';
        break;
      case 3:
        if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
        if (!formData.localEstudo) newErrors.localEstudo = 'Local de estudo é obrigatório';
        if (!formData.turmaHorario) newErrors.turmaHorario = 'Turma/Horário é obrigatório';
        break;
      case 4:
        if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
        if (!formData.consentimento) newErrors.consentimento = 'Você deve aceitar os termos';
        break;
      default:
        return true;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const enviarFormulario = async () => {
    if (!validarEtapa()) return;
    
    setEnviando(true);
    
    // Preparar dados estruturados para o webhook
    const dadosParaEnvio = {
      nome: formData.nome,
      telefone: formData.telefone,
      dataNascimento: formData.dataNascimento,
      sexo: formData.sexo,
      cep: formData.cep,
      localEstudo: formData.localEstudo,
      turmaHorario: formData.turmaHorario,
      cpf: formData.cpf,
      consentimento: formData.consentimento,
      pontuacaoFinal: pontuacao + PONTUACAO_ETAPAS[etapaAtual].pontos,
      dataEnvio: new Date().toISOString()
    };
    
    console.log('Dados estruturados para envio:', dadosParaEnvio);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      console.log('Resposta do webhook:', response.status);
      ganharPontos(etapaAtual);
      setEtapaAtual(5);
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      console.log('Dados que seriam enviados:', dadosParaEnvio);
      // Mesmo com erro, continua para a página de sucesso para não bloquear o usuário
      ganharPontos(etapaAtual);
      setEtapaAtual(5);
    } finally {
      setEnviando(false);
    }
  };

  const removerNotificacao = (id) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };

  const renderizarEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <div className="card slide-in">
            <div className="welcome-content">
              <h1 className="title-main">Seu Futuro Começa No Rio!</h1>
              <p className="subtitle">Vai fazer o ENCCEJA 2025? Prepare-se GRATUITAMENTE com a Prefeitura do Rio!</p>
              <p className="text-highlight">
                Conquiste seu Certificado. Comece AGORA!
              </p>
            </div>
            <button 
              onClick={proximaEtapa}
              className="btn btn-primary btn-full"
            >
              <Rocket size={20} />
              Iniciar Minha Jornada Gratuita!
            </button>
          </div>
        );

      case 2:
        return (
          <div className="card slide-in">
            <div className="step-header">
              <div className="step-icon">🧠</div>
              <h2 className="step-title">Descobrindo Seu Potencial!</h2>
              <p className="step-description">Precisamos de alguns detalhes para personalizar seu acesso ao curso e suporte.</p>
            </div>
            
            <div className="form-container">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.nome ? 'error' : ''}`}
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) => atualizarFormData('nome', e.target.value)}
                />
                {errors.nome && <div className="form-error">{errors.nome}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} />
                  Telefone *
                </label>
                <input
                  type="tel"
                  className={`form-input ${errors.telefone ? 'error' : ''}`}
                  placeholder="(XX) XXXXX-XXXX"
                  value={formData.telefoneDisplay || ''}
                  onChange={(e) => atualizarFormData('telefone', e.target.value)}
                />
                {errors.telefone && <div className="form-error">{errors.telefone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  className={`form-input ${errors.dataNascimento ? 'error' : ''}`}
                  value={formData.dataNascimento}
                  onChange={(e) => atualizarFormData('dataNascimento', e.target.value)}
                />
                {errors.dataNascimento && <div className="form-error">{errors.dataNascimento}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Sexo *
                </label>
                <select 
                  className={`form-select ${errors.sexo ? 'error' : ''}`}
                  value={formData.sexo} 
                  onChange={(e) => atualizarFormData('sexo', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.sexo && <div className="form-error">{errors.sexo}</div>}
              </div>
            </div>

            <button 
              onClick={proximaEtapa}
              className="btn btn-primary btn-full"
            >
              <Target size={20} />
              Continuar a Jornada!
            </button>
          </div>
        );

      case 3:
        return (
          <div className="card slide-in">
            <div className="step-header">
              <div className="step-icon">📍</div>
              <h2 className="step-title">Onde Podemos Te Apoiar?</h2>
              <p className="step-description">Selecione o local e horário que melhor se encaixam na sua rotina de estudos.</p>
            </div>
            
            <div className="form-container">
              <div className="form-group">
                <label className="form-label">
                  <Home size={16} />
                  CEP *
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.cep ? 'error' : ''}`}
                  placeholder="XXXXX-XXX"
                  value={formData.cep}
                  onChange={(e) => atualizarFormData('cep', e.target.value)}
                />
                {errors.cep && <div className="form-error">{errors.cep}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={16} />
                  Local de Estudo *
                </label>
                <select 
                  className={`form-select ${errors.localEstudo ? 'error' : ''}`}
                  value={formData.localEstudo} 
                  onChange={(e) => atualizarFormData('localEstudo', e.target.value)}
                >
                  <option value="">Selecione</option>
                  {Object.keys(UNIDADES_TURMAS).map(unidade => (
                    <option key={unidade} value={unidade}>{unidade}</option>
                  ))}
                </select>
                {errors.localEstudo && <div className="form-error">{errors.localEstudo}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} />
                  Turma/Horário *
                </label>
                <select 
                  className={`form-select ${errors.turmaHorario ? 'error' : ''}`}
                  value={formData.turmaHorario} 
                  onChange={(e) => atualizarFormData('turmaHorario', e.target.value)}
                  disabled={!formData.localEstudo}
                >
                  <option value="">Selecione</option>
                  {turmasDisponiveis.map((turma, index) => (
                    <option key={index} value={turma}>{turma}</option>
                  ))}
                </select>
                {errors.turmaHorario && <div className="form-error">{errors.turmaHorario}</div>}
                {!formData.localEstudo && (
                  <div className="form-help">Primeiro selecione o local de estudo</div>
                )}
              </div>
            </div>

            <button 
              onClick={proximaEtapa}
              className="btn btn-primary btn-full"
            >
              <CheckCircle size={20} />
              Quase Lá! Último Passo!
            </button>
          </div>
        );

      case 4:
        return (
          <div className="card slide-in">
            <div className="step-header">
              <div className="step-icon">🔒</div>
              <h2 className="step-title">Revisão Final: Sua Vitória te Espera!</h2>
              <p className="step-description">Verifique seus dados e finalize sua inscrição para garantir sua vaga no curso preparatório gratuito.</p>
            </div>

            <div className="data-summary">
              <div className="data-summary-title">Resumo dos Dados</div>
              <div className="data-grid">
                <div className="data-item">
                  <div className="data-label">Telefone:</div>
                  <div className="data-value">{formData.telefoneDisplay || formData.telefone}</div>
                </div>
                <div className="data-item">
                  <div className="data-label">Sexo:</div>
                  <div className="data-value">{formData.sexo}</div>
                </div>
                <div className="data-item">
                  <div className="data-label">Data de Nascimento:</div>
                  <div className="data-value">{formData.dataNascimento}</div>
                </div>
                <div className="data-item">
                  <div className="data-label">CEP:</div>
                  <div className="data-value">{formData.cep}</div>
                </div>
                <div className="data-item data-item-full">
                  <div className="data-label">Local de Estudo:</div>
                  <div className="data-value">{formData.localEstudo}</div>
                </div>
                <div className="data-item data-item-full">
                  <div className="data-label">Horário:</div>
                  <div className="data-value">{formData.turmaHorario}</div>
                </div>
              </div>
            </div>
            
            <div className="form-container">
              <div className="form-group">
                <label className="form-label">CPF *</label>
                <input
                  type="text"
                  className={`form-input ${errors.cpf ? 'error' : ''}`}
                  placeholder="XXX.XXX.XXX-XX"
                  value={formData.cpf}
                  onChange={(e) => atualizarFormData('cpf', e.target.value)}
                />
                {errors.cpf && <div className="form-error">{errors.cpf}</div>}
                <div className="form-help">O CPF é necessário para vincular sua inscrição ao sistema do curso preparatório.</div>
              </div>

              <div className="checkbox-container">
                <input 
                  type="checkbox"
                  id="consentimento"
                  className="checkbox-input"
                  checked={formData.consentimento}
                  onChange={(e) => atualizarFormData('consentimento', e.target.checked)}
                />
                <label htmlFor="consentimento" className="checkbox-label">
                  Sim, confirmo meus dados e aceito receber informações e orientações exclusivas sobre o ENCCEJA-RJ da Prefeitura.
                </label>
              </div>
              {errors.consentimento && <div className="form-error">{errors.consentimento}</div>}
            </div>

            <button 
              onClick={enviarFormulario}
              disabled={enviando}
              className="btn btn-primary btn-full"
            >
              {enviando ? (
                <>Enviando...</>
              ) : (
                <>
                  <Trophy size={20} />
                  Confirmar Inscrição e Celebrar!
                </>
              )}
            </button>
          </div>
        );

      case 5:
        return (
          <div className="success-page slide-in">
            <div className="success-icon">
              <Trophy size={40} />
            </div>
            <h1 className="success-title">PARABÉNS! Sua Jornada Começou!</h1>
            <p className="success-message">
              Sua inscrição foi um sucesso! Você receberá uma confirmação e os próximos passos via WhatsApp em breve.
            </p>
            
            <div className="achievement-card">
              <div className="achievement-title">🏆 Missão Completa!</div>
              <div className="achievement-points">Você conquistou {pontuacao} Pontos na Missão ENCCEJA</div>
              <div className="achievement-subtitle">Agora desbloqueie acesso VIP ao conteúdo gratuito.</div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-full"
                onClick={() => window.open('https://drive.google.com/drive/folders/1bHiuiwiBVqsbCdWnnEkm3W7G0gJuhdq4?usp=sharing', '_blank')}
              >
                <Star size={20} />
                Acessar Materiais Gratuitos
              </button>
              
              <button 
                className="btn btn-secondary btn-full"
                onClick={() => window.open('https://chatgpt.com/g/g-683eeb35c560819195e0983e59c2e293-professor-ifp', '_blank')}
              >
                <Brain size={20} />
                Conhecer Professor IFP - ENCCEJA
              </button>
            </div>

            <p className="share-message">
              Compartilhe essa oportunidade com seus contatos!
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header-prefeitura">
        <div className="header-content">
          <div className="logo-prefeitura">
            <img 
              src="/logo-rio.png" 
              alt="Prefeitura do Rio - Trabalho e Renda" 
              className="logo-image"
            />
          </div>
          
          {etapaAtual > 1 && etapaAtual < 5 && (
            <div className="score-display">
              <div className="score-label">Missão ENCCEJA</div>
              <div className="score-value">{pontuacao} pts</div>
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      {etapaAtual > 1 && etapaAtual < 5 && (
        <div className="progress-container">
          <div className="progress-content">
            <div className="progress-header">
              <span className="progress-label">Progresso da Missão</span>
              <span className="progress-percentage">{calcularProgresso()}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${calcularProgresso()}%` }}
              ></div>
            </div>
            <p className="progress-message">{obterFraseProgresso()}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-container">
        {renderizarEtapa()}
      </main>

      {/* Notificações Flutuantes */}
      <div className="notifications-container">
        {notificacoes.map((notificacao) => (
          <div key={notificacao.id} className="notification">
            <span className="notification-text">{notificacao.mensagem}</span>
            <button 
              className="notification-close"
              onClick={() => removerNotificacao(notificacao.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Popup de Pontuação */}
      {mostrarPontuacao && etapaAtual > 1 && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-icon">{PONTUACAO_ETAPAS[etapaAtual - 1]?.icone}</div>
            <h3 className="popup-title">
              {PONTUACAO_ETAPAS[etapaAtual - 1]?.titulo}
            </h3>
            <p className="popup-message">
              {PONTUACAO_ETAPAS[etapaAtual - 1]?.copy}
            </p>
            <div className="popup-points">
              +{PONTUACAO_ETAPAS[etapaAtual - 1]?.pontos} pts
            </div>
          </div>
        </div>
      )}

      {/* Conquista Bottom      {/* Card de Conquista */}
      {mostrarConquista && (
        <div className="conquista-card">
          <button className="conquista-close" onClick={fecharConquista}>
            ×
          </button>
          <div className="conquista-content">
            🏆 Você desbloqueou a conquista: {PONTUACAO_ETAPAS[etapaAtual]?.conquista}!
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

