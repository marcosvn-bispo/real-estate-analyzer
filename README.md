# Real Estate Analytics

Um dashboard moderno e full-stack de análise imobiliária com previsões de preço baseadas em Machine Learning.

## 🚀 Visão Geral

Este projeto oferece um painel avançado para a análise do mercado imobiliário de Seattle. Ele possui uma interface limpa e moderna construída com Next.js e um backend poderoso construído com Python e FastAPI. O projeto utiliza Machine Learning para prever o valor dos imóveis com base em diversas características, como metragem quadrada, número de quartos/banheiros e localização.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js, React, Recharts, CSS (Modern Flat UI - Tema Slate & Blue)
- **Backend:** FastAPI, Python, SQLite, Pandas
- **Machine Learning:** Scikit-Learn (Joblib)

## 📦 Estrutura do Projeto

```text
real-estate-analyzer/
├── backend/          # Servidor FastAPI, Modelo de ML, Geração de dados
└── frontend/         # Aplicação Web em Next.js
```

## ⚙️ Como Rodar Localmente

### 1. Configuração do Backend

Abra um terminal e configure a API em Python:

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Ou `source venv/bin/activate` no Mac/Linux
pip install fastapi uvicorn pandas scikit-learn joblib

# Gere o banco de dados sintético
python ingest_data.py  

# Treine o modelo de Machine Learning
python train_model.py  

# Inicie o servidor da API
uvicorn main:app --reload
```
A API estará rodando em `http://localhost:8000`.

### 2. Configuração do Frontend

Em um terminal separado, instale as dependências e rode a aplicação Next.js:

```bash
cd frontend
npm install
npm run dev
```
A aplicação web estará acessível em `http://localhost:3000`.

## 🎨 Design

O dashboard utiliza a paleta corporativa "Slate & Blue", com gráficos de alto contraste, painéis (cards) brancos com sombreamento suave e leitura fluida de dados.
