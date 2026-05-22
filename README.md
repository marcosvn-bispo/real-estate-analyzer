# Real Estate Analytics

A modern, full-stack real estate analytics dashboard with ML-powered price predictions.

## 🚀 Overview

This project provides an advanced dashboard for analyzing the Seattle housing market. It features a modern, clean UI built with Next.js and a powerful backend built with Python & FastAPI. It utilizes Machine Learning to predict property prices based on various features like square footage, number of bedrooms/bathrooms, and location.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Recharts, CSS (Modern Flat UI - Slate & Blue)
- **Backend:** FastAPI, Python, SQLite, Pandas
- **Machine Learning:** Scikit-Learn (Joblib)

## 📦 Project Structure

```text
real-estate-analyzer/
├── backend/          # FastAPI server, ML model, data ingestion
└── frontend/         # Next.js web application
```

## ⚙️ How to Run Locally

### 1. Backend Setup

Open a terminal and set up the Python API:

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Or `source venv/bin/activate` on Mac/Linux
pip install fastapi uvicorn pandas scikit-learn joblib

# Generate the synthetic database
python ingest_data.py  

# Train the ML model
python train_model.py  

# Run the API server
uvicorn main:app --reload
```
The API will be running at `http://localhost:8000`.

### 2. Frontend Setup

In a separate terminal, install the dependencies and run the Next.js app:

```bash
cd frontend
npm install
npm run dev
```
The web application will be accessible at `http://localhost:3000`.

## 🎨 Design

The dashboard utilizes a clean "Slate & Blue" professional color palette with high-contrast, easy-to-read charts, solid white KPI cards, and custom CSS variables for easy theming.
