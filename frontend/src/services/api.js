import { DEMO_INVESTIGATION, SAMPLE_PRESETS, PRESET_ANALYSES } from './demoData';

const RAW_BASE = import.meta.env.VITE_API_URL || '/api';
const API_BASE = RAW_BASE.replace(/\/+$/, '');

// Local storage key for offline / demo persistence
const STORAGE_KEY = 'aura_qms_investigations_v1';

function getLocalInvestigations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }
  // Initialize with high-fidelity demo dataset
  const initial = [DEMO_INVESTIGATION];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    // Ignore storage quote errors
  }
  return initial;
}

function saveLocalInvestigations(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('localStorage write error:', e);
  }
}

export const api = {
  // Flag indicating backend connectivity
  isLive: null,

  async checkBackend() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(id);
      this.isLive = res.ok;
      return res.ok;
    } catch {
      this.isLive = false;
      return false;
    }
  },

  // Investigations CRUD
  async getInvestigations() {
    try {
      const res = await fetch(`${API_BASE}/investigations`);
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch (err) {
      console.info('[AURA-QMS] Backend not reachable, using interactive demo dataset:', err.message);
    }
    this.isLive = false;
    const list = getLocalInvestigations();
    return list.map((inv) => ({
      id: inv.id,
      investigation_number: inv.investigation_number,
      title: inv.title,
      api_product_name: inv.api_product_name,
      batch_number: inv.batch_number,
      status: inv.status,
      severity: inv.severity,
      incident_date: inv.incident_date,
      primary_root_cause: inv.primary_root_cause,
      root_cause_confidence: inv.root_cause_confidence,
      qualified_person_signoff: inv.qualified_person_signoff,
      signed_by: inv.signed_by
    }));
  },

  async getInvestigation(id) {
    try {
      const res = await fetch(`${API_BASE}/investigations/${id}`);
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch (err) {
      console.info(`[AURA-QMS] Investigation #${id} fallback to local demo store`);
    }
    this.isLive = false;
    const list = getLocalInvestigations();
    const found = list.find((item) => item.id === Number(id)) || list[0] || DEMO_INVESTIGATION;
    return found;
  },

  async createInvestigation(data) {
    try {
      const res = await fetch(`${API_BASE}/investigations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch (err) {
      console.info('[AURA-QMS] Creating investigation in demo local store');
    }
    this.isLive = false;
    const list = getLocalInvestigations();
    const newId = (list.reduce((max, item) => Math.max(max, item.id || 0), 0) || 0) + 1;
    const newInv = {
      ...data,
      id: newId,
      investigation_number: data.investigation_number || `RCA-2026-0${100 + newId}`,
      status: data.status || 'in_review',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      five_whys: data.five_whys || [],
      fishbone_factors: data.fishbone_factors || [],
      evidence_items: data.evidence_items || [],
      capa_items: data.capa_items || [],
      audit_logs: [
        {
          id: Date.now(),
          action: 'CREATED_INVESTIGATION',
          actor: 'Current Investigator',
          details: `Investigation ${data.title || 'Untitled'} created.`,
          timestamp: new Date().toISOString()
        }
      ]
    };
    list.unshift(newInv);
    saveLocalInvestigations(list);
    return newInv;
  },

  async updateInvestigation(id, data) {
    try {
      const res = await fetch(`${API_BASE}/investigations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch (err) {
      console.info(`[AURA-QMS] Updating investigation #${id} in demo local store`);
    }
    this.isLive = false;
    const list = getLocalInvestigations();
    const index = list.findIndex((item) => item.id === Number(id));
    const updated = {
      ...(list[index] || {}),
      ...data,
      id: Number(id),
      updated_at: new Date().toISOString()
    };
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    saveLocalInvestigations(list);
    return updated;
  },

  async deleteInvestigation(id) {
    try {
      const res = await fetch(`${API_BASE}/investigations/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch (err) {
      console.info(`[AURA-QMS] Deleting investigation #${id} in demo local store`);
    }
    this.isLive = false;
    const list = getLocalInvestigations().filter((item) => item.id !== Number(id));
    saveLocalInvestigations(list);
    return { success: true };
  },

  async signOff(id, signedBy, comments) {
    try {
      const res = await fetch(`${API_BASE}/investigations/${id}/sign-off`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signed_by: signedBy,
          approval_comments: comments
        })
      });
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch (err) {
      console.info(`[AURA-QMS] Executing electronic signoff on investigation #${id} locally`);
    }
    this.isLive = false;
    const inv = await this.getInvestigation(id);
    const nowIso = new Date().toISOString();
    inv.qualified_person_signoff = true;
    inv.signed_by = signedBy;
    inv.signed_at = nowIso;
    inv.status = 'qa_approved';
    inv.approval_comments = comments;
    inv.audit_logs = inv.audit_logs || [];
    inv.audit_logs.unshift({
      id: Date.now(),
      action: 'QP_FORMAL_SIGNOFF',
      actor: signedBy,
      details: `FDA 21 CFR Part 11 Electronic Signature applied: ${comments}`,
      timestamp: nowIso
    });
    return await this.updateInvestigation(id, inv);
  },

  // AI Pipeline & Copilot
  async getPresets() {
    try {
      const res = await fetch(`${API_BASE}/ai/presets`);
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return SAMPLE_PRESETS;
  },

  async analyzeText(inputText, documentType = 'pasted_text', documentName = 'Pasted Text') {
    try {
      const res = await fetch(`${API_BASE}/ai/analyze-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_text: inputText,
          document_type: documentType,
          document_name: documentName
        })
      });
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch (err) {
      console.info('[AURA-QMS] Live AI endpoint unavailable, using simulated LangGraph reasoning pipeline');
    }

    // Match preset or return realistic dynamic analysis
    if (inputText.includes('Atorvastatin') || inputText.includes('Impurity-C') || inputText.includes('MS-201-B')) {
      return PRESET_ANALYSES.atorvastatin_oos_impurity;
    }
    if (inputText.includes('Metformin') || inputText.includes('Isopropanol') || inputText.includes('VCD-102')) {
      return PRESET_ANALYSES.metformin_residual_solvent;
    }
    if (inputText.includes('Ciprofloxacin') || inputText.includes('scraper') || inputText.includes('CF-301')) {
      return PRESET_ANALYSES.ciprofloxacin_black_particles;
    }

    // Dynamic fallback for user custom pasted text
    return {
      status: 'success',
      document_name: documentName,
      document_type: documentType,
      confidence_score: 91.5,
      raw_input_text: inputText,
      deviation_info: {
        title: documentName !== 'Pasted Incident Log' ? documentName : 'API Manufacturing Quality Deviation Investigation',
        api_product_name: 'Active Pharmaceutical Ingredient (API)',
        batch_number: 'LOT-' + Math.floor(1000 + Math.random() * 9000),
        manufacturing_unit: 'API Synthesis Block-IV',
        incident_date: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
        process_stage: 'Crystallization & Isolation',
        severity: 'Major',
        summary: inputText.length > 250 ? inputText.slice(0, 250) + '...' : inputText,
        immediate_actions_taken: 'Batch placed under QA quarantine lock; equipment tagged out for root cause verification.'
      },
      root_cause_synthesis: {
        primary_root_cause: 'Operating parameter excursion triggered by mechanical degradation and sensor drift, resulting in crystallization profile variance.',
        root_cause_category: 'Equipment Failure',
        root_cause_rationale: 'Process data analysis and equipment logs confirm physical variance coinciding with the quality event.',
        contributing_factors: [
          'Preventive maintenance interval overdue for high-wear components',
          'Inter-shift logbook communication gap'
        ]
      },
      five_whys: [
        {
          step_number: 1,
          why_question: 'Why did the API quality attribute deviate from standard specification?',
          answer: 'The manufacturing unit experienced an abnormal temperature and pressure profile during crystallization.',
          evidence_support: 'SCADA process trend logs',
          is_root_cause: false
        },
        {
          step_number: 2,
          why_question: 'Why did temperature and pressure profile fluctuate?',
          answer: 'Heat transfer efficiency degraded across the thermal fluid circulation loop.',
          evidence_support: 'Differential pressure telemetry',
          is_root_cause: false
        },
        {
          step_number: 3,
          why_question: 'Why did heat transfer degrade across the loop?',
          answer: 'Fluid micro-restriction occurred due to mechanical seal barrier wear.',
          evidence_support: 'Maintenance teardown inspection log',
          is_root_cause: false
        },
        {
          step_number: 4,
          why_question: 'Why did the mechanical seal suffer premature wear?',
          answer: 'Thermal fatigue occurred under aggressive solvent exposure conditions.',
          evidence_support: 'Seal face microscopic examination',
          is_root_cause: false
        },
        {
          step_number: 5,
          why_question: 'Why was the seal wear not detected prior to batch processing?',
          answer: 'The PM replacement schedule was based on calendar days rather than run-time exposure hours, and predictive vibration monitoring was not in place.',
          evidence_support: 'Engineering Maintenance Schedule SOP-PM-104',
          is_root_cause: true
        }
      ],
      fishbone_factors: [
        {
          category: 'machine',
          factor_name: 'Mechanical Seal Micro-Wear',
          details: 'Secondary seal face exhibited thermal stress marks.',
          verification_status: 'Confirmed Cause',
          evidence_notes: 'Physical teardown verification.'
        },
        {
          category: 'method',
          factor_name: 'PM Maintenance Cycle SOP',
          details: 'PM schedule interval fixed at 180 days instead of 90 days.',
          verification_status: 'Confirmed Cause',
          evidence_notes: 'SOP-PM-104 review.'
        },
        {
          category: 'material',
          factor_name: 'Solvent Reagent Quality',
          details: 'Solvent purity and water content analyzed.',
          verification_status: 'Ruled Out',
          evidence_notes: 'QC COA verified conforming.'
        },
        {
          category: 'measurement',
          factor_name: 'RTD Transmitter Calibration',
          details: 'Sensor loop calibrated within ±0.1°C.',
          verification_status: 'Ruled Out',
          evidence_notes: 'Metrology log verified.'
        }
      ],
      evidence_and_gaps: [
        {
          item_name: 'Batch Manufacturing Record (BMR)',
          evidence_type: 'Batch Record',
          status: 'Verified & Attached',
          description: 'Production steps signed and recorded.',
          gap_impact: 'None',
          ai_identified_gap: false
        },
        {
          item_name: 'SCADA 1-Sec Telemetry Trend',
          evidence_type: 'SCADA / Historian',
          status: 'Verified & Attached',
          description: 'Process sensor historian export.',
          gap_impact: 'None',
          ai_identified_gap: false
        },
        {
          item_name: 'Metrology Annual Sensor Calibration Log',
          evidence_type: 'Calibration Logbook',
          status: 'Missing / Gap Detected',
          description: 'Calibration certificate archive copy required for FDA inspector review.',
          gap_impact: 'Medium - Audit Observation Risk',
          ai_identified_gap: true
        }
      ],
      capa_recommendations: [
        {
          action_type: 'Immediate Containment',
          description: 'Segregate affected batch in QA Quarantine hold area; apply digital ERP ERP hold status.',
          owner_department: 'Quality Assurance',
          assigned_to: 'QA Material Control Lead',
          due_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          effectiveness_criteria: 'Zero unauthorized movement verified in warehouse ERP.'
        },
        {
          action_type: 'Corrective Action',
          description: 'Overhaul affected seal assembly with high-compatibility fluoroelastomer kit and run pressure test.',
          owner_department: 'Maintenance / Engineering',
          assigned_to: 'Senior Reliability Engineer',
          due_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
          effectiveness_criteria: 'Zero pressure loss over 2-hour hydrostatic test.'
        },
        {
          action_type: 'Preventive Action',
          description: 'Revise equipment PM frequency from 180 to 90 days and install SCADA real-time barrier fluid pressure alarm interlocks.',
          owner_department: 'Quality Assurance & Engineering',
          assigned_to: 'QA Compliance Manager',
          due_date: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
          effectiveness_criteria: '3 consecutive production campaigns without seal excursion.'
        }
      ]
    };
  },

  async analyzeDocument(file, documentType = 'pdf_upload') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);

      const res = await fetch(`${API_BASE}/ai/analyze-document`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch {
      // Fallback
    }
    // Extract filename and return robust analysis
    const docName = file.name || 'Uploaded_Document.pdf';
    return await this.analyzeText(
      `Extracted content from ${docName}: Quality Deviation Report in API manufacturing. OOS observed during crystallization. Investigation underway.`,
      documentType,
      docName
    );
  },

  async chatWithCopilot(currentState, userQuery, contextType = 'general') {
    try {
      const res = await fetch(`${API_BASE}/ai/chat-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_state: currentState,
          user_query: userQuery,
          context_type: contextType
        })
      });
      if (res.ok) {
        this.isLive = true;
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Dynamic expert response in demo mode
    const q = (userQuery || '').toLowerCase();
    let reply = `Based on cGMP ICH Q7 & Q9 guidelines for Active Pharmaceutical Ingredients, `;
    if (q.includes('capa') || q.includes('corrective') || q.includes('preventive')) {
      reply += `effective CAPAs must address the verified root cause directly. Immediate containment blocks inventory risk, while Preventive Actions (such as tightening PM intervals from 180 to 90 days and configuring automated SCADA interlocks) prevent recurrence across future campaigns.`;
    } else if (q.includes('fishbone') || q.includes('ishikawa') || q.includes('6m')) {
      reply += `the Ishikawa 6M structure categorizes potential causes across Machine, Method, Milieu, Man, Material, and Measurement. For this deviation, Machine (seal degradation) and Method (PM schedule frequency) are the verified primary drivers.`;
    } else if (q.includes('5 whys') || q.includes('why')) {
      reply += `the 5 Whys deduction systematically moves from the analytical symptom (Impurity-C OOS) through physical mechanisms (crystallization temperature stall and seal micro-leakage) down to the systemic root cause (PM cycle frequency and lack of predictive monitoring).`;
    } else if (q.includes('fda') || q.includes('signoff') || q.includes('audit')) {
      reply += `under FDA 21 CFR Part 11, electronic sign-offs must be time-stamped and bound to the record with authenticated Qualified Person identity and formal cGMP approval rationale.`;
    } else {
      reply += `I recommend reviewing the attached SCADA telemetry trends and verifying that calibration certificates for critical sensors are archived in the Evidence tab prior to final QP sign-off.`;
    }

    return {
      response: reply,
      suggested_actions: ['Review 5 Whys progression', 'Check regulatory evidence gaps', 'Generate inspection PDF']
    };
  }
};
