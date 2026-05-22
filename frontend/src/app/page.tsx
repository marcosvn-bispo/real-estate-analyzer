"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import PredictorForm from '@/components/PredictorForm';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import { Activity, DollarSign, TrendingUp, MapPin, Maximize } from 'lucide-react';

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, statsRes] = await Promise.all([
          axios.get('http://localhost:8001/api/properties?limit=150'),
          axios.get('http://localhost:8001/api/stats')
        ]);
        setProperties(propRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to load data. Is backend running?", err);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Activity /> Real Estate Analytics
          </h1>
        </div>

        <PredictorForm />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Header with Background */}
        <div className="dashboard-header">
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Análise de Imóveis</h2>
        </div>

        <div className="dashboard-body">
          {/* Top KPI Cards */}
          {stats && (
            <div className="kpi-row">
              <div className="kpi-card">
                <div className="kpi-icon-row">
                  <DollarSign className="kpi-icon" size={28} />
                  <div className="kpi-subtext">
                    <span className="kpi-trend positive">+5.2%</span>
                    <span>Vs. mês anterior</span>
                  </div>
                </div>
                <div className="kpi-value">${(stats.average_price / 1000).toFixed(0)}k</div>
                <div className="kpi-label">Preço Médio</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-row">
                  <Maximize className="kpi-icon" size={28} />
                  <div className="kpi-subtext">
                    <span className="kpi-trend positive">+1.1%</span>
                    <span>Vs. mês anterior</span>
                  </div>
                </div>
                <div className="kpi-value">{stats.average_sqft.toFixed(0)}</div>
                <div className="kpi-label">Área Média (sqft)</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-row">
                  <MapPin className="kpi-icon" size={28} />
                  <div className="kpi-subtext">
                    <span className="kpi-trend negative">-2.4%</span>
                    <span>Vs. mês anterior</span>
                  </div>
                </div>
                <div className="kpi-value">{properties.length > 0 ? 3295 : 0}</div>
                <div className="kpi-label">Imóveis Analisados</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-row">
                  <TrendingUp className="kpi-icon" size={28} />
                  <div className="kpi-subtext">
                    <span className="kpi-trend positive">+8.9%</span>
                    <span>Vs. ano anterior</span>
                  </div>
                </div>
                <div className="kpi-value">$1.7M</div>
                <div className="kpi-label">Volume Estimado</div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Preço de Venda</th>
                  <th>Área (sqft)</th>
                  <th>Quartos</th>
                  <th>Banheiros</th>
                  <th>Ano Construção</th>
                  <th>Conservação</th>
                </tr>
              </thead>
              <tbody>
                {properties.slice(0, 10).map((prop, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>#{String(prop.id).replace('PROP-', '')}</td>
                    <td style={{ fontWeight: 600, color: 'var(--foreground)' }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prop.price)}</td>
                    <td>{prop.sqft_living}</td>
                    <td>{prop.bedrooms}</td>
                    <td>{prop.bathrooms}</td>
                    <td>{prop.year_built}</td>
                    <td>
                      <span style={{ backgroundColor: prop.condition >= 4 ? 'var(--accent-green)' : '#e2e8f0', color: prop.condition >= 4 ? 'white' : 'var(--foreground)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {prop.condition} / 5
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Scatter Chart */}
            <div className="chart-card" style={{ height: '350px' }}>
              <h3 className="chart-title">Correlação: Área vs Preço</h3>
              <ResponsiveContainer width="100%" height="85%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis type="number" dataKey="sqft_living" name="Área Útil" unit=" sqft" stroke="var(--text-muted)" />
                  <YAxis type="number" dataKey="price" name="Preço" tickFormatter={(val) => `$${val/1000}k`} stroke="var(--text-muted)" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: any, name: any) => [name === 'Preço' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number) : value, name]} />
                  <Scatter name="Imóveis" data={properties} fill="var(--accent-green)" opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            {stats && (
              <div className="chart-card" style={{ height: '350px' }}>
                <h3 className="chart-title">Preço Médio por Número de Quartos</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={stats.prices_by_bedrooms} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="bedrooms" stroke="var(--text-muted)" />
                    <YAxis tickFormatter={(val) => `$${val/1000}k`} stroke="var(--text-muted)" />
                    <Tooltip formatter={(value: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)} />
                    <Bar dataKey="avg_price" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
