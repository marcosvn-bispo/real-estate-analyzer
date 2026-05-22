from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import joblib
import pandas as pd

app = FastAPI(title="Real Estate Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    bedrooms: int
    bathrooms: float
    sqft_living: int
    sqft_lot: int
    year_built: int
    condition: int
    lat: float
    lon: float

# Load model at startup
try:
    model = joblib.load('model.joblib')
except Exception as e:
    model = None
    print(f"Warning: Model not loaded. {e}")

@app.get("/api/properties")
def get_properties(limit: int = 500):
    conn = sqlite3.connect('real_estate.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM properties ORDER BY RANDOM() LIMIT {limit}")
    rows = cursor.fetchall()
    conn.close()
    
    properties = [dict(row) for row in rows]
    return properties

@app.get("/api/stats")
def get_stats():
    conn = sqlite3.connect('real_estate.db')
    df = pd.read_sql_query("SELECT * FROM properties", conn)
    conn.close()
    
    avg_price = float(df['price'].mean())
    avg_sqft = float(df['sqft_living'].mean())
    
    # Prices by condition
    condition_stats = df.groupby('condition')['price'].mean().reset_index()
    condition_stats = condition_stats.rename(columns={'price': 'avg_price'}).to_dict('records')
    
    # Prices by bedrooms
    bed_stats = df.groupby('bedrooms')['price'].mean().reset_index()
    bed_stats = bed_stats.rename(columns={'price': 'avg_price'}).to_dict('records')
    
    return {
        "total_properties": len(df),
        "average_price": avg_price,
        "average_sqft": avg_sqft,
        "prices_by_condition": condition_stats,
        "prices_by_bedrooms": bed_stats
    }

@app.post("/api/predict")
def predict_price(req: PredictRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")
        
    features = pd.DataFrame([{
        'bedrooms': req.bedrooms,
        'bathrooms': req.bathrooms,
        'sqft_living': req.sqft_living,
        'sqft_lot': req.sqft_lot,
        'year_built': req.year_built,
        'condition': req.condition,
        'lat': req.lat,
        'lon': req.lon
    }])
    
    predicted_price = float(model.predict(features)[0])
    
    return {
        "predicted_price": predicted_price
    }
