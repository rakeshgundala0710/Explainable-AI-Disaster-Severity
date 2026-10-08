/**
 * 5-STAGE DISASTER EMERGENCY TIMELINE SIMULATOR
 * Simulates a realistic flash flood progression in Hyderabad from Baseline to Catastrophic.
 */

class SEOCSimulationController {
  constructor() {
    this.currentStageIndex = 3; // Default: Stage 4 (Musi River Flash Surge)
    this.stages = window.SEOC_DATA.simulationStages;
  }

  init() {
    this.bindEvents();
    this.applyStage(this.currentStageIndex);
  }

  bindEvents() {
    const selector = document.getElementById('sim-stage-select');
    if (selector) {
      selector.value = this.currentStageIndex;
      selector.addEventListener('change', (e) => {
        this.applyStage(parseInt(e.target.value));
      });
    }

    const btnNext = document.getElementById('sim-next-btn');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        let nextIndex = (this.currentStageIndex + 1) % this.stages.length;
        if (selector) selector.value = nextIndex;
        this.applyStage(nextIndex);
      });
    }
  }

  applyStage(stageIndex) {
    this.currentStageIndex = stageIndex;
    const stage = this.stages[stageIndex];
    if (!stage) return;

    // 1. Update Telemetry in Header & KPIs
    this.updateKpis(stage);

    // 2. Adjust Zones Dynamic Severity
    this.adjustZonesForStage(stageIndex);

    // 3. Re-render Map Polygons
    if (window.SEOC_MAP) {
      window.SEOC_MAP.renderZones();
    }

    // 4. Update Simulation Banner
    const simSummary = document.getElementById('sim-stage-summary-text');
    if (simSummary) {
      simSummary.innerHTML = `<strong>${stage.name} (${stage.time}):</strong> ${stage.summary}`;
    }

    // 5. Update Alert Feed
    this.broadcastStageAlert(stage);

    if (window.SEOC_APP) {
      window.SEOC_APP.showToast(`Simulation updated to: ${stage.name}`, 'info');
    }
  }

  updateKpis(stage) {
    // Top KPI Ribbon
    const elActiveDisasters = document.getElementById('kpi-active-disasters');
    if (elActiveDisasters) elActiveDisasters.innerText = stage.activeDisasters;

    const elCriticalZones = document.getElementById('kpi-critical-zones');
    if (elCriticalZones) elCriticalZones.innerText = stage.criticalZones;

    const elPeopleAtRisk = document.getElementById('kpi-people-risk');
    if (elPeopleAtRisk) elPeopleAtRisk.innerText = stage.peopleAtRisk.toLocaleString();

    const elThreatLevel = document.getElementById('kpi-threat-level');
    if (elThreatLevel) {
      elThreatLevel.innerText = stage.threatLevel;
      elThreatLevel.style.color = stage.stage >= 4 ? '#ef4444' : stage.stage === 3 ? '#f97316' : stage.stage === 2 ? '#eab308' : '#10b981';
    }

    const elRainfall = document.getElementById('kpi-rainfall-rate');
    if (elRainfall) elRainfall.innerText = `${stage.rainfallIntensity} mm/h`;

    const elMusiGauge = document.getElementById('kpi-musi-gauge');
    if (elMusiGauge) elMusiGauge.innerText = `${stage.musiGaugeLevel}m MSL`;
  }

  adjustZonesForStage(stageIndex) {
    const zones = window.SEOC_DATA.zones;

    if (stageIndex === 0) {
      // Stage 1: All Normal
      zones.forEach(z => {
        z.baseSeverity = 0;
        z.currentWaterLevel = 0.1;
        z.waterLevelRiseRate = 0.0;
        z.vulnerablePopulation = 0;
      });
    } else if (stageIndex === 1) {
      // Stage 2: Heavy Downpour Commences
      zones.forEach(z => {
        if (z.id === 'ZONE-HYD-01') { z.baseSeverity = 2; z.currentWaterLevel = 0.7; }
        else if (z.id === 'ZONE-HYD-02') { z.baseSeverity = 2; z.currentWaterLevel = 0.8; }
        else { z.baseSeverity = 1; z.currentWaterLevel = 0.3; }
      });
    } else if (stageIndex === 2) {
      // Stage 3: Waterlogging Sluice overflow
      zones.forEach(z => {
        if (z.id === 'ZONE-HYD-01') { z.baseSeverity = 3; z.currentWaterLevel = 1.6; }
        else if (z.id === 'ZONE-HYD-02') { z.baseSeverity = 3; z.currentWaterLevel = 1.9; }
        else if (z.id === 'ZONE-HYD-03') { z.baseSeverity = 3; z.currentWaterLevel = 1.4; }
        else { z.baseSeverity = 2; z.currentWaterLevel = 0.6; }
      });
    } else if (stageIndex === 3) {
      // Stage 4: Musi River Flash Surge (Default)
      zones[0].baseSeverity = 4; // Tolichowki
      zones[1].baseSeverity = 4; // Moosarambagh
      zones[2].baseSeverity = 3; // Begumpet
      zones[3].baseSeverity = 3; // Alwal
      zones[4].baseSeverity = 2; // Nizampet
      zones[5].baseSeverity = 2; // Khairatabad
      zones[6].baseSeverity = 1; // Gachibowli
    } else if (stageIndex === 4) {
      // Stage 5: Catastrophic Multi-Zone
      zones[0].baseSeverity = 4;
      zones[1].baseSeverity = 4;
      zones[2].baseSeverity = 4;
      zones[3].baseSeverity = 4;
      zones[4].baseSeverity = 3;
      zones[5].baseSeverity = 3;
      zones[6].baseSeverity = 2;
    }
  }

  broadcastStageAlert(stage) {
    const alertBox = document.getElementById('live-alert-ticker-content');
    if (!alertBox) return;

    alertBox.innerHTML = `
      <span style="color: #ef4444; font-weight: bold; font-family: monospace;">[URGENT SEOC BROADCAST - ${stage.time}]</span> 
      ${stage.name.toUpperCase()}: ${stage.summary} Rainfall rate at <strong>${stage.rainfallIntensity} mm/h</strong>. 
      Musi Gauge level at <strong style="color: #f87171;">${stage.musiGaugeLevel}m MSL</strong>. 
      All District Magistrates and SDRF Battalions to stand by.
    `;
  }
}

window.SEOCSimulationController = SEOCSimulationController;
