/**
 * SEOC DISASTER COMMAND APPLICATION COORDINATOR
 * Ties together GIS Mapping, SHAP/XAI, OR-Tools Optimization, RAG Copilot, and HITL Approvals.
 */

class SEOCApplication {
  constructor() {
    this.activeTab = 'war-room-view';
  }

  init() {
    console.log("Initializing SEOC Disaster Command Platform v2.4.0...");

    // 1. Start live clock
    this.startClock();

    // 2. Initialize sub-controllers
    window.SEOC_MAP = new SEOCMapController('gis-map-canvas');
    window.SEOC_MAP.init();

    window.SEOC_CHARTS = new SEOCChartsController();
    window.SEOC_CHARTS.init();

    window.SEOC_COPILOT = new SEOCCopilotController();
    window.SEOC_COPILOT.init();

    window.SEOC_HITL = new SEOCHitlController();
    window.SEOC_HITL.init();

    window.SEOC_SIMULATION = new SEOCSimulationController();
    window.SEOC_SIMULATION.init();

    // 3. Render Hospital & Shelter tables
    this.renderHospitalsTable();
    this.renderSheltersTable();
    this.renderResourceAllocationTable();

    // 4. Bind navigation tabs
    this.bindNavigation();

    console.log("SEOC Application successfully loaded.");
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour12: false }) + " IST";
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      const elTime = document.getElementById('live-clock-time');
      const elDate = document.getElementById('live-clock-date');

      if (elTime) elTime.innerText = timeStr;
      if (elDate) elDate.innerText = dateStr;
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  bindNavigation() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.getAttribute('data-view');
        if (targetView) {
          this.switchTab(targetView);
        }
      });
    });
  }

  switchTab(targetViewId) {
    this.activeTab = targetViewId;

    // Update Tab Buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-view') === targetViewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Views
    document.querySelectorAll('.view-section').forEach(view => {
      if (view.id === targetViewId) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    // Trigger map invalidation if switching to map or war room
    if (targetViewId === 'gis-map-view' || targetViewId === 'war-room-view') {
      setTimeout(() => {
        if (window.SEOC_MAP && window.SEOC_MAP.map) {
          window.SEOC_MAP.map.invalidateSize();
        }
      }, 150);
    }
  }

  renderHospitalsTable() {
    const tbody = document.getElementById('hospitals-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.SEOC_DATA.hospitals.map(h => `
      <tr>
        <td><strong style="color: #38bdf8;">${h.name}</strong><br><span style="color: #64748b; font-size: 0.7rem;">${h.location}</span></td>
        <td><span style="font-family: monospace; font-weight: bold; color: ${h.icuAvailable < 15 ? '#ef4444' : '#10b981'};">${h.icuAvailable}</span> / ${h.icuTotal}</td>
        <td><span style="font-family: monospace; font-weight: bold;">${h.oxygenAvailable}</span> / ${h.oxygenBeds}</td>
        <td><span style="font-size: 0.72rem; color: #fbbf24;">${h.status}</span></td>
        <td style="font-size: 0.7rem; color: #94a3b8;">${h.distanceToCriticalZone}</td>
      </tr>
    `).join('');
  }

  renderSheltersTable() {
    const tbody = document.getElementById('shelters-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.SEOC_DATA.shelters.map(s => {
      const pct = Math.round((s.occupancy / s.capacity) * 100);
      return `
        <tr>
          <td><strong style="color: #34d399;">${s.name}</strong><br><span style="color: #64748b; font-size: 0.7rem;">${s.location}</span></td>
          <td>
            <strong>${s.occupancy.toLocaleString()}</strong> / ${s.capacity.toLocaleString()} (${pct}%)
            <div class="progress-track" style="margin-top: 3px; height: 5px;">
              <div class="progress-fill ${pct > 80 ? 'progress-critical' : 'progress-green'}" style="width: ${pct}%;"></div>
            </div>
          </td>
          <td>${s.foodPackets.toLocaleString()} units</td>
          <td>${s.cleanWaterLiters.toLocaleString()} L</td>
          <td><span class="badge-official" style="font-size: 0.65rem;">ONLINE</span></td>
        </tr>
      `;
    }).join('');
  }

  renderResourceAllocationTable() {
    const tbody = document.getElementById('resource-alloc-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.SEOC_DATA.zones.map(z => {
      const demand = z.resourceDemand;
      const isCritical = z.baseSeverity >= 4;
      return `
        <tr>
          <td>
            <strong>${z.name}</strong><br>
            <span class="badge-zone ${isCritical ? 'badge-zone-critical' : z.baseSeverity === 3 ? 'badge-zone-severe' : 'badge-zone-moderate'}" style="font-size: 0.65rem;">
              Level ${z.baseSeverity}
            </span>
          </td>
          <td>${z.population.toLocaleString()} (${z.vulnerablePopulation.toLocaleString()} vulnerable)</td>
          <td>
            <strong style="color: #38bdf8;">${demand.ndrfTeams.alloc}</strong> / ${demand.ndrfTeams.req} Teams
          </td>
          <td>
            <strong style="color: #10b981;">${demand.rescueBoats.alloc}</strong> / ${demand.rescueBoats.req} Boats
          </td>
          <td>
            <strong style="color: #facc15;">${demand.ambulances.alloc}</strong> / ${demand.ambulances.req} Units
          </td>
          <td>
            <span class="badge-official" style="font-size: 0.68rem; background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
              ${demand.rescueBoats.alloc === demand.rescueBoats.req ? '100% Fulfilled' : 'Priority Gap (-' + (demand.rescueBoats.req - demand.rescueBoats.alloc) + ')'}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  bindUploadEvents() {
    const fileInput = document.getElementById('dataset-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleCsvFile(e.target.files[0]);
        }
      });
    }

    const dropZone = document.getElementById('dataset-dropzone');
    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#38bdf8';
        dropZone.style.background = 'rgba(56, 189, 248, 0.1)';
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        dropZone.style.background = 'rgba(15, 23, 42, 0.6)';
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        dropZone.style.background = 'rgba(15, 23, 42, 0.6)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleCsvFile(e.dataTransfer.files[0]);
        }
      });
    }
  }

  handleCsvFile(file) {
    if (!file.name.endsWith('.csv')) {
      this.showToast('Please upload a valid .csv file format', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsedRows = this.parseCsvText(text);
      if (parsedRows.length === 0) {
        this.showToast('CSV file is empty or corrupted', 'warning');
        return;
      }

      this.ingestDataset(parsedRows, file.name);
    };
    reader.readAsText(file);
  }

  parseCsvText(text) {
    const lines = text.trim().split(/\r\n|\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || '';
      });
      result.push(row);
    }
    return result;
  }

  ingestDataset(rows, fileName) {
    console.log(`Ingesting ${rows.length} rows from ${fileName}...`);

    // Convert rows into SEOC_DATA.zones format
    const newZones = rows.map((r, i) => {
      const severity = parseInt(r.severity_class || r.severity) || 3;
      const lat = parseFloat(r.latitude || r.lat) || (17.3850 + (i * 0.02));
      const lng = parseFloat(r.longitude || r.lng || r.lon) || (78.4550 + (i * 0.02));
      const pop = parseInt(r.population) || 35000;
      const vulPop = parseInt(r.vulnerable_population) || Math.round(pop * 0.3);
      const waterLvl = parseFloat(r.water_level_m || r.water_level) || 1.8;
      const surgeRate = parseFloat(r.surge_rate_mh || r.surge_rate) || 0.9;
      const elev = parseFloat(r.elevation_m || r.elevation) || 515.0;

      return {
        id: r.zone_id || `ZONE-UP-${i + 1}`,
        name: r.zone_name || `Uploaded Sector ${i + 1}`,
        circle: r.circle || 'Municipal Ward',
        lat: lat,
        lng: lng,
        elevationMeters: elev,
        population: pop,
        vulnerablePopulation: vulPop,
        baseSeverity: severity,
        drainageCapacity: 'Live Ingested Telemetry',
        waterLevelRiseRate: surgeRate,
        currentWaterLevel: waterLvl,
        roadAccessibility: severity >= 4 ? '25% (Submerged)' : severity === 3 ? '55% (Constrained)' : '90% (Passable)',
        nearestHospital: 'Nearest Trauma Centre',
        nearestShelter: 'Designated Indoor Relief Hall',
        shapExplanation: {
          rainfallIntensity: { value: `+${(severity * 0.35).toFixed(2)}`, percent: 38, positive: true },
          waterLevelRise: { value: `+${(waterLvl * 0.4).toFixed(2)}`, percent: 29, positive: true },
          topographicDepression: { value: `+${(elev < 510 ? 0.6 : 0.2).toFixed(2)}`, percent: 17, positive: true },
          populationDensity: { value: `+0.35`, percent: 10, positive: true },
          drainageMitigation: { value: `-0.20`, percent: 6, positive: false }
        },
        resourceDemand: {
          ndrfTeams: { req: Math.ceil(severity * 0.8), alloc: Math.ceil(severity * 0.7) },
          rescueBoats: { req: severity * 2 + 1, alloc: severity * 2 },
          ambulances: { req: severity * 3, alloc: severity * 2 + 2 },
          fireEngines: { req: Math.ceil(severity * 0.9), alloc: Math.ceil(severity * 0.8) },
          foodPacketsK: { req: Math.ceil(pop / 2000), alloc: Math.ceil(pop / 2200) }
        }
      };
    });

    window.SEOC_DATA.zones = newZones;

    // Refresh UI Components
    if (window.SEOC_MAP) {
      window.SEOC_MAP.renderZones();
    }
    this.renderResourceAllocationTable();

    // Update KPI Ribbon
    const criticalCount = newZones.filter(z => z.baseSeverity >= 4).length;
    const totalPopAtRisk = newZones.reduce((acc, z) => acc + z.vulnerablePopulation, 0);

    const elCrit = document.getElementById('kpi-critical-zones');
    if (elCrit) elCrit.innerText = criticalCount;

    const elPop = document.getElementById('kpi-people-risk');
    if (elPop) elPop.innerText = totalPopAtRisk.toLocaleString();

    // Populate Dataset Preview Table in UI
    const tableBody = document.getElementById('uploaded-dataset-tbody');
    if (tableBody) {
      tableBody.innerHTML = newZones.map(z => `
        <tr>
          <td style="font-family: monospace; color: #38bdf8;">${z.id}</td>
          <td><strong>${z.name}</strong><br><span style="color:#64748b; font-size:0.7rem;">${z.circle}</span></td>
          <td style="font-family: monospace;">${z.lat.toFixed(4)}, ${z.lng.toFixed(4)}</td>
          <td>${z.elevationMeters}m</td>
          <td><strong style="color: #f87171;">${z.currentWaterLevel}m</strong> (+${z.waterLevelRiseRate}m/h)</td>
          <td>${z.population.toLocaleString()} (${z.vulnerablePopulation.toLocaleString()} risk)</td>
          <td>
            <span class="badge-zone ${z.baseSeverity >= 4 ? 'badge-zone-critical' : z.baseSeverity === 3 ? 'badge-zone-severe' : 'badge-zone-moderate'}">
              Level ${z.baseSeverity}
            </span>
          </td>
        </tr>
      `).join('');
    }

    const badgeStatus = document.getElementById('dataset-upload-status');
    if (badgeStatus) {
      badgeStatus.innerHTML = `✓ Ingested <strong>${newZones.length} Sectors</strong> from <em>${fileName}</em>`;
      badgeStatus.style.display = 'inline-block';
    }

    this.showToast(`✓ Successfully ingested ${newZones.length} records from ${fileName}! GIS Map and KPIs updated.`, 'success');
  }

  downloadSampleCsv() {
    const csvContent = `zone_id,zone_name,circle,latitude,longitude,elevation_m,rainfall_intensity_mmh,cumulative_24h_rain_mm,water_level_m,surge_rate_mh,population,vulnerable_population,severity_class
ZONE-HYD-01,Tolichowki / Nadeem Colony,Charminar Zone (Circle 13),17.3984,78.4144,504.5,104.5,186.0,2.6,1.4,48500,14200,4
ZONE-HYD-02,Moosarambagh / Chaderghat,Malakpet Circle (Circle 6),17.3713,78.4983,498.2,112.0,198.5,3.2,1.8,52000,19500,4
ZONE-HYD-03,Begumpet / Picket Nala Basin,Secunderabad Zone (Circle 30),17.4447,78.4664,516.0,84.2,142.0,1.8,0.9,34000,8200,3
ZONE-HYD-04,Alwal / Bandanagaram Catchment,Kukatpally Zone (Circle 27),17.5022,78.5085,538.0,76.5,128.0,1.5,0.7,29000,6500,3
ZONE-HYD-05,Nizampet / Bhandari Layout,Kukatpally Zone (Circle 24),17.5186,78.3748,552.0,52.0,92.0,0.8,0.4,26000,4200,2
ZONE-HYD-06,Khairatabad / Hussain Sagar Sluice,Khairatabad Zone (Circle 17),17.4116,78.4608,512.0,58.4,98.0,0.7,0.3,31000,5800,2
ZONE-HYD-07,Gachibowli / IT Corridor,Serilingampally Circle,17.4401,78.3489,585.0,22.0,42.0,0.2,0.1,41000,2100,1`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'sample_hyderabad_disaster_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('Downloaded sample template CSV', 'info');
  }

  printSitRep() {
    window.print();
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.right = '2rem';
    toast.style.background = type === 'success' ? '#065f46' : type === 'warning' ? '#92400e' : '#1e293b';
    toast.style.border = '1px solid ' + (type === 'success' ? '#34d399' : type === 'warning' ? '#fbbf24' : '#38bdf8');
    toast.style.color = '#fff';
    toast.style.padding = '0.75rem 1.25rem';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
    toast.style.fontSize = '0.8rem';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'Inter, sans-serif';
    toast.style.transition = 'opacity 0.3s ease';
    toast.innerText = message;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.SEOC_APP = new SEOCApplication();
  window.SEOC_APP.init();
  window.SEOC_APP.bindUploadEvents();
});

