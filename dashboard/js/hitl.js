/**
 * HUMAN-IN-THE-LOOP (HITL) OFFICER APPROVAL & AUDIT ENGINE
 * Enforces NDMA statutory compliance: AI provides advisory recommendations; authorized officers must approve.
 */

class SEOCHitlController {
  constructor() {
    this.auditLogs = [
      {
        id: "AUD-091",
        timestamp: "13:45 IST",
        officer: "Rakesh Gundala (IAS) - SEOC Commander",
        orderId: "DISP-HYD-041",
        zone: "Begumpet (Circle 30)",
        action: "APPROVED",
        details: "Dispatched 2 NDRF Teams + 5 Rescue Boats to Picket Nala basin.",
        badgeClass: "badge-official"
      },
      {
        id: "AUD-090",
        timestamp: "12:30 IST",
        officer: "Dr. K. S. Rao - Health Operations Director",
        orderId: "DISP-HYD-038",
        zone: "Gandhi Hospital Musheerabad",
        action: "MODIFIED",
        details: "Increased ALS Ambulances from 4 to 6 due to geriatric triage surge.",
        badgeClass: "badge-zone-moderate"
      },
      {
        id: "AUD-089",
        timestamp: "11:15 IST",
        officer: "V. Sharma (IPS) - SDRF Logistics Chief",
        orderId: "DISP-HYD-032",
        zone: "Khairatabad Sluice Gate",
        action: "REJECTED / HELD",
        details: "Heavy dewatering pumps redirected to upstream Begumpet.",
        badgeClass: "badge-zone-critical"
      }
    ];

    this.pendingOrders = [
      {
        id: "DISP-HYD-042",
        zoneId: "ZONE-HYD-01",
        zoneName: "Tolichowki / Nadeem Colony",
        severityLevel: 4,
        severityLabel: "CRITICAL",
        recommendation: "Deploy 3 NDRF Teams (10th Bn Moula Ali), 8 Inflatable Rescue Boats (IRBs), and 10 ALS Ambulances.",
        rationale: "Extreme localized cloudburst (>68mm/h), bowl depression elevation 504.5m, 14,200 vulnerable citizens at immediate risk of drowning/isolation.",
        teams: 3,
        boats: 8,
        ambulances: 10
      },
      {
        id: "DISP-HYD-043",
        zoneId: "ZONE-HYD-02",
        zoneName: "Moosarambagh / Chaderghat",
        severityLevel: 4,
        severityLabel: "CRITICAL",
        recommendation: "Deploy 3 NDRF Teams, 9 Motorized Boats, and barricade causeway with 4 Fire Hydrant Tenders.",
        rationale: "Musi river gauge surpassed 515.1m MSL (1.1m above Danger Mark). Water entering residential ground floors.",
        teams: 3,
        boats: 9,
        ambulances: 12
      }
    ];
  }

  init() {
    this.renderPendingOrders();
    this.renderAuditLogs();
  }

