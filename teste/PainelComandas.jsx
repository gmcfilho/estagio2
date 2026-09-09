import React, { useState } from "react";
import { X, Plus, Minus, Bike, ShoppingBag, UtensilsCrossed, Flame } from "lucide-react";

const TIPOS = {
  pedido: { label: "Mesa", cor: "#b8862e", Icone: UtensilsCrossed },
  entrega: { label: "Entrega", cor: "#c1440e", Icone: Bike },
  balcao: { label: "Balcão", cor: "#6f7a3d", Icone: ShoppingBag },
};

const ITENS_RAPIDOS = [
  { nome: "Espetinho de Carne", valor: 8 },
  { nome: "Espetinho de Frango", valor: 7 },
  { nome: "Espetinho de Queijo Coalho", valor: 8 },
  { nome: "Espetinho de Coração", valor: 8 },
  { nome: "Farofa", valor: 5 },
  { nome: "Vinagrete", valor: 4 },
  { nome: "Refrigerante Lata", valor: 6 },
  { nome: "Cerveja", valor: 9 },
];

const MESAS_INICIAIS = [
  {
    id: "m1",
    numero: 3,
    tipo: "pedido",
    itens: [
      { id: "i1", nome: "Espetinho de Carne", qtd: 3, valor: 8 },
      { id: "i2", nome: "Cerveja", qtd: 2, valor: 9 },
    ],
  },
  {
    id: "m2",
    numero: 7,
    tipo: "pedido",
    itens: [{ id: "i3", nome: "Espetinho de Frango", qtd: 2, valor: 7 }],
  },
  {
    id: "m3",
    numero: 12,
    tipo: "entrega",
    itens: [
      { id: "i4", nome: "Espetinho de Queijo Coalho", qtd: 4, valor: 8 },
      { id: "i5", nome: "Farofa", qtd: 1, valor: 5 },
      { id: "i6", nome: "Refrigerante Lata", qtd: 2, valor: 6 },
    ],
  },
  {
    id: "m4",
    numero: 1,
    tipo: "balcao",
    itens: [{ id: "i7", nome: "Espetinho de Carne", qtd: 1, valor: 8 }],
  },
  {
    id: "m5",
    numero: 9,
    tipo: "pedido",
    itens: [],
  },
  {
    id: "m6",
    numero: 5,
    tipo: "entrega",
    itens: [{ id: "i8", nome: "Espetinho de Coração", qtd: 5, valor: 8 }],
  },
];

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PainelComandas({
  mesasIniciais = MESAS_INICIAIS,
  onAdicionarItem, // (mesaId, item) => void  — chame sua API aqui
  onRemoverItem, // (mesaId, itemId) => void  — chame sua API aqui
}) {
  const [mesas, setMesas] = useState(mesasIniciais);
  const [mesaAbertaId, setMesaAbertaId] = useState(null);
  const [nomeItem, setNomeItem] = useState("");
  const [qtdItem, setQtdItem] = useState(1);
  const [valorItem, setValorItem] = useState("");

  const mesaAberta = mesas.find((m) => m.id === mesaAbertaId) || null;

  function calcularTotal(itens) {
    return itens.reduce((soma, item) => soma + item.qtd * item.valor, 0);
  }

  function adicionarItem(mesaId, item) {
    const novoItem = { id: `it_${Date.now()}`, ...item };
    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaId ? { ...m, itens: [...m.itens, novoItem] } : m
      )
    );
    // INTEGRAÇÃO: avise o seu back-end que um item foi lançado nesta mesa
    onAdicionarItem?.(mesaId, novoItem);
  }

  function removerItem(mesaId, itemId) {
    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaId
          ? { ...m, itens: m.itens.filter((i) => i.id !== itemId) }
          : m
      )
    );
    // INTEGRAÇÃO: avise o seu back-end que um item foi removido desta mesa
    onRemoverItem?.(mesaId, itemId);
  }

  function handleAdicionarRapido(itemRapido) {
    if (!mesaAberta) return;
    adicionarItem(mesaAberta.id, { nome: itemRapido.nome, qtd: 1, valor: itemRapido.valor });
  }

  function handleAdicionarCustom(e) {
    e.preventDefault();
    if (!mesaAberta || !nomeItem.trim() || !valorItem) return;
    adicionarItem(mesaAberta.id, {
      nome: nomeItem.trim(),
      qtd: Math.max(1, Number(qtdItem) || 1),
      valor: Math.max(0, Number(valorItem) || 0),
    });
    setNomeItem("");
    setQtdItem(1);
    setValorItem("");
  }

  return (
    <div className="pc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500;700&family=Inter:wght@400;500;600;700&display=swap');

        .pc-root {
          --bg: #1c130c;
          --panel: #2b1d14;
          --panel-2: #382719;
          --border: #55402c;
          --text: #f2e6d6;
          --text-muted: #b7a48d;
          --paper: #ede0c8;
          --paper-line: #d6c39f;
          --ember: #d9662b;
          --ember-dark: #a8420f;

          font-family: 'Inter', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100%;
          padding: 28px;
          box-sizing: border-box;
          position: relative;
        }
        .pc-root *, .pc-root *::before, .pc-root *::after { box-sizing: border-box; }

        .pc-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pc-title {
          font-family: 'Roboto Slab', serif;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: -0.01em;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pc-title svg { color: var(--ember); }
        .pc-subtitle {
          color: var(--text-muted);
          font-size: 14px;
          margin: 0;
        }

        .pc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
          gap: 14px;
        }

        .pc-mesa-btn {
          position: relative;
          background: var(--panel-2);
          border: 1px solid var(--border);
          border-left: 4px solid var(--tipo-cor, var(--ember));
          border-radius: 6px;
          padding: 14px 12px 12px;
          cursor: pointer;
          text-align: left;
          color: var(--text);
          transition: transform 0.12s ease, border-color 0.12s ease, background 0.12s ease;
          aspect-ratio: 1 / 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .pc-mesa-btn:hover {
          transform: translateY(-2px);
          background: #40301f;
          border-color: #6d543a;
        }
        .pc-mesa-btn:active { transform: translateY(0); }
        .pc-mesa-btn:focus-visible {
          outline: 2px solid var(--ember);
          outline-offset: 2px;
        }

        .pc-mesa-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ember);
          box-shadow: 0 0 0 0 rgba(217,102,43,0.6);
          animation: pc-pulse 2s infinite;
        }
        @keyframes pc-pulse {
          0% { box-shadow: 0 0 0 0 rgba(217,102,43,0.55); }
          70% { box-shadow: 0 0 0 7px rgba(217,102,43,0); }
          100% { box-shadow: 0 0 0 0 rgba(217,102,43,0); }
        }

        .pc-mesa-numero {
          font-family: 'Roboto Slab', serif;
          font-weight: 700;
          font-size: 34px;
          line-height: 1;
        }
        .pc-mesa-numero-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: lowercase;
          margin-top: 2px;
        }

        .pc-mesa-tipo {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: var(--tipo-cor, var(--ember));
          margin-top: 8px;
        }
        .pc-mesa-tipo svg { width: 13px; height: 13px; }

        .pc-mesa-itens-count {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* --- Overlay + Comanda (drawer) --- */
        .pc-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 6, 3, 0.55);
          display: flex;
          justify-content: flex-end;
          z-index: 50;
        }

        .pc-comanda {
          width: min(400px, 100%);
          height: 100%;
          background: var(--paper);
          color: #2a2015;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 24px rgba(0,0,0,0.35);
          animation: pc-slide-in 0.22s ease-out;
        }
        @keyframes pc-slide-in {
          from { transform: translateX(24px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .pc-comanda-perfuracao {
          height: 10px;
          background-image: radial-gradient(circle, rgba(10,6,3,0.35) 2px, transparent 2px);
          background-size: 14px 10px;
          background-position: center;
        }

        .pc-comanda-header {
          padding: 18px 22px 14px;
          border-bottom: 1px dashed var(--paper-line);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .pc-comanda-numero {
          font-family: 'Roboto Slab', serif;
          font-weight: 700;
          font-size: 30px;
          line-height: 1;
        }
        .pc-comanda-tipo {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          margin-top: 6px;
          color: var(--tipo-cor);
        }
        .pc-comanda-tipo svg { width: 14px; height: 14px; }

        .pc-fechar-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #6b5b43;
          padding: 4px;
          border-radius: 4px;
        }
        .pc-fechar-btn:hover { background: rgba(0,0,0,0.06); color: #2a2015; }

        .pc-comanda-corpo {
          flex: 1;
          overflow-y: auto;
          padding: 16px 22px;
        }

        .pc-itens-lista {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pc-item-linha {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 0;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          font-size: 14px;
        }
        .pc-item-qtd {
          font-family: 'Roboto Slab', serif;
          font-weight: 700;
          font-size: 13px;
          color: #6b5b43;
          min-width: 22px;
        }
        .pc-item-nome { flex: 1; }
        .pc-item-subtotal {
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .pc-item-remover {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #a8420f;
          opacity: 0.55;
          padding: 3px;
          display: flex;
        }
        .pc-item-remover:hover { opacity: 1; }

        .pc-vazio {
          color: #8a795e;
          font-size: 13px;
          font-style: italic;
          padding: 18px 0;
          text-align: center;
        }

        .pc-total-linha {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 2px solid #2a2015;
        }
        .pc-total-label {
          font-size: 12px;
          text-transform: lowercase;
          color: #6b5b43;
        }
        .pc-total-valor {
          font-family: 'Roboto Slab', serif;
          font-weight: 700;
          font-size: 22px;
        }

        .pc-secao-titulo {
          font-size: 12px;
          font-weight: 700;
          color: #6b5b43;
          margin: 22px 0 10px;
        }

        .pc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .pc-chip {
          background: #fff8ea;
          border: 1px solid var(--paper-line);
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          color: #4a3a26;
          transition: background 0.12s ease, border-color 0.12s ease;
        }
        .pc-chip:hover { background: #ffedcf; border-color: var(--ember); }

        .pc-form {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pc-form input {
          font-family: inherit;
          font-size: 13px;
          border: 1px solid var(--paper-line);
          background: #fff8ea;
          border-radius: 5px;
          padding: 9px 10px;
          color: #2a2015;
        }
        .pc-form input:focus {
          outline: none;
          border-color: var(--ember);
        }
        .pc-input-nome { flex: 1 1 140px; min-width: 0; }
        .pc-input-qtd { width: 56px; }
        .pc-input-valor { width: 80px; }

        .pc-btn-adicionar {
          flex: 1 1 100%;
          margin-top: 4px;
          background: var(--ember);
          color: #fff8ea;
          border: none;
          border-radius: 5px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.12s ease;
        }
        .pc-btn-adicionar:hover { background: var(--ember-dark); }
        .pc-btn-adicionar:disabled {
          background: #cbb894;
          cursor: not-allowed;
        }
      `}</style>

      <header className="pc-header">
        <div>
          <h1 className="pc-title">
            <Flame size={24} />
            Comandas abertas
          </h1>
          <p className="pc-subtitle">Toque em uma mesa para ver o que foi lançado</p>
        </div>
      </header>

      <div className="pc-grid">
        {mesas.map((mesa) => {
          const tipo = TIPOS[mesa.tipo];
          const Icone = tipo.Icone;
          return (
            <button
              key={mesa.id}
              className="pc-mesa-btn"
              style={{ "--tipo-cor": tipo.cor }}
              onClick={() => setMesaAbertaId(mesa.id)}
            >
              <span className="pc-mesa-dot" aria-hidden="true" />
              <div>
                <div className="pc-mesa-numero">{mesa.numero}</div>
                <div className="pc-mesa-numero-label">mesa nº</div>
              </div>
              <div>
                <span className="pc-mesa-tipo">
                  <Icone />
                  {tipo.label}
                </span>
                <div className="pc-mesa-itens-count">
                  {mesa.itens.length === 0
                    ? "sem itens"
                    : `${mesa.itens.length} ${mesa.itens.length === 1 ? "item" : "itens"}`}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {mesaAberta && (
        <div className="pc-overlay" onClick={() => setMesaAbertaId(null)}>
          <div className="pc-comanda" onClick={(e) => e.stopPropagation()}>
            <div className="pc-comanda-perfuracao" />
            <div className="pc-comanda-header">
              <div>
                <div className="pc-comanda-numero">Mesa {mesaAberta.numero}</div>
                <span
                  className="pc-comanda-tipo"
                  style={{ "--tipo-cor": TIPOS[mesaAberta.tipo].cor }}
                >
                  {React.createElement(TIPOS[mesaAberta.tipo].Icone)}
                  {TIPOS[mesaAberta.tipo].label}
                </span>
              </div>
              <button
                className="pc-fechar-btn"
                onClick={() => setMesaAbertaId(null)}
                aria-label="Fechar comanda"
              >
                <X size={20} />
              </button>
            </div>

            <div className="pc-comanda-corpo">
              <div className="pc-itens-lista">
                {mesaAberta.itens.length === 0 ? (
                  <p className="pc-vazio">Nada lançado ainda nesta mesa</p>
                ) : (
                  mesaAberta.itens.map((item) => (
                    <div className="pc-item-linha" key={item.id}>
                      <span className="pc-item-qtd">{item.qtd}x</span>
                      <span className="pc-item-nome">{item.nome}</span>
                      <span className="pc-item-subtotal">
                        {formatarPreco(item.qtd * item.valor)}
                      </span>
                      <button
                        className="pc-item-remover"
                        onClick={() => removerItem(mesaAberta.id, item.id)}
                        aria-label={`Remover ${item.nome}`}
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {mesaAberta.itens.length > 0 && (
                <div className="pc-total-linha">
                  <span className="pc-total-label">total da comanda</span>
                  <span className="pc-total-valor">
                    {formatarPreco(calcularTotal(mesaAberta.itens))}
                  </span>
                </div>
              )}

              <p className="pc-secao-titulo">Adicionar ao pedido</p>

              <div className="pc-chips">
                {ITENS_RAPIDOS.map((ir) => (
                  <button
                    key={ir.nome}
                    className="pc-chip"
                    onClick={() => handleAdicionarRapido(ir)}
                  >
                    {ir.nome}
                  </button>
                ))}
              </div>

              <form className="pc-form" onSubmit={handleAdicionarCustom}>
                <input
                  className="pc-input-nome"
                  placeholder="Nome do item"
                  value={nomeItem}
                  onChange={(e) => setNomeItem(e.target.value)}
                />
                <input
                  className="pc-input-qtd"
                  type="number"
                  min="1"
                  placeholder="Qtd"
                  value={qtdItem}
                  onChange={(e) => setQtdItem(e.target.value)}
                />
                <input
                  className="pc-input-valor"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="R$"
                  value={valorItem}
                  onChange={(e) => setValorItem(e.target.value)}
                />
                <button
                  type="submit"
                  className="pc-btn-adicionar"
                  disabled={!nomeItem.trim() || !valorItem}
                >
                  <Plus size={15} />
                  Adicionar item
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
