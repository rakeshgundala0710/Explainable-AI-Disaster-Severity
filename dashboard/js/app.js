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
});
