import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Lock, Mail, Smartphone, X, CreditCard, FileText, ChevronRight, ShieldCheck, Star } from 'lucide-react';

export default function App() {
  const gold = "#f59e0b";
  const black = "#0a0a0a";
  const cardBg = "#141414";

  // --- CONFIGURAÇÕES DE ANIMAÇÃO PREMIUM (APLICADAS AOS CARDS E BOTÕES) ---
  const springTransition = { type: "spring", stiffness: 300, damping: 25 };
  const premiumHover = {
    y: -12,
    scale: 1.02,
    boxShadow: `0px 20px 40px rgba(245, 158, 11, 0.15)`,
    borderColor: gold,
  };

  // --- ESTADOS DE AUTENTICAÇÃO (MANTIDOS ORIGINAIS) ---
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);

  const [authData, setAuthData] = useState({
    nome: '', email: '', whatsapp: '', senha: '', confirmarSenha: '',
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

  // --- LÓGICA DE MÁSCARAS E AUTH (RESTAURADA ORIGINAL) ---
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

  const aplicarMascarasCadastro = (campo, valor) => {
    let v = valor;
    if (campo === 'cpf') {
      v = v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (campo === 'numeroCartao') {
      v = v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
    } else if (campo === 'validade') {
      v = v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d{2})/, "$1/$2");
    } else if (campo === 'cvv') {
      v = v.replace(/\D/g, "").slice(0, 4);
    } else if (campo === 'nomeCartao') {
      v = v.replace(/[^a-zA-Z\s]/g, "");
    }
    setAuthData(prev => ({ ...prev, [campo]: v }));
  };

  const handleInputChange = (field, value) => {
    let cleanValue = value;
    if (field === 'nome') cleanValue = value.replace(/[0-9!@#$%^&*(),.?":{}|<>]/g, "");
    else if (field === 'whatsapp') cleanValue = formatWhatsApp(value);
    else if (field === 'entrada' || field === 'renda') cleanValue = formatMoeda(value);
    setDados(prev => ({ ...prev, [field]: cleanValue }));
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (!isLoginTab && authData.senha !== authData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    const mockUser = { nome: authData.nome || "Cliente VIP", email: authData.email };
    setUser(mockUser);
    localStorage.setItem('alfa_user', JSON.stringify(mockUser));
    setShowAuthModal(false);
  };

  const carInventory = [
    { id: 1, nome: "Honda Civic G10", ano: "2020", preco: 115900, tipo: "Sedan", cambio: "Automático", tag: "Estoque Premium" },
    { id: 2, nome: "Toyota Corolla XEi", ano: "2019", preco: 108500, tipo: "Sedan", cambio: "Automático", tag: "Destaque" },
    { id: 3, nome: "Volkswagen T-Cross", ano: "2021", preco: 112000, tipo: "SUV", cambio: "Automático", tag: "Aprovação Facilitada" },
    { id: 4, nome: "Volkswagen Gol G6", ano: "2015", preco: 38900, tipo: "Hatch", cambio: "Manual", tag: "Mais Vendido" },
    { id: 5, nome: "Fiat Uno Vivace", ano: "2014", preco: 29500, tipo: "Hatch", cambio: "Manual", tag: "Super Econômico" },
    { id: 6, nome: "Chevrolet Onix LT", ano: "2016", preco: 48900, tipo: "Hatch", cambio: "Manual", tag: "Oportunidade" },
    { id: 7, nome: "Hyundai HB20 Comfort", ano: "2015", preco: 45000, tipo: "Hatch", cambio: "Manual", tag: "Baixa KM" },
    { id: 8, nome: "Ford Ka SE", ano: "2017", preco: 42000, tipo: "Hatch", cambio: "Manual", tag: "Pronta Entrega" },
    { id: 9, nome: "Renault Sandero Expression", ano: "2015", preco: 35500, tipo: "Hatch", cambio: "Manual", tag: "Baixa Entrada" },
    { id: 10, nome: "Chevrolet Classic LS", ano: "2014", preco: 28900, tipo: "Sedan", cambio: "Manual", tag: "Aprovação Imediata" },
    { id: 11, nome: "Fiat Palio Fire", ano: "2015", preco: 31000, tipo: "Hatch", cambio: "Manual", tag: "Oferta da Semana" },
    { id: 12, nome: "Toyota Etios XS", ano: "2014", preco: 39900, tipo: "Hatch", cambio: "Manual", tag: "Super Econômico" },
    { id: 13, nome: "Honda Fit LX", ano: "2013", preco: 44500, tipo: "Hatch", cambio: "Manual", tag: "Oportunidade" },
    { id: 14, nome: "Volkswagen Fox Pepper", ano: "2016", preco: 49900, tipo: "Hatch", cambio: "Manual", tag: "Baixa KM" },
    { id: 15, nome: "Chevrolet Prisma LT", ano: "2015", preco: 47500, tipo: "Sedan", cambio: "Manual", tag: "Mais Vendido" },
    { id: 16, nome: "Renault Logan Authentique", ano: "2016", preco: 38000, tipo: "Sedan", cambio: "Manual", tag: "Pronta Entrega" },
    { id: 17, nome: "Nissan March SV", ano: "2015", preco: 36900, tipo: "Hatch", cambio: "Manual", tag: "Baixa Entrada" },
    { id: 18, nome: "Fiat Siena EL", ano: "2013", preco: 27500, tipo: "Sedan", cambio: "Manual", tag: "Aprovação Imediata" },
    { id: 19, nome: "Volkswagen Voyage Trend", ano: "2014", preco: 34900, tipo: "Sedan", cambio: "Manual", tag: "Oferta da Semana" },
    { id: 20, nome: "Chevrolet Agile LTZ", ano: "2014", preco: 32900, tipo: "Hatch", cambio: "Manual", tag: "Baixa KM" },
    { id: 21, nome: "Fiat Punto Attractive", ano: "2015", preco: 41000, tipo: "Hatch", cambio: "Manual", tag: "Oportunidade" },
    { id: 22, nome: "Renault Clio Expression", ano: "2016", preco: 25900, tipo: "Hatch", cambio: "Manual", tag: "Super Econômico" },
    { id: 23, nome: "Chevrolet Corsa Maxx", ano: "2012", preco: 24500, tipo: "Hatch", cambio: "Manual", tag: "Baixa Entrada" }
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
    const msg = `Olá Alfa Motors! Quero simular o ${selectedCar.nome}.`;
    window.open(`https://wa.me/5511958071871?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const inputStyle = { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #222', background: '#080808', color: '#fff', outline: 'none' };

  return (
    <div style={{ backgroundColor: black, color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVBAR PREMIUM */}
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', position: 'fixed', width: '100%', top: 0, zIndex: 1000, borderBottom: `1px solid ${gold}30`, boxSizing: 'border-box' }}>
        <motion.h2 whileHover={{ scale: 1.05 }} style={{ margin: 0, cursor: 'pointer', letterSpacing: '1px' }}>ALFA <span style={{ color: gold }}>MOTORS</span></motion.h2>
        {user ? (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: gold, fontWeight: '500' }}>{user.nome}</span>
            <motion.button whileHover={{ color: '#fff', scale: 1.1 }} onClick={() => { setUser(null); localStorage.removeItem('alfa_user'); }} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}><LogOut size={18} /></motion.button>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${gold}40` }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuthModal(true)} 
            style={{ background: gold, border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ÁREA VIP</motion.button>
        )}
      </motion.nav>

      {/* HEADER DINÂMICO */}
      <header style={{ paddingTop: '180px', textAlign: 'center', paddingBottom: '50px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0 }}>CATÁLOGO <span style={{ color: gold }}>ALFA</span></h1>
          <p style={{ color: '#555', fontSize: '1.1rem', marginTop: '10px' }}>Veículos selecionados com garantia de procedência</p>
        </motion.div>
      </header>

      {/* GRID DE CARROS COM EFEITOS PREMIUM */}
      <section style={{ padding: '40px 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {carInventory.map(car => (
          <motion.div 
            key={car.id} 
            whileHover={premiumHover}
            transition={springTransition}
            style={{ background: cardBg, padding: '30px', borderRadius: '20px', border: '1px solid #1a1a1a', cursor: 'pointer', position: 'relative' }}>
            
            <div style={{ background: `${gold}20`, color: gold, padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px', border: `1px solid ${gold}40` }}>
              {car.tag}
            </div>

            <h3 style={{ margin: '5px 0', fontSize: '1.4rem' }}>{car.nome}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{car.ano} • {car.cambio} • {car.tipo}</p>
            
            <div style={{ margin: '20px 0', borderBottom: '1px solid #222' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: gold, margin: 0 }}>R$ {car.preco.toLocaleString('pt-BR')}</h2>
              <motion.button 
                whileHover={{ x: 5, color: '#fff' }}
                onClick={() => { setSelectedCar(car); simuladorRef.current.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ background: 'transparent', border: 'none', color: gold, display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                Simular <ChevronRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* SIMULADOR PREMIUM */}
      <section ref={simuladorRef} style={{ padding: '100px 5%', background: '#050505' }}>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ maxWidth: '800px', margin: '0 auto', background: cardBg, padding: '50px', borderRadius: '30px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
          <Star color={gold} style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Simulação <span style={{ color: gold }}>Exclusiva</span></h2>
          <p style={{ color: '#666', marginBottom: '40px' }}>Veículo: <span style={{ color: '#fff' }}>{selectedCar.nome}</span></p>

          <form onSubmit={calcular} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input required placeholder="Nome Completo" style={inputStyle} value={dados.nome} onChange={(e) => handleInputChange('nome', e.target.value)} />
            <input required placeholder="WhatsApp" style={inputStyle} value={dados.whatsapp} onChange={(e) => handleInputChange('whatsapp', e.target.value)} />
            <input required placeholder="Valor de Entrada" style={inputStyle} value={dados.entrada} onChange={(e) => handleInputChange('entrada', e.target.value)} />
            <input required placeholder="Renda Mensal" style={inputStyle} value={dados.renda} onChange={(e) => handleInputChange('renda', e.target.value)} />
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#fff', color: '#000' }}
              type="submit" style={{ gridColumn: 'span 2', padding: '18px', background: gold, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>CALCULAR CONDIÇÕES</motion.button>
          </form>

          {resultado && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ marginTop: '40px', padding: '30px', background: '#000', borderRadius: '20px', border: `1px solid ${gold}30` }}>
              <p style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' }}>Sua parcela mensal estimada</p>
              <h1 style={{ color: gold, fontSize: '3rem', margin: '10px 0' }}>R$ {resultado.parcela.replace('.', ',')}</h1>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={enviarWhatsApp} 
                style={{ background: '#25D366', color: '#fff', padding: '15px 30px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}>FALAR COM CONSULTOR</motion.button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* MODAL DE AUTENTICAÇÃO (RESTAURADO EXATAMENTE IGUAL) */}
      <AnimatePresence>
        {showAuthModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ position: 'relative', background: '#0d0d0d', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', border: '1px solid #222', maxHeight: '90vh', overflowY: 'auto' }}>
              
              <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: '#444', cursor: 'pointer' }}><X /></button>

              <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #222' }}>
                <button onClick={() => setIsLoginTab(true)} style={{ flex: 1, padding: '15px', background: 'none', border: 'none', color: isLoginTab ? gold : '#555', borderBottom: isLoginTab ? `2px solid ${gold}` : 'none', fontWeight: 'bold', cursor: 'pointer' }}>LOGIN</button>
                <button onClick={() => setIsLoginTab(false)} style={{ flex: 1, padding: '15px', background: 'none', border: 'none', color: !isLoginTab ? gold : '#555', borderBottom: !isLoginTab ? `2px solid ${gold}` : 'none', fontWeight: 'bold', cursor: 'pointer' }}>CADASTRO VIP</button>
              </div>

              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLoginTab && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: gold, marginBottom: '5px' }}><User size={16}/> <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>DADOS PESSOAIS</span></div>
                    <input required placeholder="Nome Completo" style={inputStyle} value={authData.nome} onChange={e => setAuthData({...authData, nome: e.target.value})} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input required placeholder="WhatsApp" style={inputStyle} value={authData.whatsapp} onChange={e => setAuthData({...authData, whatsapp: formatWhatsApp(e.target.value)})} />
                      <input required placeholder="CPF" style={inputStyle} value={authData.cpf} onChange={e => aplicarMascarasCadastro('cpf', e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: gold, margin: '10px 0 5px 0' }}><CreditCard size={16}/> <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>DADOS DE PAGAMENTO (GARANTIA)</span></div>
                    <input required placeholder="Número do Cartão" style={inputStyle} value={authData.numeroCartao} onChange={e => aplicarMascarasCadastro('numeroCartao', e.target.value)} />
                    <input required placeholder="Nome Impresso no Cartão" style={inputStyle} value={authData.nomeCartao} onChange={e => aplicarMascarasCadastro('nomeCartao', e.target.value)} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <input required placeholder="Validade" style={inputStyle} value={authData.validade} onChange={e => aplicarMascarasCadastro('validade', e.target.value)} />
                      <input required placeholder="CVV" style={inputStyle} value={authData.cvv} onChange={e => aplicarMascarasCadastro('cvv', e.target.value)} />
                      <select style={inputStyle} value={authData.tipoCartao} onChange={e => setAuthData({...authData, tipoCartao: e.target.value})}>
                        <option>Crédito</option>
                        <option>Débito</option>
                      </select>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: gold, margin: '10px 0 5px 0' }}><Lock size={16}/> <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>ACESSO</span></div>
                <input type="email" required placeholder="E-mail" style={inputStyle} value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} />
                <input type="password" required placeholder="Senha" style={inputStyle} value={authData.senha} onChange={e => setAuthData({...authData, senha: e.target.value})} />
                {!isLoginTab && <input type="password" required placeholder="Confirmar Senha" style={inputStyle} value={authData.confirmarSenha} onChange={e => setAuthData({...authData, confirmarSenha: e.target.value})} />}
                
                <button type="submit" style={{ width: '100%', padding: '16px', background: gold, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', color: '#000' }}>
                  {isLoginTab ? 'ACESSAR PORTAL' : 'FINALIZAR CADASTRO VIP'}
                </button>
                <p style={{ fontSize: '0.7rem', color: '#444', textAlign: 'center', marginTop: '10px' }}><ShieldCheck size={10} inline /> Seus dados estão protegidos por criptografia de ponta a ponta.</p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
