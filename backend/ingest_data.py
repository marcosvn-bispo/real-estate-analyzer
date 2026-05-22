import sqlite3
import pandas as pd
import numpy as np
import random

def generate_seattle_housing_data(n_samples=5000):
    np.random.seed(42)
    random.seed(42)
    
    # Seattle coordinates roughly
    lat_center = 47.6062
    lon_center = -122.3321
    
    data = []
    for i in range(n_samples):
        # Coordinates: Force longitude to be East of downtown to avoid Elliott Bay (Water)
        lat = lat_center + np.random.normal(0, 0.06)
        lon = lon_center + abs(np.random.normal(0, 0.06))
        
        # Features
        bedrooms = random.choices([1, 2, 3, 4, 5, 6], weights=[5, 20, 40, 25, 8, 2])[0]
        bathrooms = max(1, bedrooms - random.choice([0, 1, 1.5, -1]))
        sqft_living = max(500, int(np.random.normal(1500, 500) + (bedrooms * 200)))
        sqft_lot = max(1000, int(np.random.normal(5000, 2000)))
        year_built = min(2023, max(1900, int(np.random.normal(1980, 20))))
        condition = random.choices([1, 2, 3, 4, 5], weights=[1, 5, 50, 30, 14])[0]
        
        # Distance to center (influences price heavily)
        dist_to_center = np.sqrt((lat - lat_center)**2 + (lon - lon_center)**2)
        
        # Base price calculation
        base_price = 200000
        price = base_price + (sqft_living * 250) + (bedrooms * 10000) + (bathrooms * 15000)
        price += (condition * 20000)
        price -= (dist_to_center * 2000000) # Closer to center is more expensive
        
        # Add some noise
        price = max(150000, price + np.random.normal(0, 50000))
        
        data.append({
            'id': f'PROP-{10000+i}',
            'lat': lat,
            'lon': lon,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'sqft_living': sqft_living,
            'sqft_lot': sqft_lot,
            'year_built': year_built,
            'condition': condition,
            'price': int(price)
        })
        
    return pd.DataFrame(data)

def main():
    print("Generating synthetic King County housing data...")
    df = generate_seattle_housing_data(5000)
    
    print("Saving to SQLite database...")
    conn = sqlite3.connect('real_estate.db')
    df.to_sql('properties', conn, if_exists='replace', index=False)
    conn.close()
    
    print("Data ingestion complete!")

if __name__ == "__main__":
    main()
