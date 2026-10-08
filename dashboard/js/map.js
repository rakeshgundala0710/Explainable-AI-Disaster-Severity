/**
 * GIS MAP CONTROLLER - HYDERABAD URBAN FLOOD RISK & RESOURCE LOGISTICS
 * Powered by Leaflet.js with custom styled vector polygons, telemetry popups, and layer toggles.
 */

class SEOCMapController {
  constructor(containerId = 'gis-map-canvas') {
    this.containerId = containerId;
    this.map = null;
    this.layers = {
      zones: null,
      hospitals: null,
      shelters: null,
      roadBlocks: null,
      ndrfTeams: null
    };
    this.selectedZoneId = null;
  }

  init() {
    if (!document.getElementById(this.containerId)) return;

    // Hyderabad City Coordinates (17.3850 N, 78.4867 E)
    this.map = L.map(this.containerId, {
      center: [17.4100, 78.4550],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    // Dark Matter Map Tiles (CartoDB Dark)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Initialize layer groups
    this.layers.zones = L.layerGroup().addTo(this.map);
    this.layers.hospitals = L.layerGroup().addTo(this.map);
    this.layers.shelters = L.layerGroup().addTo(this.map);
    this.layers.roadBlocks = L.layerGroup().addTo(this.map);

    this.renderAllLayers();
    this.bindEvents();
  }

  renderAllLayers() {
    this.renderZones();
    this.renderHospitals();
    this.renderShelters();
    this.renderRoadBlockages();
  }

  renderZones() {
    this.layers.zones.clearLayers();

    window.SEOC_DATA.zones.forEach(zone => {
      // Determine color based on severity
      let color = '#10b981';
      let fillColor = '#10b981';
      let fillOpacity = 0.35;

      if (zone.baseSeverity === 4) {
        color = '#ef4444';
        fillColor = '#ef4444';
        fillOpacity = 0.55;
      } else if (zone.baseSeverity === 3) {
        color = '#f97316';
        fillColor = '#f97316';
        fillOpacity = 0.45;
      } else if (zone.baseSeverity === 2) {
        color = '#eab308';
        fillColor = '#eab308';
        fillOpacity = 0.38;
      } else if (zone.baseSeverity === 1) {
        color = '#3b82f6';
        fillColor = '#3b82f6';
        fillOpacity = 0.30;
      }

      // Geospatial Circle Polygon representing catchment flood zone
      const circle = L.circle([zone.lat, zone.lng], {
        color: color,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        radius: 1200 + (zone.baseSeverity * 300),
        weight: 2
      });

      // Custom HTML Marker Pin
      const severityLabels = ['Normal', 'Low Risk', 'Moderate', 'Severe', 'CRITICAL'];
      const markerHtml = `
        <div style="
          background: rgba(15, 23, 42, 0.9);
          border: 2px solid ${color};
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          white-space: nowrap;
          box-shadow: 0 4px 12px ${color}66;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        ">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: ${color}; display: inline-block;"></span>
          ${zone.name.split('/')[0]}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'zone-label-icon',
        html: markerHtml,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon });

      const onZoneClick = () => {
        this.selectZone(zone);
      };

      circle.on('click', onZoneClick);
      marker.on('click', onZoneClick);

      // Tooltip
      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #fff; background: #111827; padding: 6px; border-radius: 6px;">
          <strong style="color: ${color}; font-size: 13px;">${zone.name}</strong><br>
          <span style="color: #94a3b8;">Circle: ${zone.circle}</span><br>
          <strong>Severity:</strong> Level ${zone.baseSeverity} (${severityLabels[zone.baseSeverity]})<br>
          <strong>Water Level:</strong> ${zone.currentWaterLevel}m (+${zone.waterLevelRiseRate}m/hr)<br>
          <strong>Population at Risk:</strong> ${zone.vulnerablePopulation.toLocaleString()}
        </div>
      `;
      circle.bindPopup(popupContent);

      this.layers.zones.addLayer(circle);
      this.layers.zones.addLayer(marker);
    });
  }

  renderHospitals() {
    this.layers.hospitals.clearLayers();

    window.SEOC_DATA.hospitals.forEach(hosp => {
      const iconHtml = `
        <div style="
          background: #0284c7;
          border: 2px solid #38bdf8;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
        ">H</div>
      `;

      const icon = L.divIcon({
        className: 'hospital-icon',
        html: iconHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([hosp.lat, hosp.lng], { icon: icon });
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #fff; background: #111827; padding: 6px; border-radius: 6px;">
          <strong style="color: #38bdf8;">${hosp.name}</strong><br>
          <span style="color: #94a3b8;">${hosp.location}</span><br>
          <strong>ICU Available:</strong> ${hosp.icuAvailable} / ${hosp.icuTotal}<br>
          <strong>Oxygen Beds Avail:</strong> ${hosp.oxygenAvailable} / ${hosp.oxygenTotal || hosp.oxygenBeds}<br>
          <span style="color: #facc15; font-size: 10px;">${hosp.status}</span>
        </div>
      `);

      this.layers.hospitals.addLayer(marker);
    });
  }

  renderShelters() {
    this.layers.shelters.clearLayers();

    window.SEOC_DATA.shelters.forEach(shltr => {
      const iconHtml = `
        <div style="
          background: #059669;
          border: 2px solid #34d399;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 11px;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
        ">⛺</div>
      `;

      const icon = L.divIcon({
        className: 'shelter-icon',
        html: iconHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([shltr.lat, shltr.lng], { icon: icon });
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #fff; background: #111827; padding: 6px; border-radius: 6px;">
          <strong style="color: #34d399;">${shltr.name}</strong><br>
          <strong>Occupancy:</strong> ${shltr.occupancy.toLocaleString()} / ${shltr.capacity.toLocaleString()}<br>
          <strong>Food Packets:</strong> ${shltr.foodPackets.toLocaleString()}<br>
          <strong>Drinking Water:</strong> ${shltr.cleanWaterLiters.toLocaleString()} Liters<br>
          <span style="color: #10b981;">Medical Post: ${shltr.medicalPostActive ? 'ACTIVE' : 'STANDBY'}</span>
        </div>
      `);

      this.layers.shelters.addLayer(marker);
    });
  }

  renderRoadBlockages() {
    this.layers.roadBlocks.clearLayers();

    window.SEOC_DATA.roadBlockages.forEach(road => {
      const iconHtml = `
        <div style="
          background: #dc2626;
          border: 2px solid #fecaca;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          box-shadow: 0 0 12px rgba(220, 38, 38, 0.8);
        ">⛔</div>
      `;

      const icon = L.divIcon({
        className: 'roadblock-icon',
        html: iconHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([road.lat, road.lng], { icon: icon });
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #fff; background: #111827; padding: 6px; border-radius: 6px;">
          <strong style="color: #f87171;">${road.name}</strong><br>
          <strong>Cause:</strong> ${road.cause}<br>
          <strong style="color: #fca5a5;">Status:</strong> ${road.status}<br>
          <strong style="color: #38bdf8;">Detour:</strong> ${road.alternateRoute}
        </div>
      `);

      this.layers.roadBlocks.addLayer(marker);
    });
  }

  selectZone(zone) {
    this.selectedZoneId = zone.id;
    this.map.flyTo([zone.lat, zone.lng], 13.5, { duration: 1.2 });

    // Update Zone Inspector Widget in the UI
    const inspector = document.getElementById('map-zone-inspector');
    if (inspector) {
      inspector.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h4 style="font-size: 0.95rem; color: #fff;">${zone.name}</h4>
          <span class="badge-zone ${zone.baseSeverity >= 4 ? 'badge-zone-critical' : zone.baseSeverity === 3 ? 'badge-zone-severe' : 'badge-zone-moderate'}">
            Level ${zone.baseSeverity} ${zone.baseSeverity === 4 ? 'CRITICAL' : zone.baseSeverity === 3 ? 'SEVERE' : 'MODERATE'}
          </span>
        </div>
        <p style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.75rem;">Circle: ${zone.circle} | Elevation: ${zone.elevationMeters}m MSL</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.75rem; margin-bottom: 0.75rem;">
          <div><span style="color:#64748b;">Water Inundation:</span> <strong style="color:#f87171;">${zone.currentWaterLevel}m</strong></div>
          <div><span style="color:#64748b;">Surge Velocity:</span> <strong>+${zone.waterLevelRiseRate}m/hr</strong></div>
          <div><span style="color:#64748b;">Pop. at Risk:</span> <strong>${zone.vulnerablePopulation.toLocaleString()}</strong></div>
          <div><span style="color:#64748b;">Road Access:</span> <strong>${zone.roadAccessibility}</strong></div>
        </div>

        <div style="background: rgba(15,23,42,0.6); padding: 0.5rem; border-radius: 4px; font-size: 0.73rem; margin-bottom: 0.75rem;">
          <strong style="color: #38bdf8;">XAI Leading Contributor:</strong> Rainfall Intensity (${zone.shapExplanation.rainfallIntensity.percent}%) & Inundation (+${zone.shapExplanation.waterLevelRise.percent}%)
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-primary" style="flex: 1; padding: 0.35rem 0.6rem; font-size: 0.72rem;" onclick="SEOC_APP.switchTab('xai-view')">
            Inspect SHAP Breakdown →
          </button>
          <button class="btn btn-approve" style="flex: 1; padding: 0.35rem 0.6rem; font-size: 0.72rem;" onclick="SEOC_APP.switchTab('resources-view')">
            View OR-Tools Dispatch →
          </button>
        </div>
      `;
    }

    // Also update the global XAI and Prediction widgets to focus on this zone
    if (window.SEOC_CHARTS) {
      window.SEOC_CHARTS.updateZoneXAI(zone);
    }
  }

  toggleLayer(layerName, isVisible) {
    if (!this.layers[layerName]) return;
    if (isVisible) {
      this.map.addLayer(this.layers[layerName]);
    } else {
      this.map.removeLayer(this.layers[layerName]);
    }
  }

  bindEvents() {
    // Checkbox toggles in UI
    const chkHosp = document.getElementById('toggle-layer-hospitals');
    if (chkHosp) chkHosp.addEventListener('change', e => this.toggleLayer('hospitals', e.target.checked));

    const chkShelter = document.getElementById('toggle-layer-shelters');
    if (chkShelter) chkShelter.addEventListener('change', e => this.toggleLayer('shelters', e.target.checked));

    const chkRoads = document.getElementById('toggle-layer-roads');
    if (chkRoads) chkRoads.addEventListener('change', e => this.toggleLayer('roadBlocks', e.target.checked));
  }
}

window.SEOCMapController = SEOCMapController;
