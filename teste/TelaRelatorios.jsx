import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Wallet, Receipt, TrendingUp, Package, Flame } from "lucide-react";

/**
 * TelaRelatorios
 * ---------------------------------------------------------------
 * Tela de relatórios do restaurante, no mesmo tema visual do
 * PainelComandas (marrom / brasa).
 *
 * COMO INTEGRAR NO SEU PROJETO:
 * 1. npm install recharts lucide-react (se ainda não tiver)
 * 2. Copie este arquivo para src/components/TelaRelatorios.jsx
 * 3. Troque DADOS_MOCK pelos dados agregados que vêm da sua API,
 *    respeitando o mesmo formato (veja os comentários abaixo).
 * 4. Use a prop `dadosPorPeriodo` para injetar dados reais por período.
 * ---------------------------------------------------------------
 */

const CORES = {
  ember: "#d9662b",
  emberDark: "#a8420f",
  pedido: "#b8862e",
  entrega: "#c1440e",
  balcao: "#6f7a3d",
};

const TIPO_LABEL = { pedido: "Mesa", entrega: "Entrega", balcao: "Balcão" };

// Formato esperado por período: faturamentoPorDia, vendasPorTipo,
// itensMaisVendidos e comandasFechadas. Substitua pelos dados reais
// vindos da sua API (ex: GET /relatorios?periodo=hoje).
const DADOS_MOCK = {
  hoje: {
    comandasFechadas: 18,
    faturamentoPorDia: [{ rotulo: "Hoje", valor: 612 }],
    vendasPorTipo: [
      { tipo: "pedido", valor: 340 },
      { tipo: "entrega", valor: 190 },
      { tipo: "balcao", valor: 82 },
    ],
    itensMaisVendidos: [
      { nome: "Espetinho de Carne", qtd: 34, valor: 272 },
      { nome: "Espetinho de Frango", qtd: 21, valor: 147 },
      { nome: "Cerveja", qtd: 18, valor: 162 },
      { nome: "Farofa", qtd: 12, valor: 60 },
      { nome: "Espetinho de Queijo Coalho", qtd: 9, valor: 72 },
    ],
  },
  semana: {
    comandasFechadas: 126,
    faturamentoPorDia: [
      { rotulo: "Seg", valor: 480 },
      { rotulo: "Ter", valor: 520 },
      { rotulo: "Qua", valor: 460 },
      { rotulo: "Qui", valor: 610 },
      { rotulo: "Sex", valor: 890 },
      { rotulo: "Sáb", valor: 1040 },
      { rotulo: "Dom", valor: 780 },
    ],
    vendasPorTipo: [
      { tipo: "pedido", valor: 2600 },
      { tipo: "entrega", valor: 1450 },
      { tipo: "balcao", valor: 730 },
    ],
    itensMaisVendidos: [
      { nome: "Espetinho de Carne", qtd: 214, valor: 1712 },
      { nome: "Espetinho de Frango", qtd: 168, valor: 1176 },
      { nome: "Cerveja", qtd: 140, valor: 1260 },
      { nome: "Espetinho de Queijo Coalho", qtd: 96, valor: 768 },
      { nome: "Farofa", qtd: 88, valor: 440 },
    ],
  },
  mes: {
    comandasFechadas: 512,
    faturamentoPorDia: [
      { rotulo: "Sem 1", valor: 3200 },
      { rotulo: "Sem 2", valor: 3650 },
      { rotulo: "Sem 3", valor: 2980 },
      { rotulo: "Sem 4", valor: 4120 },
    ],
    vendasPorTipo: [
      { tipo: "pedido", valor: 10400 },
      { tipo: "entrega", valor: 5800 },
      { tipo: "balcao", valor: 2750 },
    ],
    itensMaisVendidos: [
      { nome: "Espetinho de Carne", qtd: 890, valor: 7120 },
      { nome: "Espetinho de Frango", qtd: 710, valor: 4970 },
      { nome: "Cerveja", qtd: 640, valor: 5760 },
      { nome: "Espetinho de Queijo Coalho", qtd: 405, valor: 3240 },
      { nome: "Farofa", qtd: 360, valor: 1800 },
    ],
  },
};

