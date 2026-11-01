
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load trained model and preprocessor
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(
    os.path.join(BASE_DIR, "../models/random_forest_model.pkl")
)

preprocessor = joblib.load(
    os.path.join(BASE_DIR, "../models/preprocessor.pkl")
)
cars_df = pd.read_csv(
    os.path.join(BASE_DIR, "../dataset/CAR DETAILS FROM CAR DEKHO.csv")
)

cars_df["brand"] = cars_df["name"].str.split().str[0]
cars_df["brand"] = cars_df["brand"].replace({"Land": "Land Rover"})


@app.route("/car-names", methods=["GET"])
def car_names():
    brand = request.args.get("brand")

    filtered_cars = cars_df[cars_df["brand"] == brand]

    names = sorted(filtered_cars["name"].dropna().unique().tolist())

    return jsonify(names)

@app.route("/", methods=["GET"])
def home():
    return "Used Car Price Prediction API is running!"

@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        car_data = pd.DataFrame([{
    "name": data["name"],
    "brand": data["brand"],
    "year": int(data["year"]),
    "km_driven": int(data["km_driven"]),
    "fuel": data["fuel"],
    "seller_type": data["seller_type"],
    "transmission": data["transmission"],
    "owner": data["owner"]
}])

        processed_data = preprocessor.transform(car_data)

        prediction = model.predict(processed_data)[0]

        return jsonify({
            "predicted_price": round(float(prediction), 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
