"""
========================================================================================
MODEL TRAINING & COMPARATIVE BENCHMARKING SUITE
Evaluates Logistic Regression, CART Decision Tree, Random Forest, and XGBoost.
========================================================================================
"""

import numpy as np
import pandas as pd
from typing import Dict, Any
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def generate_synthetic_training_data(n_samples: int = 1200) -> Tuple_Data:
    """Generates physically consistent synthetic dataset for Hyderabad flood training."""
    np.random.seed(42)
    # Features: [rainfall_intensity, cumulative_rain, water_level, surge_rate, elevation, pop_density, soil_sat]
    rain = np.random.uniform(5.0, 140.0, n_samples)
    cum_rain = rain * np.random.uniform(1.2, 2.2, n_samples)
    surge = np.maximum(0.0, (rain - 30.0) / 45.0 + np.random.normal(0, 0.1, n_samples))
    water = np.maximum(0.1, surge * 1.5 + np.random.normal(0, 0.15, n_samples))
    elev = np.random.uniform(495.0, 580.0, n_samples)
    pop_norm = np.random.uniform(0.1, 1.0, n_samples)
    soil_sat = np.clip(cum_rain / 220.0, 0.1, 1.0)

    X = np.column_stack([rain, cum_rain, water, surge, elev, pop_norm, soil_sat])

    # True severity class heuristic
    score = (rain / 25.0) + (water * 1.2) + (surge * 0.8) - ((elev - 500.0) / 40.0)
    y = np.zeros(n_samples, dtype=int)
    y[score > 1.5] = 1 # Low
    y[score > 3.0] = 2 # Moderate
    y[score > 5.0] = 3 # Severe
    y[score > 7.5] = 4 # Critical

    return X, y

Tuple_Data = Any

def train_and_benchmark() -> Dict[str, Any]:
    X, y = generate_synthetic_training_data(1500)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    models = {
        "Logistic Regression": LogisticRegression(max_iter=500),
        "Decision Tree (CART)": DecisionTreeClassifier(max_depth=6, random_state=42),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    }

    try:
        from xgboost import XGBClassifier
        models["XGBoost Classifier"] = XGBClassifier(n_estimators=100, max_depth=5, random_state=42, eval_metric="mlogloss")
    except ImportError:
        pass

    results = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
        rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
        f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)

        results[name] = {
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "macro_f1": round(float(f1), 4),
            "confusion_matrix": confusion_matrix(y_test, y_pred).tolist()
        }

    return results

if __name__ == "__main__":
    benchmark_report = train_and_benchmark()
    print("Multi-Model Comparative Evaluation:")
    for model_name, metrics in benchmark_report.items():
        print(f"[{model_name}] Accuracy: {metrics['accuracy']*100:.1f}%, Macro F1: {metrics['macro_f1']:.3f}, Recall: {metrics['recall']:.3f}")
