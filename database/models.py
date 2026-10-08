"""
========================================================================================
STATE EMERGENCY OPERATIONS CENTRE (SEOC) - DATABASE MODELS & ORM
Compatible with PostgreSQL / SQLite fallback for instant local and cloud execution.
========================================================================================
"""

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class DisasterModel(Base):
    __tablename__ = "disasters"

    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    disaster_type = Column(String(100), default="Urban Flood")
    state = Column(String(100), default="Telangana")
    district = Column(String(100), default="Hyderabad")
    severity_level = Column(Integer, default=1)
    threat_status = Column(String(50), default="WATCH")
    is_active = Column(Boolean, default=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)


class WeatherObservationModel(Base):
    __tablename__ = "weather_observations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(String(50), nullable=False)
    station_name = Column(String(150), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    rainfall_intensity_mmh = Column(Float, nullable=False)
    cumulative_24h_rainfall_mm = Column(Float, nullable=False)
    temperature_c = Column(Float, nullable=True)
    humidity_percent = Column(Float, nullable=True)
    wind_speed_kmh = Column(Float, nullable=True)
    data_source = Column(String(100), default="IMD AWS Radar")


class WaterLevelModel(Base):
    __tablename__ = "water_levels"

    id = Column(Integer, primary_key=True, autoincrement=True)
    gauge_id = Column(String(50), nullable=False)
    river_basin = Column(String(100), default="Musi River")
    location_name = Column(String(150), nullable=False)
    current_level_msl = Column(Float, nullable=False)
    warning_level_msl = Column(Float, default=511.5)
    danger_level_msl = Column(Float, default=514.0)
    surge_velocity_mh = Column(Float, default=0.0)
    recorded_at = Column(DateTime, default=datetime.utcnow)


class RiskZoneModel(Base):
    __tablename__ = "risk_zones"

    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    circle_division = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_meters = Column(Float, nullable=False)
    population = Column(Integer, default=0)
    vulnerable_population = Column(Integer, default=0)
    current_severity = Column(Integer, default=0)
    water_inundation_meters = Column(Float, default=0.0)
    road_accessibility_percent = Column(Integer, default=100)
    drainage_capacity_description = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FacilityModel(Base):
    __tablename__ = "facilities"

    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    facility_type = Column(String(50), nullable=False) # 'HOSPITAL' or 'SHELTER'
    location_address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, nullable=False)
    current_occupancy = Column(Integer, default=0)
    icu_beds_available = Column(Integer, default=0)
    oxygen_beds_available = Column(Integer, default=0)
    ration_packets = Column(Integer, default=0)
    clean_water_liters = Column(Integer, default=0)
    status = Column(String(100), default="OPERATIONAL")


class ResourceDeploymentModel(Base):
    __tablename__ = "resource_deployments"

    id = Column(String(50), primary_key=True)
    zone_id = Column(String(50), ForeignKey("risk_zones.id"))
    ndrf_teams_req = Column(Integer, default=0)
    ndrf_teams_alloc = Column(Integer, default=0)
    rescue_boats_req = Column(Integer, default=0)
    rescue_boats_alloc = Column(Integer, default=0)
    ambulances_req = Column(Integer, default=0)
    ambulances_alloc = Column(Integer, default=0)
    fire_engines_req = Column(Integer, default=0)
    fire_engines_alloc = Column(Integer, default=0)
    solver_objective_value = Column(Float, nullable=True)
    status = Column(String(50), default="PENDING_APPROVAL")
    created_at = Column(DateTime, default=datetime.utcnow)


class PredictionModel(Base):
    __tablename__ = "predictions"

    id = Column(String(50), primary_key=True)
    zone_id = Column(String(50), ForeignKey("risk_zones.id"))
    model_version = Column(String(50), nullable=False)
    predicted_severity = Column(Integer, nullable=False)
    confidence_score = Column(Float, nullable=False)
    shap_values = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True)
    order_id = Column(String(50), nullable=False)
    officer_name = Column(String(150), nullable=False)
    officer_role = Column(String(150), nullable=False)
    target_sector = Column(String(150), nullable=False)
    action = Column(String(50), nullable=False) # 'APPROVED', 'MODIFIED', 'REJECTED'
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
