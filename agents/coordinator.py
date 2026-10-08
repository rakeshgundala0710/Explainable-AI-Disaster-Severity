"""
========================================================================================
MULTI-AGENT DISASTER EMERGENCY ORCHESTRATION ENGINE
Coordinates specialized agents: WeatherAgent, MLAgent, XaiAgent, ResourceAgent, RagAgent.
========================================================================================
"""

from typing import Dict, Any, List
from data.ingestion import TelemetryIngestionService
from data.preprocessing import DataPreprocessor
from ml.models import SeverityPredictor
from xai.explainer import DisasterXaiExplainer
from optimization.solver import EmergencyResourceOptimizer
from rag.retriever import DisasterRagRetriever

class MultiAgentOrchestrator:
    def __init__(self):
        self.weather_agent = TelemetryIngestionService()
        self.preprocessor = DataPreprocessor()
        self.ml_agent = SeverityPredictor()
        self.xai_agent = DisasterXaiExplainer()
        self.resource_agent = EmergencyResourceOptimizer()
        self.rag_agent = DisasterRagRetriever()

    def process_sector_pipeline(self, sector_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes end-to-end agentic workflow for an individual municipal sector:
        Weather/Sensor -> Preprocess -> ML Predict -> XAI Explain -> Resource Optimize -> RAG Guidance.
        """
        # 1. Feature Preprocessing
        features = self.preprocessor.extract_features(sector_data)

        # 2. ML Severity Prediction
        prediction = self.ml_agent.predict(features)
        pred_severity = prediction["predicted_class"]

        # 3. Explainable AI Diagnosis
        xai_report = self.xai_agent.explain_local_instance(features, pred_severity)

        # 4. Resource Requirement Optimization
        single_zone_input = [{
            "id": sector_data.get("zone_id", "ZONE-01"),
            "name": sector_data.get("zone_name", "Target Sector"),
            "severity": pred_severity,
            "demand": {
                "boats": pred_severity * 2 + 1,
                "teams": max(1, int(pred_severity * 0.8))
            }
        }]
        allocations = self.resource_agent.solve_allocation(single_zone_input)

        # 5. RAG Guidance Retrieval
        rag_guidance = self.rag_agent.query(f"What is the flood SOP for severity {pred_severity}?")

        return {
            "sector_name": sector_data.get("zone_name"),
            "predicted_severity": pred_severity,
            "severity_label": prediction["severity_label"],
            "confidence": prediction["confidence"],
            "xai_top_drivers": xai_report["attributions"][:3],
            "xai_diagnosis": xai_report["natural_language_explanation"],
            "resource_allocation": allocations["allocations"][0],
            "statutory_citations": rag_guidance["citations"],
            "workflow_status": "AGENTIC_EXECUTION_COMPLETE"
        }
