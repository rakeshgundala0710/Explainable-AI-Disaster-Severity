"""
========================================================================================
STATE EMERGENCY OPERATIONS CENTRE (SEOC) - TELANGANA
"Explainable AI-Based Disaster Severity Prediction and Dynamic Multi-Resource Allocation"
Academic Prototype - Streamlit Command Dashboard
========================================================================================
"""

import streamlit as st
import pandas as pd
import numpy as np
import datetime
import json
import os

# Page Configuration
st.set_page_config(
    page_title="SEOC Telangana - Disaster Severity & Resource Allocation",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Command Center Dark Theme
st.markdown("""
<style>
    .stApp {
        background-color: #0a0e17;
        color: #f8fafc;
    }
    .metric-card {
        background: rgba(26, 34, 52, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
    }
    .critical-badge {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: bold;
        font-size: 0.8rem;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar: Simulation & Officer Profile
st.sidebar.title("🏛️ SEOC TELANGANA")
st.sidebar.markdown("**Decision Support Command Console**")
st.sidebar.caption("Hyderabad Urban Flood Management Division")

st.sidebar.divider()
st.sidebar.subheader("🕹️ Emergency Simulation Control")
sim_stage = st.sidebar.select_slider(
    "Disaster Progression Stage",
    options=[
        "Stage 1: Baseline Normal",
        "Stage 2: Heavy Rain Watch",
        "Stage 3: Waterlogging Sluice Surge",
        "Stage 4: Musi Flash River Overflow",
        "Stage 5: Catastrophic Inundation"
    ],
    value="Stage 4: Musi Flash River Overflow"
)

st.sidebar.divider()
st.sidebar.subheader("👤 Officer on Duty")
st.sidebar.markdown("**Rakesh Gundala (IAS)**")
st.sidebar.caption("SEOC State Disaster Commander | ID: TS-IAS-094")
st.sidebar.info("Statutory Compliance: NDMA Sec 35 Active")

# Main Header
col_header_1, col_header_2 = st.columns([3, 1])
with col_header_1:
    st.title("State Emergency Operations Centre (SEOC)")
    st.markdown("### Explainable AI Disaster Severity & Dynamic Resource Allocation Platform")
    st.caption("Pilot Study: Hyderabad Urban Flood Risk Management (GHMC & Musi River Basin)")

with col_header_2:
    st.metric(label="Threat Status", value="CRITICAL", delta="Level 4 - Red Alert", delta_color="inverse")
    st.caption(f"Timestamp: {datetime.datetime.now().strftime('%H:%M:%S IST | %d-%b-%Y')}")

# Top KPI Ribbon
kpi1, kpi2, kpi3, kpi4, kpi5 = st.columns(5)
with kpi1:
    st.metric(label="Rainfall Intensity", value="104.5 mm/h", delta="+22mm/h (Surge)")
with kpi2:
    st.metric(label="Musi Gauge Level", value="515.1 m MSL", delta="+1.1m (Above Danger)", delta_color="inverse")
with kpi3:
    st.metric(label="Critical Sectors", value="4 Zones", delta="Tolichowki, Moosarambagh...")
with kpi4:
    st.metric(label="At-Risk Population", value="142,000", delta="Evac: 14,050")
with kpi5:
    st.metric(label="OR-Tools Boats Deployed", value="27 / 31", delta="87% Fulfilled")

st.divider()

# Sidebar Dataset Uploader
st.sidebar.divider()
st.sidebar.subheader("📁 Upload Custom Dataset")
uploaded_file = st.sidebar.file_uploader("Upload Disaster CSV Dataset", type=["csv"])

# Default Hyderabad Data
default_zones_dict = {
    "Zone": ["Tolichowki", "Moosarambagh", "Begumpet", "Alwal", "Nizampet", "Khairatabad", "Gachibowli"],
    "lat": [17.3984, 17.3713, 17.4447, 17.5022, 17.5186, 17.4116, 17.4401],
    "lon": [78.4144, 78.4983, 78.4664, 78.5085, 78.3748, 78.4608, 78.3489],
    "Severity": [4, 4, 3, 3, 2, 2, 1],
    "WaterLevel_m": [2.6, 3.2, 1.8, 1.5, 0.8, 0.7, 0.2]
}
df_zones = pd.DataFrame(default_zones_dict)

if uploaded_file is not None:
    try:
        user_df = pd.read_csv(uploaded_file)
        st.sidebar.success(f"✓ Loaded {len(user_df)} rows from {uploaded_file.name}")
        # Map common column names if present
        lat_col = next((c for c in user_df.columns if c.lower() in ['latitude', 'lat']), None)
        lon_col = next((c for c in user_df.columns if c.lower() in ['longitude', 'lon', 'lng']), None)
        name_col = next((c for c in user_df.columns if c.lower() in ['zone_name', 'zone', 'name']), None)
        sev_col = next((c for c in user_df.columns if c.lower() in ['severity_class', 'severity']), None)
        water_col = next((c for c in user_df.columns if c.lower() in ['water_level_m', 'water_level']), None)

        if lat_col and lon_col:
            df_zones = pd.DataFrame({
                "Zone": user_df[name_col] if name_col else [f"Zone {i+1}" for i in range(len(user_df))],
                "lat": user_df[lat_col].astype(float),
                "lon": user_df[lon_col].astype(float),
                "Severity": user_df[sev_col].astype(int) if sev_col else [3]*len(user_df),
                "WaterLevel_m": user_df[water_col].astype(float) if water_col else [1.5]*len(user_df)
            })
    except Exception as e:
        st.sidebar.error(f"Error parsing CSV: {e}")

# Navigation Tabs
tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8 = st.tabs([
    "🏢 War Room & Map",
    "🤖 Severity & LSTM",
    "🔍 Explainable AI (SHAP)",
    "⚖️ Resource Optimization",
    "🛡️ Officer Approval (HITL)",
    "💬 RAG AI Copilot",
    "📄 Situation Report (SitRep)",
    "📁 Dataset Explorer"
])

# -------------------------------------------------------------------------
# TAB 1: WAR ROOM & MAP
# -------------------------------------------------------------------------
with tab1:
    st.subheader("Hyderabad Flood Vulnerability & Resource Dispatch")
    
    col_map_left, col_map_right = st.columns([2, 1])
    
    with col_map_left:
        st.map(df_zones, latitude='lat', longitude='lon', size="Severity")
        st.caption("Map displays flood zones sized by severity rating. (For full interactive WebGIS, view dashboard/index.html)")

    with col_map_right:
        st.markdown("#### High-Risk Sector Telemetry")
        st.dataframe(
            df_zones[["Zone", "Severity", "WaterLevel_m"]],
            column_config={
                "Severity": st.column_config.ProgressColumn(
                    "Severity Level (0-4)",
                    help="Severity rating from Normal (0) to Critical (4)",
                    format="%d",
                    min_value=0,
                    max_value=4
                )
            },
            hide_index=True,
            use_container_width=True
        )
        
        st.warning("⚠️ **Moosarambagh Causeway:** Submerged by 2.2m. Traffic diverted via Chaitanyapuri High-Level bridge.")

# -------------------------------------------------------------------------
# TAB 2: SEVERITY PREDICTION & LSTM
# -------------------------------------------------------------------------
with tab2:
    st.subheader("Machine Learning & Deep Learning Severity Forecasting")
    
    col_ml_1, col_ml_2 = st.columns(2)
    with col_ml_1:
        st.markdown("#### Supervised Multi-Class Classifier (XGBoost)")
        st.metric(label="Predicted Severity Class", value="Level 4: CRITICAL", delta="Confidence: 94.6%")
        
        feat_df = pd.DataFrame({
            "Sensory Variable": ["Rainfall Intensity", "Cumulative 24h Rain", "Musi Gauge Level", "Surge Velocity", "Soil Moisture", "Elevation"],
            "Observed": ["104.5 mm/h", "186.0 mm", "515.1 m MSL", "+1.8 m/h", "94.0%", "498.2 m MSL"],
            "Z-Score Normalization": [3.42, 2.85, 3.12, 2.94, 2.10, -2.45]
        })
        st.dataframe(feat_df, hide_index=True, use_container_width=True)

    with col_ml_2:
        st.markdown("#### 24-Hour Deep Bi-LSTM Time-Series Projection")
        hours = [f"T{i}h" for i in range(-12, 13, 3)]
        observed_or_pred = [508.2, 509.1, 510.4, 512.8, 515.1, 516.4, 517.2, 517.8, 518.3]
        lstm_df = pd.DataFrame({"Musi Gauge Height (m MSL)": observed_or_pred}, index=hours)
        st.line_chart(lstm_df)
        st.caption("Threshold: Musi Statutory Danger Level = 514.0m MSL. Inundation crest anticipated at T+9 hours.")

# -------------------------------------------------------------------------
# TAB 3: EXPLAINABLE AI (SHAP & LIME)
# -------------------------------------------------------------------------
with tab3:
    st.subheader("Explainable AI (XAI) - Unpacking Black-Box Model Predictions")
    st.markdown("**Core Question:** *Why did the model classify Tolichowki / Nadeem Colony as Critical?*")
    
    col_xai_1, col_xai_2 = st.columns(2)
    with col_xai_1:
        st.markdown("#### Local SHAP Waterfall Attribution")
        shap_data = pd.DataFrame({
            "Feature": ["Rainfall Intensity (>65mm/h)", "Water Surge Rate (+1.4m/h)", "Topographic Depression (504m)", "Population Density (14k/km²)", "Drainage Deficit Index"],
            "SHAP Impact Value (+ve pushes to Critical)": [1.42, 1.08, 0.64, 0.38, -0.22]
        })
        st.bar_chart(shap_data.set_index("Feature"))
    
    with col_xai_2:
        st.markdown("#### Natural-Language Diagnostic Explanation")
        st.info("""
        **Automated Diagnostic Report:**
        1. **Primary Hazard Contributor:** Localized cloudburst precipitation of 104.5 mm/hr accounts for **+38%** of the classification weight.
        2. **Hydrodynamic Factor:** Rapid rise in street-level water height (+1.4m/hr) adds **+29%** hazard probability.
        3. **Geospatial Susceptibility:** Tolichowki's natural bowl topography (504.5m MSL) prevents gravity runoff, causing severe backward inundation from Shah Hatim Talab.
        """)

# -------------------------------------------------------------------------
# TAB 4: RESOURCE OPTIMIZATION (OR-TOOLS)
# -------------------------------------------------------------------------
with tab4:
    st.subheader("Dynamic Multi-Resource Allocation Engine (Google OR-Tools)")
    st.markdown("Mixed Integer Linear Programming (MILP) minimizing transit latency and unmet demand.")
    
    res_df = pd.DataFrame({
        "Zone": ["Tolichowki", "Moosarambagh", "Begumpet", "Alwal", "Nizampet"],
        "Req. Boats": [8, 12, 5, 4, 2],
        "Alloc. Boats": [8, 9, 5, 3, 2],
        "Req. NDRF Teams": [3, 4, 2, 2, 1],
        "Alloc. NDRF Teams": [3, 3, 2, 1, 1],
        "Ambulances": [10, 12, 6, 4, 3],
        "Fulfillment": ["100%", "75% (Deficit -3)", "100%", "75% (Deficit -1)", "100%"]
    })
    st.dataframe(res_df, hide_index=True, use_container_width=True)
    
    st.caption("OR-Tools MILP Solver solved in 42ms. 3 reserve boats from Gachibowli Fire Station re-routed to cover Moosarambagh.")

# -------------------------------------------------------------------------
# TAB 5: OFFICER REVIEW & HITL CONSOLE
# -------------------------------------------------------------------------
with tab5:
    st.subheader("🛡️ Statutory Human-in-the-Loop Officer Authorization")
    st.warning("⚠️ **Compliance Notice:** AI recommendations are non-autonomous. Statutory authorization is mandatory prior to physical asset dispatch.")
    
    col_hitl_1, col_hitl_2 = st.columns(2)
    with col_hitl_1:
        st.markdown("#### Pending Emergency Dispatch Order: DISP-HYD-042")
        st.markdown("**Sector:** Tolichowki / Nadeem Colony (Severity Level 4)")
        st.markdown("**AI Recommendation:** 3 NDRF Teams (10th Battalion Moula Ali), 8 Inflatable Rescue Boats, 10 ALS Ambulances.")
        
        btn_app = st.button("✓ Authorize & Dispatch Assets", type="primary")
        if btn_app:
            st.success("✓ Authorization DISP-HYD-042 approved by Rakesh Gundala (IAS). Mobilization order transmitted to NDRF Control Room.")
            
    with col_hitl_2:
        st.markdown("#### Statutory Audit Trail")
        audit_df = pd.DataFrame({
            "Log ID": ["AUD-091", "AUD-090", "AUD-089"],
            "Time": ["13:45 IST", "12:30 IST", "11:15 IST"],
            "Officer": ["Rakesh Gundala (IAS)", "Dr. K. S. Rao", "V. Sharma (IPS)"],
            "Action": ["APPROVED", "MODIFIED", "REJECTED"],
            "Order": ["DISP-HYD-041", "DISP-HYD-038", "DISP-HYD-032"]
        })
        st.dataframe(audit_df, hide_index=True, use_container_width=True)

# -------------------------------------------------------------------------
# TAB 6: RAG AI COPILOT
# -------------------------------------------------------------------------
with tab6:
    st.subheader("💬 Disaster AI Copilot (RAG Grounded)")
    st.caption("Knowledge base indexed with NDMA Urban Flood Guidelines 2023 and Telangana State Disaster Management Plans.")
    
    user_query = st.text_input("Enter your command or question for the Copilot:", "Why is Tolichowki classified as Critical?")
    if st.button("Query Copilot"):
        st.markdown("**SEOC Copilot Response:**")
        st.markdown("""
        Tolichowki / Nadeem Colony is classified at **Severity Level 4 (CRITICAL)** with **94.6% confidence** based on:
        1. **Precipitation:** Localized intensity exceeding 68 mm/hr (+38% SHAP contribution).
        2. **Hydraulic Inundation:** Current water depth of 2.6m with a +1.4m/hr surge rate.
        3. **Topography:** Natural bowl depression at 504.5m MSL exacerbated by Shah Hatim Talab backflow.
        
        **Statutory Precaution:**
        *Ref: NDMA National Disaster Management Guidelines - Management of Urban Flooding (Sec 4.2)*: Pre-emptive evacuation required within 500m of the drainage channel.
        """)

# -------------------------------------------------------------------------
# TAB 7: SITREP GENERATOR
# -------------------------------------------------------------------------
with tab7:
    st.subheader("📄 Government Situation Report (SitRep)")
    st.markdown("""
    ```text
    ================================================================================
    GOVERNMENT OF TELANGANA — STATE EMERGENCY OPERATIONS CENTRE (SEOC)
    SITUATION REPORT (SITREP) NO: 04/HYD-MONSOON/2026
    DATE: 08-OCT-2026 | TIME: 14:00 IST
    ================================================================================
    1. CRISIS OVERVIEW:
       Extreme cloudburst event over GHMC catchment. Rainfall intensity: 104.5 mm/h.
       Musi river gauge at 515.1m MSL (1.1m above Danger Mark). 4 sectors at CRITICAL.
    
    2. HUMAN IMPACT & EVACUATION:
       • Total population at risk: 142,000 across 4 circles.
       • Evacuated to relief camps: 14,050 persons.
       • Casualties: 0 Fatalities | 42 Minor injuries under medical triage.
    
    3. RESOURCE DISPATCH (OR-TOOLS MILP):
       • 10 NDRF Companies deployed across Tolichowki and Musi basin.
       • 27 Motorized Rescue Boats active in inundation corridors.
       • 83 ICU Beds reserved across Gandhi, Osmania, and NIMS hospitals.
    
    AUTHORIZED BY:
    RAKESH GUNDALA (IAS) — STATE DISASTER COMMANDER, TELANGANA
    ================================================================================
    ```
    """)
    st.button("Export SitRep PDF / Transmit to National Disaster Management Authority")

# -------------------------------------------------------------------------
# TAB 8: DATASET EXPLORER & CSV INGESTION
# -------------------------------------------------------------------------
with tab8:
    st.subheader("📁 Disaster Telemetry Dataset Ingestion Engine")
    st.markdown("Upload, inspect, and validate disaster datasets with GIS coordinates, hydrological readings, and demographic vulnerability indices.")
    
    col_d1, col_d2 = st.columns([3, 1])
    with col_d1:
        st.markdown("#### Active Dataset Overview")
        st.dataframe(df_zones, use_container_width=True)
    
    with col_d2:
        st.markdown("#### Dataset Diagnostics")
        st.metric("Total Ingested Sectors", len(df_zones))
        critical_count = int((df_zones["Severity"] >= 4).sum())
        st.metric("Critical Sectors Detected", critical_count)
        
        # Download Sample Template
        sample_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_hyderabad_flood_data.csv")
        if os.path.exists(sample_path):
            with open(sample_path, "r") as f:
                csv_bytes = f.read()
            st.download_button(
                label="⬇️ Download Sample Template CSV",
                data=csv_bytes,
                file_name="sample_hyderabad_flood_data.csv",
                mime="text/csv"
            )
        st.caption("Schema: zone_id, zone_name, lat, lon, elevation_m, rainfall_intensity_mmh, water_level_m, severity_class")

