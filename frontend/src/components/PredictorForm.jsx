"use client";

import { useState } from 'react';
import axios from 'axios';
import { Calculator, Home } from 'lucide-react';

const PredictorForm = () => {
  const [formData, setFormData] = useState({
    bedrooms: 3,
    bathrooms: 2,
    sqft_living: 1800,
    sqft_lot: 5000,
    year_built: 2000,
    condition: 3,
    lat: 47.6062,
    lon: -122.3321
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8001/api/predict', formData);
      setPrediction(res.data.predicted_price);
    } catch (err) {
      console.error(err);
      alert('Erro ao prever preço. Verifique se o backend está rodando e o modelo foi treinado.');
    }
    setLoading(false);
  };

  return (
    <div className="dark-form">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Calculator color="var(--accent-primary)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Simulador de Valor</h2>
      </div>
      
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted-dark)', marginBottom: '20px' }}>
        Insira as características do imóvel para estimar seu valor de mercado.
      </p>

      <form onSubmit={handlePredict}>
        <div className="stats-grid">
          <div className="input-group">
            <label className="input-label">Quartos</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="input-field" min="1" max="10" />
          </div>
          <div className="input-group">
            <label className="input-label">Banheiros</label>
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="input-field" min="1" step="0.5" />
          </div>
        </div>

        <div className="stats-grid">
          <div className="input-group">
            <label className="input-label">Área Útil (sqft)</label>
            <input type="number" name="sqft_living" value={formData.sqft_living} onChange={handleChange} className="input-field" step="100" />
          </div>
          <div className="input-group">
            <label className="input-label">Ano Construção</label>
            <input type="number" name="year_built" value={formData.year_built} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Estado de Conservação (1 a 5)</label>
          <input type="range" name="condition" value={formData.condition} onChange={handleChange} className="input-field" min="1" max="5" style={{ padding: 0 }} />
          <div style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>{formData.condition}</div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Calculando...' : 'Prever Preço de Venda'}
        </button>
      </form>

      {prediction && (
        <div className="predicted-price-box">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Home size={20} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted-dark)', fontWeight: 600 }}>VALOR DE MERCADO</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prediction)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictorForm;
