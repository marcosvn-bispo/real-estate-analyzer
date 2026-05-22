import sqlite3
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

def main():
    print("Loading data from SQLite...")
    conn = sqlite3.connect('real_estate.db')
    df = pd.read_sql_query("SELECT * FROM properties", conn)
    conn.close()
    
    features = ['bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot', 'year_built', 'condition', 'lat', 'lon']
    X = df[features]
    y = df['price']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f"Model trained! Mean Absolute Error: ${mae:.2f}")
    
    print("Saving model to model.joblib...")
    joblib.dump(model, 'model.joblib')

if __name__ == "__main__":
    main()