const PERIODOS = [
  { id: "hoje", label: "Hoje" },
  { id: "semana", label: "7 dias" },
  { id: "mes", label: "30 dias" },
];

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function TooltipGrafico({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="pc-tooltip">
      <div className="pc-tooltip-rotulo">{label}</div>
      <div className="pc-tooltip-valor">{formatarPreco(payload[0].value)}</div>
    </div>
  );
}

export default function TelaRelatorios({ dadosPorPeriodo = DADOS_MOCK }) {
  const [periodo, setPeriodo] = useState("semana");
  const dados = dadosPorPeriodo[periodo];

  const totalFaturado = useMemo(
    () => dados.vendasPorTipo.reduce((soma, v) => soma + v.valor, 0),
    [dados]
  );
  const ticketMedio = totalFaturado / (dados.comandasFechadas || 1);
  const itensVendidos = useMemo(
    () => dados.itensMaisVendidos.reduce((soma, i) => soma + i.qtd, 0),
    [dados]
  );
  const maiorQtd = dados.itensMaisVendidos[0]?.qtd || 1;

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
          --ember: #d9662b;
          --ember-dark: #a8420f;

          font-family: 'Inter', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100%;
          padding: 28px;
          box-sizing: border-box;
        }
        .pc-root *, .pc-root *::before, .pc-root *::after { box-sizing: border-box; }

        .pc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 14px;
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
          margin: 4px 0 0;
        }

        .pc-periodos {
          display: flex;
          gap: 6px;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 4px;
        }
        .pc-periodo-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.12s ease, color 0.12s ease;
        }
        .pc-periodo-btn:hover { color: var(--text); }
        .pc-periodo-btn.ativo {
          background: var(--ember);
          color: #fff8ea;
        }

        .pc-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }
        .pc-kpi-card {
          background: var(--panel-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px 18px;
        }
        .pc-kpi-topo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .pc-kpi-label {
          font-size: 12px;
          color: var(--text-muted);
        }
        .pc-kpi-icone {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(217, 102, 43, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ember);
        }
        .pc-kpi-icone svg { width: 15px; height: 15px; }
        .pc-kpi-valor {
          font-family: 'Roboto Slab', serif;
          font-weight: 700;
          font-size: 24px;
        }

        .pc-graficos {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        @media (max-width: 720px) {
          .pc-graficos { grid-template-columns: 1fr; }
        }

        .pc-painel {
          background: var(--panel-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 18px 18px 8px;
        }
        .pc-painel-titulo {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-muted);
          margin: 0 0 14px;
        }

        .pc-tooltip {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 8px 12px;
        }
        .pc-tooltip-rotulo {
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        .pc-tooltip-valor {
          font-family: 'Roboto Slab', serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--text);
        }

        .pc-legenda-tipos {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 6px;
        }
        .pc-legenda-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }
        .pc-legenda-cor {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .pc-legenda-nome { flex: 1; color: var(--text-muted); }
        .pc-legenda-valor { font-weight: 600; font-variant-numeric: tabular-nums; }

        .pc-ranking {
          background: var(--panel-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 18px 18px 6px;
        }
        .pc-ranking-linha {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid var(--border);
        }
        .pc-ranking-linha:last-child { border-bottom: none; }
        .pc-ranking-pos {
          font-family: 'Roboto Slab', serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--ember);
          width: 20px;
        }
        .pc-ranking-info { flex: 1; min-width: 0; }
        .pc-ranking-nome {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pc-ranking-barra-fundo {
          height: 4px;
          background: var(--border);
          border-radius: 2px;
          margin-top: 6px;
          overflow: hidden;
        }
        .pc-ranking-barra-preenchida {
          height: 100%;
          background: var(--ember);
          border-radius: 2px;
        }
        .pc-ranking-numeros {
          text-align: right;
          flex-shrink: 0;
        }
        .pc-ranking-qtd {
          font-size: 12px;
          color: var(--text-muted);
        }
        .pc-ranking-valor {
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <header className="pc-header">
        <div>
          <h1 className="pc-title">
            <Flame size={24} />
            Relatórios
          </h1>
          <p className="pc-subtitle">Desempenho de vendas do restaurante</p>
        </div>
        <div className="pc-periodos">
          {PERIODOS.map((p) => (
            <button
              key={p.id}
              className={`pc-periodo-btn ${periodo === p.id ? "ativo" : ""}`}
              onClick={() => setPeriodo(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>

      <div className="pc-kpis">
        <div className="pc-kpi-card">
          <div className="pc-kpi-topo">
            <span className="pc-kpi-label">Faturamento</span>
            <span className="pc-kpi-icone"><Wallet /></span>
          </div>
          <div className="pc-kpi-valor">{formatarPreco(totalFaturado)}</div>
        </div>
        <div className="pc-kpi-card">
          <div className="pc-kpi-topo">
            <span className="pc-kpi-label">Comandas fechadas</span>
            <span className="pc-kpi-icone"><Receipt /></span>
          </div>
          <div className="pc-kpi-valor">{dados.comandasFechadas}</div>
        </div>
        <div className="pc-kpi-card">
          <div className="pc-kpi-topo">
            <span className="pc-kpi-label">Ticket médio</span>
            <span className="pc-kpi-icone"><TrendingUp /></span>
          </div>
          <div className="pc-kpi-valor">{formatarPreco(ticketMedio)}</div>
        </div>
        <div className="pc-kpi-card">
          <div className="pc-kpi-topo">
            <span className="pc-kpi-label">Itens vendidos</span>
            <span className="pc-kpi-icone"><Package /></span>
          </div>
          <div className="pc-kpi-valor">{itensVendidos}</div>
        </div>
      </div>

      <div className="pc-graficos">
        <div className="pc-painel">
          <p className="pc-painel-titulo">Faturamento no período</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dados.faturamentoPorDia} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#55402c" vertical={false} />
              <XAxis
                dataKey="rotulo"
                stroke="#b7a48d"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#55402c" }}
              />
              <YAxis
                stroke="#b7a48d"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip content={<TooltipGrafico />} cursor={{ fill: "rgba(217,102,43,0.08)" }} />
              <Bar dataKey="valor" fill="#d9662b" radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pc-painel">
          <p className="pc-painel-titulo">Vendas por tipo</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={dados.vendasPorTipo}
                dataKey="valor"
                nameKey="tipo"
                innerRadius={44}
                outerRadius={68}
                paddingAngle={3}
                stroke="none"
              >
                {dados.vendasPorTipo.map((v) => (
                  <Cell key={v.tipo} fill={CORES[v.tipo]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="pc-tooltip">
                      <div className="pc-tooltip-rotulo">{TIPO_LABEL[payload[0].payload.tipo]}</div>
                      <div className="pc-tooltip-valor">{formatarPreco(payload[0].value)}</div>
                    </div>
                  ) : null
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pc-legenda-tipos">
            {dados.vendasPorTipo.map((v) => (
              <div className="pc-legenda-item" key={v.tipo}>
                <span className="pc-legenda-cor" style={{ background: CORES[v.tipo] }} />
                <span className="pc-legenda-nome">{TIPO_LABEL[v.tipo]}</span>
                <span className="pc-legenda-valor">{formatarPreco(v.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pc-ranking">
        <p className="pc-painel-titulo">Itens mais vendidos</p>
        {dados.itensMaisVendidos.map((item, i) => (
          <div className="pc-ranking-linha" key={item.nome}>
            <span className="pc-ranking-pos">{i + 1}º</span>
            <div className="pc-ranking-info">
              <div className="pc-ranking-nome">{item.nome}</div>
              <div className="pc-ranking-barra-fundo">
                <div
                  className="pc-ranking-barra-preenchida"
                  style={{ width: `${(item.qtd / maiorQtd) * 100}%` }}
                />
              </div>
            </div>
            <div className="pc-ranking-numeros">
              <div className="pc-ranking-valor">{formatarPreco(item.valor)}</div>
              <div className="pc-ranking-qtd">{item.qtd} un.</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
