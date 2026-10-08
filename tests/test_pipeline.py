"""
========================================================================================
AUTOMATED UNIT & INTEGRATION TEST SUITE
Tests preprocessing, ML prediction, XAI attributions, OR-Tools solver, and RAG retrieval.
========================================================================================
"""

import pytest
import numpy as np
from data.preprocessing import DataPreprocessor
from ml.models import SeverityPredictor
from xai.explainer import DisasterXaiExplainer
from optimization.solver import EmergencyResourceOptimizer
from rag.retriever import DisasterRagRetriever

def test_data_preprocessor():
    preprocessor = DataPreprocessor()
    sample_sector = {
        "rainfall_intensity_mmh": 104.5,
        "cumulative_24h_rain_mm": 186.0,
        "water_level_m": 2.6,
        "surge_rate_mh": 1.4,
        "elevation_m": 504.5,
        "population": 48500,
        "vulnerable_population": 14200
    }
    features = preprocessor.extract_features(sample_sector)
    assert isinstance(features, np.ndarray)
    assert len(features) == 7
    assert features[0] == 104.5

def test_ml_severity_prediction():
    predictor = SeverityPredictor()
    dummy_feats = np.array([104.5, 186.0, 2.6, 1.4, 504.5, 0.8, 0.9])
    res = predictor.predict(dummy_feats)
    assert "predicted_class" in res
    assert res["predicted_class"] in [0, 1, 2, 3, 4]
    assert 0.0 <= res["confidence"] <= 1.0

def test_xai_attribution():
    explainer = DisasterXaiExplainer()
    dummy_feats = np.array([104.5, 186.0, 2.6, 1.4, 504.5, 0.8, 0.9])
    explanation = explainer.explain_local_instance(dummy_feats, predicted_class=4)
    assert "attributions" in explanation
    assert len(explanation["attributions"]) > 0
    assert "natural_language_explanation" in explanation
    assert "Rainfall Intensity" in explanation["natural_language_explanation"]

def test_or_tools_optimization():
    optimizer = EmergencyResourceOptimizer()
    sample_zones = [
        {"id": "ZONE-01", "name": "Tolichowki", "severity": 4, "demand": {"boats": 8}},
        {"id": "ZONE-02", "name": "Begumpet", "severity": 3, "demand": {"boats": 4}}
    ]
    result = optimizer.solve_allocation(sample_zones)
    assert result["solver_status"] in ["OPTIMAL", "HEURISTIC_OPTIMAL"]
    assert len(result["allocations"]) == 2
    # Verify non-negative allocations
    for alloc in result["allocations"]:
        assert alloc["allocated"]["rescue_boats"] >= 0

def test_rag_retrieval():
    retriever = DisasterRagRetriever()
    result = retriever.query("What is the flood SOP for Musi river?")
    assert result["grounded"] is True
    assert len(result["citations"]) > 0
    assert any(term in result["citations"][0] for term in ["TSDMP", "TSDMA", "NDMA"])

def test_rag_out_of_domain():
    retriever = DisasterRagRetriever()
    result = retriever.query("What is the capital of France?")
    assert result["grounded"] is False
    assert "not found" in result["answer"].lower()
