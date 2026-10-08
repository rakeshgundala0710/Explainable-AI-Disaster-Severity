/**
 * STATE EMERGENCY OPERATIONS CENTRE (SEOC) - HYDERABAD FLOOD DATA ENGINE
 * Official telemetry, GIS coordinates, hospital/shelter databases, and RAG knowledge base.
 */

const SEOC_DATA = {
  metadata: {
    state: "Telangana",
    district: "Hyderabad & Rangareddy",
    commandCentre: "State Emergency Operations Centre (SEOC) - BRKR Bhavan",
    pilot: "Urban Flash Flood & Musi Basin Emergency Decision Support",
    version: "2.4.0-PROD-CANDIDATE"
  },

  // 5-Stage Simulation Timeline
  simulationStages: [
    {
      stage: 1,
      name: "Stage 1: Pre-Monsoon Baseline",
      time: "06:00 IST",
      rainfallIntensity: 4.2, // mm/h
      cumulativeRainfall24h: 12.0, // mm
      musiGaugeLevel: 508.2, // m MSL (Safe < 510m)
      soilSaturation: 28, // %
      threatLevel: "NORMAL",
      activeDisasters: 0,
      criticalZones: 0,
      peopleAtRisk: 0,
      summary: "Normal weather conditions across GHMC circles. Reservoir sluice gates closed. Stormwater drains operating at 15% capacity."
    },
    {
      stage: 2,
      name: "Stage 2: Heavy Downpour Commences",
      time: "08:30 IST",
      rainfallIntensity: 38.5,
      cumulativeRainfall24h: 58.0,
      musiGaugeLevel: 509.7,
      soilSaturation: 58,
      threatLevel: "WATCH / MODERATE",
      activeDisasters: 1,
      criticalZones: 1,
      peopleAtRisk: 24000,
      summary: "Localized cloudburst over West Hyderabad (Serilingampally and Kukatpally). Water stagnation reported on arterial roads."
    },
    {
      stage: 3,
      name: "Stage 3: Waterlogging & Sluice Gate Overflow",
      time: "11:15 IST",
      rainfallIntensity: 72.0,
      cumulativeRainfall24h: 114.0,
      musiGaugeLevel: 512.4, // Warning Level = 511.5m
      soilSaturation: 82,
      threatLevel: "SEVERE (ORANGE ALERT)",
      activeDisasters: 1,
      criticalZones: 2,
      peopleAtRisk: 78000,
      summary: "Hussain Sagar lake surplus weir discharge at maximum. Begumpet and Tolichowki report ground-floor inundation up to 1.2 meters."
    },
    {
      stage: 4,
      name: "Stage 4: Musi River Flash Surge",
      time: "14:00 IST",
      rainfallIntensity: 104.5,
      cumulativeRainfall24h: 186.0,
      musiGaugeLevel: 515.1, // Danger Level = 514.0m
      soilSaturation: 94,
      threatLevel: "CRITICAL (RED ALERT)",
      activeDisasters: 1,
      criticalZones: 4,
      peopleAtRisk: 142000,
      summary: "Musi river breaches banks at Moosarambagh and Chaderghat causeways. 4 low-lying circles inundated. Multiple road links severed."
    },
    {
      stage: 5,
      name: "Stage 5: Catastrophic Multi-Zone Inundation",
      time: "16:45 IST",
      rainfallIntensity: 135.0,
      cumulativeRainfall24h: 248.0,
      musiGaugeLevel: 517.8, // Extreme Catastrophic > 516m
      soilSaturation: 99,
      threatLevel: "DISASTER EMERGENCY (LEVEL-3)",
      activeDisasters: 1,
      criticalZones: 5,
      peopleAtRisk: 215000,
      summary: "Catastrophic flooding across Musi basin and downstream nalas. Over 200,000 residents affected. Full SDRF/NDRF mobilization initiated."
    }
  ],

  // Hyderabad Flood Vulnerability Zones with Real Geospatial Polygons & Demographics
  zones: [
    {
      id: "ZONE-HYD-01",
      name: "Tolichowki / Nadeem Colony",
      circle: "Charminar Zone (Circle 13)",
      lat: 17.3984,
      lng: 78.4144,
      elevationMeters: 504.5, // Low bowl topography
      population: 48500,
      vulnerablePopulation: 14200,
      baseSeverity: 4, // Critical
      drainageCapacity: "Extremely Poor / Shah Hatim Talab Backflow",
      waterLevelRiseRate: 1.4, // m/h
      currentWaterLevel: 2.6, // m above street level
      roadAccessibility: "35% (Submerged via PVNR Expressway pillar 40-75)",
      nearestHospital: "Care Hospital Banjara Hills (3.2 km)",
      nearestShelter: "Kotla Vijaya Bhasker Reddy Indoor Stadium (2.8 km)",
      shapExplanation: {
        rainfallIntensity: { value: "+1.42", percent: 38, positive: true },
        waterLevelRise: { value: "+1.08", percent: 29, positive: true },
        topographicDepression: { value: "+0.64", percent: 17, positive: true },
        populationDensity: { value: "+0.38", percent: 10, positive: true },
        drainageMitigation: { value: "-0.22", percent: 6, positive: false }
      },
      resourceDemand: {
        ndrfTeams: { req: 3, alloc: 3 },
        rescueBoats: { req: 8, alloc: 8 },
        ambulances: { req: 12, alloc: 10 },
        fireEngines: { req: 4, alloc: 4 },
        foodPacketsK: { req: 25, alloc: 22 }
      }
    },
    {
      id: "ZONE-HYD-02",
      name: "Moosarambagh / Chaderghat",
      circle: "Malakpet Circle (Circle 6)",
      lat: 17.3713,
      lng: 78.4983,
      elevationMeters: 498.2, // Deep Musi River floodplain
      population: 52000,
      vulnerablePopulation: 19500,
      baseSeverity: 4, // Critical
      drainageCapacity: "River Overflow Direct Impingement",
      waterLevelRiseRate: 1.8,
      currentWaterLevel: 3.2,
      roadAccessibility: "15% (Old Causeway completely submerged)",
      nearestHospital: "Osmania General Hospital (1.4 km)",
      nearestShelter: "Amberpet Flood Relief Camp (1.9 km)",
      shapExplanation: {
        rainfallIntensity: { value: "+1.58", percent: 42, positive: true },
        waterLevelRise: { value: "+1.24", percent: 33, positive: true },
        topographicDepression: { value: "+0.45", percent: 12, positive: true },
        populationDensity: { value: "+0.32", percent: 8, positive: true },
        drainageMitigation: { value: "-0.19", percent: 5, positive: false }
      },
      resourceDemand: {
        ndrfTeams: { req: 4, alloc: 3 },
        rescueBoats: { req: 12, alloc: 9 },
        ambulances: { req: 14, alloc: 12 },
        fireEngines: { req: 5, alloc: 4 },
        foodPacketsK: { req: 30, alloc: 26 }
      }
    },
    {
      id: "ZONE-HYD-03",
      name: "Begumpet / Picket Nala Basin",
      circle: "Secunderabad Zone (Circle 30)",
      lat: 17.4447,
      lng: 78.4664,
      elevationMeters: 516.0,
      population: 34000,
      vulnerablePopulation: 8200,
      baseSeverity: 3, // Severe
      drainageCapacity: "Severe constriction at Railway Culvert",
      waterLevelRiseRate: 0.9,
      currentWaterLevel: 1.8,
      roadAccessibility: "55% (Flyover open, ground link cut)",
      nearestHospital: "Gandhi Hospital Musheerabad (2.9 km)",
      nearestShelter: "Gymkhana Grounds Relief Camp (2.1 km)",
      shapExplanation: {
        rainfallIntensity: { value: "+1.12", percent: 34, positive: true },
        waterLevelRise: { value: "+0.85", percent: 26, positive: true },
        topographicDepression: { value: "+0.55", percent: 17, positive: true },
        populationDensity: { value: "+0.42", percent: 13, positive: true },
        drainageMitigation: { value: "-0.32", percent: 10, positive: false }
      },
      resourceDemand: {
        ndrfTeams: { req: 2, alloc: 2 },
        rescueBoats: { req: 5, alloc: 5 },
        ambulances: { req: 6, alloc: 6 },
        fireEngines: { req: 3, alloc: 3 },
        foodPacketsK: { req: 15, alloc: 15 }
      }
    },
    {
      id: "ZONE-HYD-04",
      name: "Alwal / Bandanagaram Catchment",
      circle: "Kukatpally Zone (Circle 27)",
      lat: 17.5022,
      lng: 78.5085,
      elevationMeters: 538.0,
      population: 29000,
      vulnerablePopulation: 6500,
      baseSeverity: 3, // Severe
      drainageCapacity: "Alwal Cheruvu surplus channel breached",
      waterLevelRiseRate: 0.7,
      currentWaterLevel: 1.5,
      roadAccessibility: "60% (Main road operational)",
      nearestHospital: "ESI Hospital Sanathnagar (5.2 km)",
      nearestShelter: "Alwal Municipality Hall (1.1 km)",
      shapExplanation: {
        rainfallIntensity: { value: "+0.95", percent: 31, positive: true },
        waterLevelRise: { value: "+0.78", percent: 25, positive: true },
        topographicDepression: { value: "+0.62", percent: 20, positive: true },
        populationDensity: { value: "+0.39", percent: 13, positive: true },
        drainageMitigation: { value: "-0.34", percent: 11, positive: false }
      },
      resourceDemand: {
        ndrfTeams: { req: 2, alloc: 1 },
        rescueBoats: { req: 4, alloc: 3 },
        ambulances: { req: 5, alloc: 4 },
        fireEngines: { req: 2, alloc: 2 },
        foodPacketsK: { req: 12, alloc: 10 }
      }
    },
    {
      id: "ZONE-HYD-05",
      name: "Nizampet / Bhandari Layout",
      circle: "Kukatpally Zone (Circle 24)",
      lat: 17.5186,
      lng: 78.3748,
      elevationMeters: 552.0,
      population: 26000,
      vulnerablePopulation: 4200,
      baseSeverity: 2, // Moderate
      drainageCapacity: "Treated storm drain functional at 60%",
      waterLevelRiseRate: 0.4,
      currentWaterLevel: 0.8,
      roadAccessibility: "80% (Minor waterlogging at cellars)",
      nearestHospital: "KIMS Hospitals Kondapur (4.5 km)",
      nearestShelter: "JNTUH Indoor Complex (3.2 km)",
      shapExplanation: {
        rainfallIntensity: { value: "+0.72", percent: 35, positive: true },
        waterLevelRise: { value: "+0.45", percent: 22, positive: true },
        topographicDepression: { value: "+0.38", percent: 18, positive: true },
        populationDensity: { value: "+0.28", percent: 14, positive: true },
        drainageMitigation: { value: "-0.24", percent: 11, positive: false }
      },
      resourceDemand: {
        ndrfTeams: { req: 1, alloc: 1 },
        rescueBoats: { req: 2, alloc: 2 },
        ambulances: { req: 3, alloc: 3 },
        fireEngines: { req: 1, alloc: 1 },
        foodPacketsK: { req: 8, alloc: 8 }
      }
    },
    {
      id: "ZONE-HYD-06",
      name: "Khairatabad / Hussain Sagar Sluice",
      circle: "Khairatabad Zone (Circle 17)",
      lat: 17.4116,
      lng: 78.4608,
      elevationMeters: 512.0,
      population: 31000,
      vulnerablePopulation: 5800,
      baseSeverity: 2, // Moderate
      drainageCapacity: "Controlled weir release operational",
      waterLevelRiseRate: 0.3,
      currentWaterLevel: 0.7,
      roadAccessibility: "85% (Necklace Road regulated)",
      nearestHospital: "NIMS Hospital Punjagutta (1.2 km)",
      nearestShelter: "LB Stadium Sports Complex (2.4 km)",
      shapExplanation: {
        rainfallIntensity: { value: "+0.68", percent: 36, positive: true },
        waterLevelRise: { value: "+0.42", percent: 22, positive: true },
        topographicDepression: { value: "+0.31", percent: 16, positive: true },
        populationDensity: { value: "+0.29", percent: 15, positive: true },
        drainageMitigation: { value: "-0.21", percent: 11, positive: false }
      },
      resourceDemand: {
        ndrfTeams: { req: 1, alloc: 1 },
        rescueBoats: { req: 2, alloc: 2 },
        ambulances: { req: 3, alloc: 3 },
        fireEngines: { req: 2, alloc: 2 },
        foodPacketsK: { req: 6, alloc: 6 }
      }
    },
    {
      id: "ZONE-HYD-07",
      name: "Gachibowli / IT Corridor",
      circle: "Serilingampally Circle",
      lat: 17.4401,
      lng: 78.3489,
      elevationMeters: 585.0, // High ridge terrain
      population: 41000,
      vulnerablePopulation: 2100,
      baseSeverity: 1, // Low
      drainageCapacity: "Modern box drains functional",
      waterLevelRiseRate: 0.1,
      currentWaterLevel: 0.2,
      roadAccessibility: "98% (Normal traffic)",
      nearestHospital: "Continental Hospital Financial Dist (3.1 km)",
      nearestShelter: "Gachibowli Athletic Stadium (1.5 km)",
      shapExplanation: {
        rainfallIntensity: { value: "+0.45", percent: 45, positive: true },
        waterLevelRise: { value: "+0.15", percent: 15, positive: true },
        topographicDepression: { value: "-0.85", percent: 40, positive: false }
      },
      resourceDemand: {
        ndrfTeams: { req: 0, alloc: 0 },
        rescueBoats: { req: 0, alloc: 0 },
        ambulances: { req: 1, alloc: 1 },
        fireEngines: { req: 1, alloc: 1 },
        foodPacketsK: { req: 2, alloc: 2 }
      }
    }
  ],

  // Hospital Inventory & Bed Telemetry
  hospitals: [
    {
      id: "HOSP-01",
      name: "Osmania General Hospital",
      location: "Afzal Gunj / Musi bank",
      lat: 17.3735,
      lng: 78.4738,
      icuTotal: 85,
      icuAvailable: 12,
      oxygenBeds: 210,
      oxygenAvailable: 28,
      status: "HIGH ALERT / ADMISSIONS RESTRICTED TO FLOOD VICTIMS",
      distanceToCriticalZone: "1.2 km from Moosarambagh"
    },
    {
      id: "HOSP-02",
      name: "Gandhi Hospital",
      location: "Musheerabad",
      lat: 17.4241,
      lng: 78.5034,
      icuTotal: 120,
      icuAvailable: 34,
      oxygenBeds: 340,
      oxygenAvailable: 68,
      status: "OPERATIONAL / TRAUMA SURGE PROTOCOL ACTIVE",
      distanceToCriticalZone: "2.8 km from Begumpet"
    },
    {
      id: "HOSP-03",
      name: "NIMS (Nizam's Institute of Medical Sciences)",
      location: "Punjagutta",
      lat: 17.4225,
      lng: 78.4528,
      icuTotal: 90,
      icuAvailable: 22,
      oxygenBeds: 280,
      oxygenAvailable: 55,
      status: "NORMAL EMERGENCY TRIAGE",
      distanceToCriticalZone: "3.5 km from Tolichowki"
    },
    {
      id: "HOSP-04",
      name: "Sir Ronald Ross Institute of Tropical Diseases (Fever Hospital)",
      location: "Nallakunta",
      lat: 17.3995,
      lng: 78.5052,
      icuTotal: 40,
      icuAvailable: 15,
      oxygenBeds: 160,
      oxygenAvailable: 42,
      status: "WATERBORNE EPIDEMIC PREPAREDNESS ACTIVE",
      distanceToCriticalZone: "2.1 km from Moosarambagh"
    }
  ],

  // Relief Shelter Inventory
  shelters: [
    {
      id: "SHLTR-01",
      name: "Kotla Vijaya Bhasker Reddy Indoor Stadium",
      location: "Yousufguda",
      lat: 17.4372,
      lng: 78.4312,
      capacity: 6500,
      occupancy: 4200,
      cleanWaterLiters: 45000,
      foodPackets: 12000,
      generatorsOnline: true,
      medicalPostActive: true
    },
    {
      id: "SHLTR-02",
      name: "Gachibowli Athletic Stadium Indoor Hall",
      location: "Gachibowli",
      lat: 17.4485,
      lng: 78.3456,
      capacity: 12000,
      occupancy: 2800,
      cleanWaterLiters: 90000,
      foodPackets: 28000,
      generatorsOnline: true,
      medicalPostActive: true
    },
    {
      id: "SHLTR-03",
      name: "Amberpet Municipal Flood Relief Center",
      location: "Amberpet",
      lat: 17.3872,
      lng: 78.5192,
      capacity: 4500,
      occupancy: 3950,
      cleanWaterLiters: 22000,
      foodPackets: 6500,
      generatorsOnline: true,
      medicalPostActive: true
    },
    {
      id: "SHLTR-04",
      name: "LB Stadium Multi-Purpose Hall",
      location: "Basheerbagh",
      lat: 17.4011,
      lng: 78.4746,
      capacity: 8000,
      occupancy: 3100,
      cleanWaterLiters: 60000,
      foodPackets: 18000,
      generatorsOnline: true,
      medicalPostActive: true
    }
  ],

  // Road Blockages & Critical Choke Points
  roadBlockages: [
    {
      id: "ROAD-BLK-01",
      name: "Moosarambagh Old Causeway",
      lat: 17.3718,
      lng: 78.4988,
      cause: "Musi river overtopping by 2.2m",
      status: "CLOSED FOR ALL VEHICLES / BARRICADED",
      alternateRoute: "Dilsukhnagar via Chaitanyapuri High-Level Bridge"
    },
    {
      id: "ROAD-BLK-02",
      name: "PVNR Expressway Down-Ramp (Pillar 68, Tolichowki)",
      lat: 17.3978,
      lng: 78.4125,
      cause: "Shah Hatim nala waterlogging (1.4m depth)",
      status: "TRAFFIC DIVERTED TO UPPER FLYOVER",
      alternateRoute: "Mehdipatnam Main Road via Rethibowli Ring"
    },
    {
      id: "ROAD-BLK-03",
      name: "Picket Nala Culvert (Begumpet Airport Road)",
      lat: 17.4432,
      lng: 78.4651,
      cause: "Backflow debris blockage",
      status: "SINGLE LANE OPEN / EMERGENCY VEHICLES ONLY",
      alternateRoute: "Paradise Metro corridor via Minister Road"
    }
  ],

  // Machine Learning Performance Benchmarks
  mlBenchmarks: [
    { model: "Logistic Regression (Baseline)", accuracy: "74.2%", precision: "0.71", recall: "0.68", macroF1: "0.69", inferenceMs: 2.1 },
    { model: "Decision Tree (CART)", accuracy: "81.5%", precision: "0.79", recall: "0.77", macroF1: "0.78", inferenceMs: 1.8 },
    { model: "Random Forest Classifier", accuracy: "91.8%", precision: "0.90", recall: "0.89", macroF1: "0.89", inferenceMs: 8.4 },
    { model: "XGBoost Gradient Boosted Trees", accuracy: "94.6%", precision: "0.93", recall: "0.94", macroF1: "0.94", inferenceMs: 6.2 },
    { model: "Deep Bi-LSTM (24h Time-Series)", accuracy: "95.8%", precision: "0.95", recall: "0.96", macroF1: "0.95", inferenceMs: 14.5 }
  ],

  // RAG Government Knowledge Base Documents
  ragKnowledgeBase: [
    {
      id: "DOC-NDMA-01",
      title: "NDMA National Disaster Management Guidelines: Management of Urban Flooding (Sec 4.2 - 4.5)",
      citation: "NDMA Urban Flood Guidelines (2023), Chapter 4: Emergency Response & Rescue Norms",
      text: "Whenever urban precipitation exceeds 65 mm/hour in low-lying catchment zones with elevation basins under 510m MSL, standard emergency deployment requires 1 NDRF company per 35,000 affected population, motorized rescue boats equipped with OBMs, and compulsory pre-emptive evacuation within a 500m buffer of high-flood lines."
    },
    {
      id: "DOC-TSDMP-02",
      title: "Telangana State Disaster Management Plan (TSDMP 2024): Musi River Basin Flood Protocol",
      citation: "Telangana State Disaster Management Authority (TSDMA) - SOP FLD-02 (2024)",
      text: "Upon Musi gauge height reaching 514.0m MSL (Danger Mark), the District Collector and SEOC Commander must order immediate closure of Moosarambagh, Chaderghat, and Imliban causeways. SDRF flood rescue units stationed at Moula Ali Battalion 10 must mobilize within 20 minutes with high-volume dewatering pumps (2000 LPM capacity)."
    },
    {
      id: "DOC-GHMC-03",
      title: "Greater Hyderabad Municipal Corporation (GHMC) Monsoon Standard Operating Procedure 2025",
      citation: "GHMC Engineering & DRF Operations Manual, Circular No. 89/Monsoon/2025",
      text: "DRF (Disaster Response Force) teams must prioritize vulnerable communities in Nadeem Colony, Alwal Cheruvu downstream, and Brahmanwadi nala. Cellular towers in flooded wards must maintain emergency battery backups for Common Alerting Protocol (CAP) broadcasts."
    },
    {
      id: "DOC-OR-TOOLS-04",
      title: "Mathematical Optimization Formulation for Emergency Resource Dispatch",
      citation: "SEOC Operations Research Manual - Mixed Integer Linear Programming (MILP)",
      text: "The objective function minimizes total transit penalty Z = Sum(w_t * Distance_ij * x_ij) + BigM * Sum(UnmetDemand_j), subject to resource constraints: Sum(x_ij) <= Supply_i, and hospital triage threshold constraints."
    }
  ]
};

// Expose globally
window.SEOC_DATA = SEOC_DATA;
