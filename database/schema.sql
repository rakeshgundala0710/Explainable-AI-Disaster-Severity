-- =========================================================================
-- STATE EMERGENCY OPERATIONS CENTRE (SEOC) - POSTGRESQL + POSTGIS SCHEMA
-- Real-time disaster severity prediction, GIS zones, and multi-resource allocation
-- =========================================================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Disasters Registry
CREATE TABLE IF NOT EXISTS disasters (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    disaster_type VARCHAR(100) NOT NULL DEFAULT 'Urban Flood',
    state VARCHAR(100) NOT NULL DEFAULT 'Telangana',
    district VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
    severity_level INT NOT NULL DEFAULT 1, -- 0=Normal, 1=Low, 2=Moderate, 3=Severe, 4=Critical
    threat_status VARCHAR(50) NOT NULL DEFAULT 'WATCH',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE
);

-- 2. Weather Observations Telemetry
CREATE TABLE IF NOT EXISTS weather_observations (
    id SERIAL PRIMARY KEY,
    station_id VARCHAR(50) NOT NULL,
    station_name VARCHAR(150) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    rainfall_intensity_mmh NUMERIC(6, 2) NOT NULL,
    cumulative_24h_rainfall_mm NUMERIC(6, 2) NOT NULL,
    temperature_c NUMERIC(4, 1),
    humidity_percent NUMERIC(5, 2),
    wind_speed_kmh NUMERIC(5, 2),
    data_source VARCHAR(100) DEFAULT 'IMD AWS Radar',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hydrological Water Level Gauges
CREATE TABLE IF NOT EXISTS water_levels (
    id SERIAL PRIMARY KEY,
    gauge_id VARCHAR(50) NOT NULL,
    river_basin VARCHAR(100) NOT NULL DEFAULT 'Musi River',
    location_name VARCHAR(150) NOT NULL,
    current_level_msl NUMERIC(7, 2) NOT NULL, -- Meters above Mean Sea Level
    warning_level_msl NUMERIC(7, 2) NOT NULL DEFAULT 511.5,
    danger_level_msl NUMERIC(7, 2) NOT NULL DEFAULT 514.0,
    surge_velocity_mh NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Geospatial Risk Vulnerability Zones
CREATE TABLE IF NOT EXISTS risk_zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    circle_division VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    elevation_meters NUMERIC(6, 2) NOT NULL,
    population INT NOT NULL DEFAULT 0,
    vulnerable_population INT NOT NULL DEFAULT 0,
    current_severity INT NOT NULL DEFAULT 0,
    water_inundation_meters NUMERIC(5, 2) DEFAULT 0.0,
    road_accessibility_percent INT DEFAULT 100,
    drainage_capacity_description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Emergency Response Facilities (Hospitals & Shelters)
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(50) NOT NULL, -- 'HOSPITAL' or 'SHELTER'
    location_address TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT NOT NULL DEFAULT 0,
    icu_beds_available INT DEFAULT 0,
    oxygen_beds_available INT DEFAULT 0,
    ration_packets INT DEFAULT 0,
    clean_water_liters INT DEFAULT 0,
    status VARCHAR(100) DEFAULT 'OPERATIONAL'
);

-- 6. Resource Inventory & Demands
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(50) PRIMARY KEY,
    resource_type VARCHAR(100) NOT NULL, -- 'NDRF_TEAM', 'RESCUE_BOAT', 'AMBULANCE', 'FIRE_ENGINE'
    base_station VARCHAR(150) NOT NULL,
    total_inventory INT NOT NULL,
    available_units INT NOT NULL,
    deployed_units INT NOT NULL DEFAULT 0
);

-- 7. OR-Tools Optimization Deployments
CREATE TABLE IF NOT EXISTS resource_deployments (
    id VARCHAR(50) PRIMARY KEY,
    zone_id VARCHAR(50) REFERENCES risk_zones(id),
    ndrf_teams_req INT NOT NULL DEFAULT 0,
    ndrf_teams_alloc INT NOT NULL DEFAULT 0,
    rescue_boats_req INT NOT NULL DEFAULT 0,
    rescue_boats_alloc INT NOT NULL DEFAULT 0,
    ambulances_req INT NOT NULL DEFAULT 0,
    ambulances_alloc INT NOT NULL DEFAULT 0,
    fire_engines_req INT NOT NULL DEFAULT 0,
    fire_engines_alloc INT NOT NULL DEFAULT 0,
    solver_objective_value NUMERIC(10, 4),
    status VARCHAR(50) DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'APPROVED', 'DISPATCHED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Machine Learning Predictions & XAI Attributions
CREATE TABLE IF NOT EXISTS predictions (
    id VARCHAR(50) PRIMARY KEY,
    zone_id VARCHAR(50) REFERENCES risk_zones(id),
    model_version VARCHAR(50) NOT NULL,
    predicted_severity INT NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL,
    shap_values JSONB, -- Stores feature importance dictionary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Statutory Human-in-the-Loop Audit Trail (NDMA Section 35)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    officer_name VARCHAR(150) NOT NULL,
    officer_role VARCHAR(150) NOT NULL,
    target_sector VARCHAR(150) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'APPROVED', 'MODIFIED', 'REJECTED'
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_weather_recorded_at ON weather_observations(recorded_at);
CREATE INDEX IF NOT EXISTS idx_water_recorded_at ON water_levels(recorded_at);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
