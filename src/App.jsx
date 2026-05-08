import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Lock, Mail, Smartphone, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const gold = "#f59e0b";
  const black = "#0a0a0a";
  const cardBg = "#141414";

  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [authData, setAuthData] = useState({ nome: '', email: '', whatsapp: '', senha: '', confirmarSenha: '' });

  // --- ESTADOS DO SITE ---
  const [selectedCar, setSelectedCar] = useState({ nome: 'Selecione um carro', preco: 0 });
  const [dados, setDados] = useState({ nome: '', whatsapp: '', entrada: '', renda: '' });
  const [errors, setErrors] = useState({});
  const [resultado, setResultado] = useState(null);
  const simuladorRef = useRef(null);

  // Carregar usuário ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('alfa_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // --- LÓGICA DE VALIDAÇÃO PREMIUM (SIMULADOR) ---
  const formatMoeda = (val) => {
    let value = val.replace(/\D/g, "");
    value = (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return value;
  };

  const formatWhatsApp = (val) => {
    let v = val.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    else if (v.length > 5) v = v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    else if (v.length > 2) v = v.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    else v = v.replace(/^(\d*)/, "($1");
    return v;
  };

  const handleInputChange = (field, value) => {
    let cleanValue = value;
    let newErrors = { ...errors };

    if (field === 'nome') {
      cleanValue = value.replace(/[0-9!@#$%^&*(),.?":{}|<>]/g, "");
    } else if (field === 'whatsapp') {
      cleanValue = formatWhatsApp(value);
    } else if (field === 'entrada' || field === 'renda') {
      cleanValue = formatMoeda(value);
    }

    setDados(prev => ({ ...prev, [field]: cleanValue }));
    if (cleanValue.length > 0) delete newErrors[field];
    setErrors(newErrors);
  };

  // --- SISTEMA DE LOGIN/CADASTRO ---
  const handleAuth = (e) => {
    e.preventDefault();
    if (isLoginTab) {
      // Simulação de Login
      const mockUser = { nome: "João Vitor", email: authData.email, whatsapp: "(11) 95807-1871" };
      setUser(mockUser);
      localStorage.setItem('alfa_user', JSON.stringify(mockUser));
    } else {
      // Simulação de Cadastro
      const newUser = { nome: authData.nome, email: authData.email, whatsapp: authData.whatsapp };
      setUser(newUser);
      localStorage.setItem('alfa_user', JSON.stringify(newUser));
    }
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('alfa_user');
  };

  // Inventário (Mantido exatamente como solicitado)
  const carInventory = [
    { id: 1, nome: "Honda Civic G10", ano: "2020", preco: 115900, tipo: "Sedan", combustivel: "Flex", cambio: "Automático", tag: "Estoque Premium" },
    { id: 2, nome: "Toyota Corolla XEi", ano: "2019", preco: 108500, tipo: "Sedan", combustivel: "Flex", cambio: "Automático", tag: "Destaque" },
    { id: 3, nome: "Volkswagen T-Cross", ano: "2021", preco: 112000, tipo: "SUV", combustivel: "Turbo Flex", cambio: "Automático", tag: "Aprovação Facilitada" },
    { id: 4, nome: "Chevrolet Onix Plus", ano: "2022", preco: 89900, tipo: "Sedan", combustivel: "Turbo Flex", cambio: "Automático", tag: "Baixa KM" },
    { id: 9, nome: "Volkswagen Gol G6", ano: "2015", preco: 38900, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Oferta da Semana" },
    { id: 10, nome: "Fiat Palio Attractive", ano: "2014", preco: 34500, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Baixa Entrada" },
    { id: 11, nome: "Hyundai HB20 Comfort", ano: "2015", preco: 46900, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Mais Vendido" },
    { id: 12, nome: "Ford Ka SE 1.0", ano: "2017", preco: 42000, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Super Econômico" },
    { id: 13, nome: "Renault Sandero Stepway", ano: "2014", preco: 37800, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Oportunidade" },
    { id: 14, nome: "Chevrolet Celta LT", ano: "2013", preco: 28500, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Aprovação Imediata" },
    { id: 5, nome: "Hyundai HB20S", ano: "2021", preco: 78900, tipo: "Sedan", combustivel: "Flex", cambio: "Automático", tag: "Elegante" },
    { id: 6, nome: "Jeep Renegade", ano: "2020", preco: 98500, tipo: "SUV", combustivel: "Flex", cambio: "Automático", tag: "Pronta Entrega" },
    { id: 7, nome: "Fiat Argo Drive", ano: "2022", preco: 69900, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Garantia de Fábrica" },
    { id: 8, nome: "Nissan Kicks SV", ano: "2021", preco: 105000, tipo: "SUV", combustivel: "Flex", cambio: "Automático", tag: "SUV Premium" }
  ];

  const calcular = (e) => {
    e.preventDefault();
    const cleanEntrada = Number(dados.entrada.replace(/\D/g, "")) / 100;
    const valorFinanciado = selectedCar.preco - cleanEntrada;
    const taxaJuros = 0.015;
    const valorParcela = (valorFinanciado * taxaJuros) / (1 - Math.pow(1 + taxaJuros, -48));
    setResultado({ parcela: valorParcela.toFixed(2), entrada: dados.entrada });
  };

  const enviarWhatsApp = () => {
    const msg = `Olá Alfa Motors! Sou ${user?.nome || dados.nome}. Quero simular o ${selectedCar.nome}. Entrada de ${resultado.entrada} e parcelas de R$${resultado.parcela}.`;
    window.open(`https://wa.me/5511958071871?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: black, color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif', margin: 0, padding: 0 }}>
      
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: '#000', borderBottom: `1px solid rgba(245, 158, 11, 0.3)`, position: 'fixed', width: '100%', top: 0, zIndex: 1000, boxSizing: 'border-box', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ margin: 0, fontWeight: '900', fontStyle: 'italic' }}>ALFA <span style={{ color: gold }}>MOTORS</span></h2>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: `${gold}15`, padding: '5px 15px', borderRadius: '50px', border: `1px solid ${gold}40` }}>
              <span style={{ fontSize: '0.85rem', color: gold, fontWeight: 'bold' }}>Olá, {user.nome.split(' ')[0]}</span>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer' }}><LogOut size={18} /></button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              style={{ background: gold, color: 'black', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> ENTRAR
            </button>
          )}
        </div>
      </nav>

      {/* HERO & GRID (MANTIDOS) */}
      <header style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center' }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>
          CATÁLOGO <span style={{ color: gold }}>COMPLETO</span>
        </motion.h1>
      </header>

      {/* GRID DE VEÍCULOS (MANTIDO) */}
      <section style={{ padding: '20px 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1300px', margin: '0 auto' }}>
        {carInventory.map((car, index) => (
          <motion.div key={car.id} whileHover={{ y: -10, boxShadow: `0 0 40px ${gold}15`, borderColor: gold }}
            style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: '1px solid #222', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ background: car.preco <= 50000 ? '#1e293b' : `${gold}15`, color: car.preco <= 50000 ? '#94a3b8' : gold, display: 'inline-block', padding: '5px 12px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px' }}>{car.tag}</div>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', fontWeight: '800' }}>{car.nome}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px' }}>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>Ano: <b style={{color: '#fff'}}>{car.ano}</b></div>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>Câmbio: <b style={{color: '#fff'}}>{car.cambio}</b></div>
              </div>
            </div>
            <div>
              <p style={{ color: gold, fontSize: '2rem', fontWeight: '900', margin: 0 }}>R$ {car.preco.toLocaleString('pt-BR')}</p>
              <button onClick={() => { setSelectedCar(car); simuladorRef.current.scrollIntoView({ behavior: 'smooth' }); }} 
                style={{ width: '100%', padding: '16px', background: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', marginTop: '15px' }}>
                Simular Agora
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* SIMULADOR COM VALIDAÇÕES PREMIUM */}
      <section ref={simuladorRef} style={{ padding: '100px 5%', background: '#080808' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: cardBg, padding: '40px', borderRadius: '30px', border: `1px solid ${gold}30` }}>
          <h2 style={{ textAlign: 'center', color: gold, margin: 0, fontWeight: '900' }}>Simulador</h2>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#888' }}>{selectedCar.nome}</p>
          
          <form onSubmit={calcular} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input value={user ? user.nome : dados.nome} required placeholder="Nome Completo" 
                style={{ width: '100%', boxSizing: 'border-box', padding: '18px', borderRadius: '12px', border: `1px solid ${errors.nome ? '#ff4444' : '#333'}`, background: '#000', color: 'white', outline: 'none', transition: '0.3s' }} 
                onChange={e => handleInputChange('nome', e.target.value)} />
            </div>

            <input value={user ? user.whatsapp : dados.whatsapp} required placeholder="WhatsApp (11) 99999-9999" 
              style={{ padding: '18px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white' }} 
              onChange={e => handleInputChange('whatsapp', e.target.value)} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input value={dados.entrada} required placeholder="Entrada (R$)" 
                style={{ padding: '18px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white' }} 
                onChange={e => handleInputChange('entrada', e.target.value)} />
              
              <input value={dados.renda} required placeholder="Renda Mensal" 
                style={{ padding: '18px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white' }} 
                onChange={e => handleInputChange('renda', e.target.value)} />
            </div>

            <button type="submit" style={{ padding: '20px', background: gold, color: 'black', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>CALCULAR PARCELAS</button>
          </form>

          {resultado && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: '30px', textAlign: 'center', background: '#000', padding: '25px', borderRadius: '20px', border: `1px solid ${gold}` }}>
              <p style={{ margin: 0, color: '#888' }}>Sugestão em 48x:</p>
              <h2 style={{ color: gold, fontSize: '3rem', margin: '5px 0', fontWeight: '900' }}>R$ {resultado.parcela.replace('.',',')}</h2>
              <button onClick={enviarWhatsApp} style={{ background: '#25D366', color: 'white', border: 'none', padding: '18px', borderRadius: '10px', width: '100%', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold' }}>ENVIAR SIMULAÇÃO</button>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- MODAL DE AUTH PROFISSIONAL --- */}
      <AnimatePresence>
        {showAuthModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAuthModal(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '420px', background: cardBg, borderRadius: '30px', border: `1px solid ${gold}30`, overflow: 'hidden', boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5)` }}>
              
              <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}><X /></button>

              <div style={{ display: 'flex', borderBottom: '1px solid #222' }}>
                <button onClick={() => setIsLoginTab(true)} style={{ flex: 1, padding: '20px', background: isLoginTab ? `${gold}10` : 'transparent', color: isLoginTab ? gold : '#666', border: 'none', fontWeight: 'bold', borderBottom: isLoginTab ? `2px solid ${gold}` : 'none', cursor: 'pointer' }}>LOGIN</button>
                <button onClick={() => setIsLoginTab(false)} style={{ flex: 1, padding: '20px', background: !isLoginTab ? `${gold}10` : 'transparent', color: !isLoginTab ? gold : '#666', border: 'none', fontWeight: 'bold', borderBottom: !isLoginTab ? `2px solid ${gold}` : 'none', cursor: 'pointer' }}>CADASTRO</button>
              </div>

              <form onSubmit={handleAuth} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLoginTab && (
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '15px', top: '18px', color: gold }} />
                    <input required placeholder="Nome Completo" style={{ width: '100%', boxSizing: 'border-box', padding: '18px 18px 18px 45px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white', outline: 'none' }} />
                  </div>
                )}
                
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '15px', top: '18px', color: gold }} />
                  <input type="email" required placeholder="E-mail" style={{ width: '100%', boxSizing: 'border-box', padding: '18px 18px 18px 45px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white', outline: 'none' }} />
                </div>

                {!isLoginTab && (
                  <div style={{ position: 'relative' }}>
                    <Smartphone size={18} style={{ position: 'absolute', left: '15px', top: '18px', color: gold }} />
                    <input required placeholder="WhatsApp" style={{ width: '100%', boxSizing: 'border-box', padding: '18px 18px 18px 45px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white', outline: 'none' }} />
                  </div>
                )}

                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '15px', top: '18px', color: gold }} />
                  <input type="password" required placeholder="Senha" style={{ width: '100%', boxSizing: 'border-box', padding: '18px 18px 18px 45px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white', outline: 'none' }} />
                </div>

                {isLoginTab && <a href="#" style={{ color: '#666', fontSize: '0.8rem', textAlign: 'right', textDecoration: 'none' }}>Esqueci minha senha</a>}

                <button type="submit" style={{ width: '100%', padding: '20px', background: gold, color: 'black', border: 'none', borderRadius: '12px', fontWeight: '900', marginTop: '10px', cursor: 'pointer', textTransform: 'uppercase' }}>
                  {isLoginTab ? 'Entrar na Conta' : 'Criar minha Conta'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer style={{ padding: '60px', textAlign: 'center', color: '#333' }}>
        <p>© 2026 ALFA MOTORS PREMIUM</p>
      </footer>
    </div>
  );
}
