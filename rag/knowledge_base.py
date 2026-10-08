"""
========================================================================================
GOVERNMENT DISASTER GUIDELINES KNOWLEDGE BASE (RAG)
Official statutory procedures, NDMA guidelines, and Telangana flood SOPs.
========================================================================================
"""

from typing import List, Dict, Any

STATUTORY_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "id": "DOC-NDMA-01",
        "title": "NDMA National Disaster Management Guidelines: Management of Urban Flooding",
        "citation": "NDMA Urban Flood Guidelines (2023), Chapter 4: Emergency Response & Rescue Norms",
        "text": (
            "Whenever urban precipitation exceeds 65 mm/hour in low-lying catchment zones with elevation basins "
            "under 510m MSL, standard emergency deployment requires 1 NDRF company per 35,000 affected population, "
            "motorized rescue boats equipped with OBMs, and compulsory pre-emptive evacuation within a 500m buffer "
            "of high-flood lines."
        ),
        "keywords": ["rainfall", "evacuation", "ndrf", "boats", "urban flood", "tolichowki", "norm"]
    },
    {
        "id": "DOC-TSDMP-02",
        "title": "Telangana State Disaster Management Plan (TSDMP 2024): Musi River Basin Flood Protocol",
        "citation": "Telangana State Disaster Management Authority (TSDMA) - SOP FLD-02 (2024)",
        "text": (
            "Upon Musi gauge height reaching 514.0m MSL (Danger Mark), the District Collector and SEOC Commander "
            "must order immediate closure of Moosarambagh, Chaderghat, and Imliban causeways. SDRF flood rescue units "
            "stationed at Moula Ali Battalion 10 must mobilize within 20 minutes with high-volume dewatering pumps "
            "(2000 LPM capacity)."
        ),
        "keywords": ["musi", "moosarambagh", "chaderghat", "causeway", "gauge", "sdrf", "protocol", "sop"]
    },
    {
        "id": "DOC-GHMC-03",
        "title": "Greater Hyderabad Municipal Corporation (GHMC) Monsoon Standard Operating Procedure 2025",
        "citation": "GHMC Engineering & DRF Operations Manual, Circular No. 89/Monsoon/2025",
        "text": (
            "DRF (Disaster Response Force) teams must prioritize vulnerable communities in Nadeem Colony, "
            "Alwal Cheruvu downstream, and Brahmanwadi nala. Cellular towers in flooded wards must maintain emergency "
            "battery backups for Common Alerting Protocol (CAP) broadcasts."
        ),
        "keywords": ["ghmc", "drf", "nadeem colony", "alwal", "begumpet", "broadcast", "cap"]
    },
    {
        "id": "DOC-NDMA-04",
        "title": "NDMA Evacuation & Relief Camp Administration Norms",
        "citation": "NDMA Guidelines: Relief Camp Minimum Standards (Section 5.4)",
        "text": (
            "Relief camps established in public indoor stadiums must guarantee minimum 3.5 square meters floor area "
            "per evacuee, 15 liters of potable drinking water per person per day, and segregated medical quarantine "
            "rooms with dedicated ORS and anti-venom supply."
        ),
        "keywords": ["shelter", "relief camp", "stadium", "food", "drinking water", "medical", "ration"]
    }
]