  renderPendingOrders() {
    const container = document.getElementById('hitl-orders-container');
    if (!container) return;

    if (this.pendingOrders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #10b981; background: rgba(16,185,129,0.06); border: 1px dashed rgba(16,185,129,0.3); border-radius: 8px;">
          ✓ All AI-generated emergency deployment recommendations have been reviewed and authorized. No pending orders.
        </div>
      `;
      return;
    }

    container.innerHTML = this.pendingOrders.map(order => `
      <div class="order-card" id="card-${order.id}">
        <div class="order-card-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="order-id">${order.id}</span>
            <span class="badge-zone badge-zone-critical">Level ${order.severityLevel} ${order.severityLabel}</span>
          </div>
          <span style="font-size: 0.75rem; color: #94a3b8;">Target Sector: <strong style="color: #fff;">${order.zoneName}</strong></span>
        </div>

        <div class="order-summary">
          <strong style="color: #38bdf8;">AI Recommended Dispatch:</strong> ${order.recommendation}
        </div>

        <div style="font-size: 0.72rem; color: #94a3b8; background: rgba(15,23,42,0.6); padding: 0.5rem; border-radius: 4px;">
          <strong style="color: #e2e8f0;">Optimization Objective:</strong> ${order.rationale}
        </div>

        <div class="order-action-buttons">
          <button class="btn btn-reject" onclick="SEOC_HITL.rejectOrder('${order.id}')">
            ✕ Reject / Hold
          </button>
          <button class="btn btn-modify" onclick="SEOC_HITL.openModifyModal('${order.id}')">
            ✎ Modify Allocation
          </button>
          <button class="btn btn-approve" onclick="SEOC_HITL.approveOrder('${order.id}')">
            ✓ Authorize & Dispatch (SEOC)
          </button>
        </div>
      </div>
    `).join('');
  }

  renderAuditLogs() {
    const tableBody = document.getElementById('audit-logs-tbody');
    if (!tableBody) return;

    tableBody.innerHTML = this.auditLogs.map(log => `
      <tr>
        <td style="font-family: monospace; color: #38bdf8;">${log.id}</td>
        <td style="color: #94a3b8;">${log.timestamp}</td>
        <td style="color: #fff; font-weight: 500;">${log.officer}</td>
        <td style="font-family: monospace;">${log.orderId}</td>
        <td><strong>${log.zone}</strong></td>
        <td>
          <span class="badge-zone ${log.action === 'APPROVED' ? 'badge-zone-critical' : log.action === 'MODIFIED' ? 'badge-zone-severe' : 'badge-zone-moderate'}" style="font-size: 0.68rem;">
            ${log.action}
          </span>
        </td>
        <td style="font-size: 0.75rem; color: #cbd5e1;">${log.details}</td>
      </tr>
    `).join('');
  }

  approveOrder(orderId) {
    const order = this.pendingOrders.find(o => o.id === orderId);
    if (!order) return;

    // Create Audit entry
    const newAudit = {
      id: "AUD-0" + (this.auditLogs.length + 90),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + " IST",
      officer: "Rakesh Gundala (IAS) - SEOC Duty Commander",
      orderId: order.id,
      zone: order.zoneName,
      action: "APPROVED",
      details: `Full authorization granted. Dispatched ${order.teams} NDRF Teams, ${order.boats} Boats, ${order.ambulances} Ambulances to ${order.zoneName}.`,
      badgeClass: "badge-official"
    };

    this.auditLogs.unshift(newAudit);
    this.pendingOrders = this.pendingOrders.filter(o => o.id !== orderId);

    this.renderPendingOrders();
    this.renderAuditLogs();

    // Trigger toast notification
    if (window.SEOC_APP) {
      window.SEOC_APP.showToast(`✓ Order ${orderId} officially authorized & dispatched to SDRF/NDRF Battalion!`, 'success');
    }
  }

  rejectOrder(orderId) {
    const order = this.pendingOrders.find(o => o.id === orderId);
    if (!order) return;

    const newAudit = {
      id: "AUD-0" + (this.auditLogs.length + 90),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + " IST",
      officer: "Rakesh Gundala (IAS) - SEOC Duty Commander",
      orderId: order.id,
      zone: order.zoneName,
      action: "REJECTED / HELD",
      details: `Deployment on hold pending secondary aerial reconnaissance in ${order.zoneName}.`,
      badgeClass: "badge-zone-critical"
    };

    this.auditLogs.unshift(newAudit);
    this.pendingOrders = this.pendingOrders.filter(o => o.id !== orderId);

    this.renderPendingOrders();
    this.renderAuditLogs();

    if (window.SEOC_APP) {
      window.SEOC_APP.showToast(`Order ${orderId} placed on statutory HOLD by Officer.`, 'warning');
    }
  }

  openModifyModal(orderId) {
    const order = this.pendingOrders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('modify-order-id').value = order.id;
    document.getElementById('modify-teams-input').value = order.teams;
    document.getElementById('modify-boats-input').value = order.boats;
    document.getElementById('modify-amb-input').value = order.ambulances;
    document.getElementById('modify-reason-input').value = 'Adjusted based on localized on-ground traffic telemetry.';

    const modal = document.getElementById('modal-modify-allocation');
    if (modal) modal.classList.add('open');
  }

  submitModification() {
    const orderId = document.getElementById('modify-order-id').value;
    const teams = parseInt(document.getElementById('modify-teams-input').value) || 2;
    const boats = parseInt(document.getElementById('modify-boats-input').value) || 5;
    const amb = parseInt(document.getElementById('modify-amb-input').value) || 8;
    const reason = document.getElementById('modify-reason-input').value;

    const order = this.pendingOrders.find(o => o.id === orderId);
    if (order) {
      const newAudit = {
        id: "AUD-0" + (this.auditLogs.length + 90),
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + " IST",
        officer: "Rakesh Gundala (IAS) - SEOC Duty Commander",
        orderId: order.id,
        zone: order.zoneName,
        action: "MODIFIED",
        details: `Manually altered dispatch to: ${teams} NDRF Teams, ${boats} Boats, ${amb} Ambulances. Officer Justification: "${reason}"`,
        badgeClass: "badge-zone-moderate"
      };

      this.auditLogs.unshift(newAudit);
      this.pendingOrders = this.pendingOrders.filter(o => o.id !== orderId);

      this.renderPendingOrders();
      this.renderAuditLogs();
    }

    const modal = document.getElementById('modal-modify-allocation');
    if (modal) modal.classList.remove('open');

    if (window.SEOC_APP) {
      window.SEOC_APP.showToast(`Order ${orderId} modified and logged in immutable statutory audit trail.`, 'info');
    }
  }
}

window.SEOCHitlController = SEOCHitlController;
