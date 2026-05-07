import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function App() {
  const gold = "#f59e0b";
  const black = "#0a0a0a";
  const cardBg = "#141414";

  const [selectedCar, setSelectedCar] = useState({ nome: 'Selecione um carro', preco: 0 });
  const [dados, setDados] = useState({ nome: '', whatsapp: '', entrada: '' });
  const [resultado, setResultado] = useState(null);
  const simuladorRef = useRef(null);

  // Inventário atualizado com os 8 anteriores + 6 novos populares
  const carInventory = [
    { id: 1, nome: "Honda Civic G10", ano: "2020", preco: 115900, tipo: "Sedan", combustivel: "Flex", cambio: "Automático", tag: "Estoque Premium" },
    { id: 2, nome: "Toyota Corolla XEi", ano: "2019", preco: 108500, tipo: "Sedan", combustivel: "Flex", cambio: "Automático", tag: "Destaque" },
    { id: 3, nome: "Volkswagen T-Cross", ano: "2021", preco: 112000, tipo: "SUV", combustivel: "Turbo Flex", cambio: "Automático", tag: "Aprovação Facilitada" },
    { id: 4, nome: "Chevrolet Onix Plus", ano: "2022", preco: 89900, tipo: "Sedan", combustivel: "Turbo Flex", cambio: "Automático", tag: "Baixa KM" },
    
    // --- NOVOS POPULARES (25k a 50k) ---
    { id: 9, nome: "Volkswagen Gol G6", ano: "2015", preco: 38900, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Oferta da Semana" },
    { id: 10, nome: "Fiat Palio Attractive", ano: "2014", preco: 34500, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Baixa Entrada" },
    { id: 11, nome: "Hyundai HB20 Comfort", ano: "2015", preco: 46900, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Mais Vendido" },
    { id: 12, nome: "Ford Ka SE 1.0", ano: "2017", preco: 42000, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Super Econômico" },
    { id: 13, nome: "Renault Sandero Stepway", ano: "2014", preco: 37800, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Oportunidade" },
    { id: 14, nome: "Chevrolet Celta LT", ano: "2013", preco: 28500, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Aprovação Imediata" },
    // -----------------------------------

    { id: 5, nome: "Hyundai HB20S", ano: "2021", preco: 78900, tipo: "Sedan", combustivel: "Flex", cambio: "Automático", tag: "Elegante" },
    { id: 6, nome: "Jeep Renegade", ano: "2020", preco: 98500, tipo: "SUV", combustivel: "Flex", cambio: "Automático", tag: "Pronta Entrega" },
    { id: 7, nome: "Fiat Argo Drive", ano: "2022", preco: 69900, tipo: "Hatch", combustivel: "Flex", cambio: "Manual", tag: "Garantia de Fábrica" },
    { id: 8, nome: "Nissan Kicks SV", ano: "2021", preco: 105000, tipo: "SUV", combustivel: "Flex", cambio: "Automático", tag: "SUV Premium" }
  ];

  const handleSimular = (car) => {
    setSelectedCar(car);
    setResultado(null);
    if (simuladorRef.current) {
      simuladorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const calcular = (e) => {
    e.preventDefault();
    const valorFinanciado = selectedCar.preco - (Number(dados.entrada) || 0);
    const taxaJuros = 0.015;
    const valorParcela = (valorFinanciado * taxaJuros) / (1 - Math.pow(1 + taxaJuros, -48));
    setResultado({ parcela: valorParcela.toFixed(2), entrada: dados.entrada || 0 });
  };

  const enviarWhatsApp = () => {
    const msg = `Olá Alfa Motors! Quero simular o ${selectedCar.nome} (${selectedCar.ano}). Entrada de R$${resultado.entrada} e parcelas de R$${resultado.parcela}.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: black, color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif', margin: 0, padding: 0 }}>
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: '#000', borderBottom: `1px solid rgba(245, 158, 11, 0.3)`, position: 'fixed', width: '100%', top: 0, zIndex: 1000, boxSizing: 'border-box', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ margin: 0, fontWeight: '900', fontStyle: 'italic' }}>ALFA <span style={{ color: gold }}>MOTORS</span></h2>
        <button style={{ background: 'transparent', color: gold, border: `1px solid ${gold}`, padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>CONTATO</button>
      </nav>

      {/* HERO SECTION */}
      <header style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>
          CATÁLOGO <span style={{ color: gold }}>COMPLETO</span>
        </motion.h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px' }}>Dos populares aos premium, a melhor taxa do mercado está aqui.</p>
      </header>

      {/* GRID DE VEÍCULOS */}
      <section style={{ padding: '20px 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1300px', margin: '0 auto' }}>
        {carInventory.map((car, index) => (
          <motion.div 
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -10, boxShadow: `0 0 40px ${gold}15`, borderColor: gold }}
            style={{ 
              background: cardBg, 
              borderRadius: '24px', 
              padding: '30px', 
              border: '1px solid #222', 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
            
            <div>
              <div style={{ background: car.preco <= 50000 ? '#1e293b' : `${gold}15`, color: car.preco <= 50000 ? '#94a3b8' : gold, display: 'inline-block', padding: '5px 12px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {car.tag}
              </div>
              
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', fontWeight: '800', lineHeight: '1.2' }}>{car.nome}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px' }}>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>Ano: <b style={{color: '#fff'}}>{car.ano}</b></div>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>Tipo: <b style={{color: '#fff'}}>{car.tipo}</b></div>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>Câmbio: <b style={{color: '#fff'}}>{car.cambio}</b></div>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>Combustível: <b style={{color: '#fff'}}>{car.combustivel}</b></div>
              </div>
            </div>

            <div>
              <div style={{ borderTop: '1px solid #222', paddingTop: '20px', marginBottom: '20px' }}>
                <p style={{ color: gold, fontSize: '2rem', fontWeight: '900', margin: 0 }}>R$ {car.preco.toLocaleString('pt-BR')}</p>
                <span style={{ color: '#444', fontSize: '0.75rem' }}>Sujeito a análise de crédito</span>
              </div>

              <button 
                onClick={() => handleSimular(car)} 
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  background: 'white', 
                  color: 'black', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontWeight: '900', 
                  cursor: 'pointer', 
                  textTransform: 'uppercase'
                }}>
                Simular Agora
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* SIMULADOR */}
      <section ref={simuladorRef} style={{ padding: '100px 5%', background: '#080808' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: cardBg, padding: '40px', borderRadius: '30px', border: `1px solid rgba(245, 158, 11, 0.2)` }}>
          <h2 style={{ textAlign: 'center', color: gold, margin: 0, fontWeight: '900' }}>Simulador</h2>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#888' }}>{selectedCar.nome}</p>
          
          <form onSubmit={calcular} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input required placeholder="Seu Nome" style={{ padding: '18px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white' }} onChange={e => setDados({...dados, nome: e.target.value})} />
            <input required placeholder="WhatsApp" style={{ padding: '18px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white' }} onChange={e => setDados({...dados, whatsapp: e.target.value})} />
            <input required type="number" placeholder="Entrada (R$)" style={{ padding: '18px', borderRadius: '12px', border: '1px solid #333', background: '#000', color: 'white' }} onChange={e => setDados({...dados, entrada: e.target.value})} />
            <button type="submit" disabled={selectedCar.preco === 0} style={{ padding: '20px', background: gold, color: 'black', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>CALCULAR PARCELAS</button>
          </form>

          {resultado && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '30px', textAlign: 'center', background: '#000', padding: '25px', borderRadius: '20px', border: `1px solid ${gold}` }}>
              <p style={{ margin: 0, color: '#888' }}>48x de:</p>
              <h2 style={{ color: gold, fontSize: '3rem', margin: '5px 0', fontWeight: '900' }}>R$ {resultado.parcela.replace('.',',')}</h2>
              <button onClick={enviarWhatsApp} style={{ background: '#25D366', color: 'white', border: 'none', padding: '18px', borderRadius: '10px', width: '100%', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold' }}>CHAMAR NO WHATSAPP</button>
            </motion.div>
          )}
        </div>
      </section>

      <footer style={{ padding: '60px', textAlign: 'center', color: '#333' }}>
        <p>© 2026 ALFA MOTORS PREMIUM</p>
      </footer>
    </div>
  );
}
