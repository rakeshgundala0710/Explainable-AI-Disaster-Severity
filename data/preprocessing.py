"""
========================================================================================
DATA PREPROCESSING & FEATURE ENGINEERING PIPELINE
Validation, cleaning, missing-value handling, and feature extraction.
========================================================================================
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple

class DataPreprocessor:
    def __init__(self):
        # Feature column order for ML model consistency
        self.feature_columns = [
            "rainfall_intensity_mmh",
            "cumulative_24h_rain_mm",
            "water_level_m",
            "surge_rate_mh",
            "elevation_m",
            "population_density_norm",
            "soil_saturation_index"
        ]

    def clean_and_validate(self, df: pd.DataFrame) -> pd.DataFrame:
        """Cleans and validates incoming tabular disaster records."""
        data = df.copy()

        # 1. Coordinate range validation (Hyderabad bounds: 17.2 to 17.6 Lat, 78.2 to 78.7 Lon)
        if "latitude" in data.columns:
            data["latitude"] = data["latitude"].clip(17.0, 18.0)
        if "longitude" in data.columns:
            data["longitude"] = data["longitude"].clip(78.0, 79.0)

        # 2. Impute missing numericals with domain median
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        data[numeric_cols] = data[numeric_cols].fillna(data[numeric_cols].median())

        # 3. Clip negative values where impossible
        for col in ["rainfall_intensity_mmh", "cumulative_24h_rain_mm", "water_level_m", "population"]:
            if col in data.columns:
                data[col] = data[col].clip(lower=0.0)

        return data

    def extract_features(self, row_dict: Dict[str, Any]) -> np.ndarray:
        """
        Extracts and normalizes features for a single sector/zone observation for inference.
        Returns a 1D numpy array.
        """
        rainfall = float(row_dict.get("rainfall_intensity_mmh", 0.0))
        cumulative_rain = float(row_dict.get("cumulative_24h_rain_mm", 0.0))
        water_level = float(row_dict.get("water_level_m", 0.0))
        surge_rate = float(row_dict.get("surge_rate_mh", 0.0))
        elevation = float(row_dict.get("elevation_m", 515.0))
        pop = float(row_dict.get("population", 30000.0))
        vul_pop = float(row_dict.get("vulnerable_population", pop * 0.3))

        pop_density_norm = min(1.0, pop / 60000.0)
        soil_sat = min(1.0, cumulative_rain / 200.0)

        features = [
            rainfall,
            cumulative_rain,
            water_level,
            surge_rate,
            elevation,
            pop_density_norm,
            soil_sat
        ]
        return np.array(features, dtype=np.float32)

    def extract_batch_features(self, df: pd.DataFrame) -> np.ndarray:
        """Extracts batch features for training/evaluation."""
        clean_df = self.clean_and_validate(df)
        batch = [self.extract_features(row.to_dict()) for _, row in clean_df.iterrows()]
        return np.array(batch, dtype=np.float32)
