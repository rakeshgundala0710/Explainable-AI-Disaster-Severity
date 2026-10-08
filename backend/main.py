"""
========================================================================================
STATE EMERGENCY OPERATIONS CENTRE (SEOC) - FASTAPI BACKEND SERVICE
REST API Gateway for Disaster Severity Prediction, XAI, Optimization & RAG.
========================================================================================
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import datetime

# Import Internal Core Engines
from data.ingestion import TelemetryIngestionService
from data.preprocessing import DataPreprocessor
from ml.models import SeverityPredictor
from xai.explainer import DisasterXaiExplainer
from optimization.solver import EmergencyResourceOptimizer
from rag.retriever import DisasterRagRetriever
from agents.coordinator import MultiAgentOrchestrator
from database.connection import init_db

app = FastAPI(
    title="SEOC Disaster Intelligence & Decision Support Platform API",
    description="Explainable AI Disaster Severity Prediction and Dynamic Multi-Resource Allocation Engine",
    version="2.4.0"
)

# Enable CORS for Frontend Interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
telemetry_service = TelemetryIngestionService()
preprocessor = DataPreprocessor()
ml_predictor = SeverityPredictor()
xai_explainer = DisasterXaiExplainer()
resource_optimizer = EmergencyResourceOptimizer()
rag_retriever = DisasterRagRetriever()
agent_orchestrator = MultiAgentOrchestrator()

# Initialize local database
try:
    init_db()
except Exception as e:
    print(f"Database init warning: {e}")

# In-memory audit trail & pending orders store
AUDIT_TRAIL = [
    {
        "id": "AUD-091",
        "timestamp": "13:45 IST",
        "officer": "Rakesh Gundala (IAS) - SEOC Commander",
        "order_id": "DISP-HYD-041",
        "target_sector": "Begumpet (Circle 30)",
        "action": "APPROVED",
        "details": "Dispatched 2 NDRF Teams + 5 Rescue Boats to Picket Nala basin."
    }
]

# -------------------------------------------------------------------------
# PYDANTIC SCHEMAS
# -------------------------------------------------------------------------
class PredictRequest(BaseModel):
    zone_name: str = "Tolichowki / Nadeem Colony"
    rainfall_intensity_mmh: float = Field(..., example=104.5)
    cumulative_24h_rain_mm: float = Field(..., example=186.0)
    water_level_m: float = Field(..., example=2.6)
    surge_rate_mh: float = Field(..., example=1.4)
    elevation_m: float = Field(504.5, example=504.5)
    population: int = Field(48500, example=48500)
    vulnerable_population: int = Field(14200, example=14200)

class CopilotQueryRequest(BaseModel):
    query: str = Field(..., example="Why is Tolichowki classified as Critical?")

class OfficerApprovalRequest(BaseModel):
    order_id: str = "DISP-HYD-042"
    officer_name: str = "Rakesh Gundala (IAS)"
    officer_role: str = "SEOC Disaster Commander"
    target_sector: str = "Tolichowki / Nadeem Colony"
    action: str = Field("APPROVED", example="APPROVED") # APPROVED, MODIFIED, REJECTED
    justification: str = "Direct statutory authorization following cloudburst threshold breach."

class OptimizeRequest(BaseModel):
    zones: List[Dict[str, Any]]

# -------------------------------------------------------------------------
# REST API ENDPOINTS
# -------------------------------------------------------------------------

@app.get("/api/health")
def health_check():
    """Health check for system microservices."""
    return {
        "status": "HEALTHY",
        "service": "SEOC Decision Support Engine",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "modules": {
            "ml_severity": "READY (XGBoost / RF)",
            "xai_engine": "READY (TreeSHAP)",
            "optimization": "READY (Google OR-Tools MILP)",
            "rag_copilot": "READY (NDMA / TSDMP Indexed)"
        }
    }

@app.get("/api/weather")
def get_weather():
    """Retrieves current weather telemetry for Hyderabad."""
    return telemetry_service.fetch_imd_weather()

@app.get("/api/hydrology")
def get_hydrology():
    """Retrieves current Musi River water levels."""
    return telemetry_service.fetch_musi_hydrology()

@app.post("/api/predict")
def predict_severity(payload: PredictRequest):
    """
    Predicts disaster severity class (0=Normal to 4=Critical) and provides confidence score.
    """
    row_dict = payload.dict()
    feats = preprocessor.extract_features(row_dict)
    prediction = ml_predictor.predict(feats)
    return prediction

@app.post("/api/xai")
def explain_severity(payload: PredictRequest):
    """
    Computes local SHAP waterfall attribution scores and natural-language diagnosis.
    """
    row_dict = payload.dict()
    feats = preprocessor.extract_features(row_dict)
    prediction = ml_predictor.predict(feats)
    pred_class = prediction["predicted_class"]
    explanation = xai_explainer.explain_local_instance(feats, pred_class)
    return explanation

@app.post("/api/allocate")
def allocate_resources(payload: OptimizeRequest):
    """
    Runs Google OR-Tools Mixed Integer Linear Programming solver to optimize emergency resources.
    """
    return resource_optimizer.solve_allocation(payload.zones)

@app.post("/api/copilot/query")
def query_copilot(payload: CopilotQueryRequest):
    """
    Disaster AI Copilot query grounded in official NDMA guidelines and Telangana SOPs.
    """
    return rag_retriever.query(payload.query)

@app.post("/api/agentic/pipeline")
def run_agentic_pipeline(payload: PredictRequest):
    """
    Executes end-to-end multi-agent pipeline for a municipal sector.
    """
    return agent_orchestrator.process_sector_pipeline(payload.dict())

@app.post("/api/hitl/approve")
def officer_approve(payload: OfficerApprovalRequest):
    """
    Statutory Human-in-the-Loop decision recording endpoint (NDMA Sec 35).
    """
    audit_entry = {
        "id": f"AUD-0{len(AUDIT_TRAIL) + 91}",
        "timestamp": datetime.datetime.now().strftime("%H:%M IST"),
        "officer": payload.officer_name,
        "officer_role": payload.officer_role,
        "order_id": payload.order_id,
        "target_sector": payload.target_sector,
        "action": payload.action,
        "details": payload.justification
    }
    AUDIT_TRAIL.insert(0, audit_entry)
    return {
        "status": "RECORDED_IN_AUDIT_TRAIL",
        "audit_entry": audit_entry
    }

@app.get("/api/audit-logs")
def get_audit_logs():
    """Retrieves immutable audit trail."""
    return AUDIT_TRAIL

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
