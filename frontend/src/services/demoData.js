/**
 * High-fidelity demonstration dataset for AURA-QMS.
 * Enables zero-config interactive showcase when deployed to GitHub Pages or offline.
 */

export const DEMO_INVESTIGATION = {
  id: 1,
  investigation_number: "RCA-2026-0412",
  title: "OOS Impurity-C Spike in Atorvastatin Calcium Synthesis",
  status: "in_review",
  api_product_name: "Atorvastatin Calcium Trihydrate API",
  batch_number: "ATV-2026-B089",
  manufacturing_unit: "API Synthesis Block-IV, Reactor R-201",
  incident_date: "2026-10-18 03:45 UTC",
  process_stage: "Crystallization & Isolation",
  severity: "Critical",
  summary: "Out-of-Specification (OOS) result observed for Related Substance Impurity-C (0.42% w/w vs limit NMT 0.15% w/w). Crystallization temperature ramp stalled at 38°C for 52 minutes due to cooling jacket mechanical seal degradation.",
  immediate_actions_taken: "Quarantined Batch ATV-2026-B089 under physical and ERP SAP hold. Reactor R-201 locked out and tagged out (LOTO) for seal teardown inspection.",
  source_document_type: "pdf_upload",
  source_document_name: "QA_Deviation_Report_DEV-2026-0412.pdf",
  primary_root_cause: "Premature mechanical seal failure on Reactor R-201 caused by thermal cycling fatigue and inadequate preventive maintenance frequency (180-day cycle vs 90-day required for aggressive solvent exposure), resulting in cooling fluid micro-leakage and crystallization temperature stall.",
  root_cause_category: "Equipment Failure",
  root_cause_confidence: 94.5,
  root_cause_rationale: "SCADA jacket temperature trends, cooling fluid pressure fluctuations, and physical inspection of disassembled seal MS-201-B confirmed perfluoroelastomer degradation coinciding with the Impurity-C synthesis spike.",
  contributing_factors: [
    "Lack of automated SCADA barrier fluid pressure alarm interlock",
    "Shift handover communication gap regarding initial jacket pressure oscillation"
  ],
  qualified_person_signoff: false,
  approval_comments: null,
  signed_by: null,
  signed_at: null,
  created_at: "2026-10-18T04:15:00Z",
  updated_at: "2026-10-23T12:00:00Z",
  five_whys: [
    {
      id: 1,
      step_number: 1,
      why_question: "Why was Related Substance Impurity-C Out-of-Specification (0.42% vs NMT 0.15%)?",
      answer: "Excessive thermal degradation occurred during the batch cooling crystallization phase.",
      evidence_support: "QC HPLC Chromatogram (Run 1018-04)",
      is_root_cause: false,
      ai_suggested: true
    },
    {
      id: 2,
      step_number: 2,
      why_question: "Why did thermal degradation occur during crystallization?",
      answer: "The cooling temperature stalled at 38°C for 52 minutes instead of cooling linearly at 1.0°C/min.",
      evidence_support: "SCADA Historian Temperature Trend R-201",
      is_root_cause: false,
      ai_suggested: true
    },
    {
      id: 3,
      step_number: 3,
      why_question: "Why did the crystallization temperature stall?",
      answer: "Thermal heat transfer through the reactor jacket was restricted due to cooling fluid micro-leakage and pressure drop.",
      evidence_support: "Jacket differential pressure telemetry log",
      is_root_cause: false,
      ai_suggested: true
    },
    {
      id: 4,
      step_number: 4,
      why_question: "Why did the cooling jacket experience fluid micro-leakage?",
      answer: "The secondary barrier mechanical seal (MS-201-B) suffered micro-cracking and loss of face compression.",
      evidence_support: "Physical maintenance inspection teardown sheet",
      is_root_cause: false,
      ai_suggested: true
    },
    {
      id: 5,
      step_number: 5,
      why_question: "Why did the mechanical seal suffer premature degradation and fail in service?",
      answer: "The Preventive Maintenance (PM) replacement interval was set at 180 days rather than the OEM-mandated 90-day cycle for aggressive organic solvent environments, and predictive vibration/pressure monitoring was absent.",
      evidence_support: "Engineering PM Master Schedule SOP-PM-104",
      is_root_cause: true,
      ai_suggested: true
    }
  ],
  fishbone_factors: [
    {
      id: 1,
      category: "machine",
      factor_name: "Mechanical Seal Barrier Degradation",
      details: "Secondary seal face wore down prematurely under thermal cycling.",
      verification_status: "Confirmed Cause",
      evidence_notes: "Teardown confirmed micro-scoring on carbon face.",
      ai_suggested: true
    },
    {
      id: 2,
      category: "machine",
      factor_name: "Chiller Pump Impeller Cavitation",
      details: "Secondary chiller pump P-204 checked for cavitation vibration.",
      verification_status: "Ruled Out",
      evidence_notes: "Vibration analysis within ISO 10816 normal limits.",
      ai_suggested: true
    },
    {
      id: 3,
      category: "method",
      factor_name: "Cooling Ramp Rate SOP Execution",
      details: "Cooling curve setpoint programmed at 1.0 deg C/min.",
      verification_status: "Ruled Out",
      evidence_notes: "DCS recipe audit trail confirmed correct setpoint entered.",
      ai_suggested: true
    },
    {
      id: 4,
      category: "man",
      factor_name: "Shift Handover Escalation Gap",
      details: "Night shift technician noted pressure fluctuation but did not halt batch.",
      verification_status: "Potential Contributor",
      evidence_notes: "Shift handover log lacks explicit variance escalation note.",
      ai_suggested: true
    },
    {
      id: 5,
      category: "material",
      factor_name: "Solvent Purity (Ethyl Acetate)",
      details: "Recovered solvent lot analyzed for trace peroxides and acid number.",
      verification_status: "Ruled Out",
      evidence_notes: "QC COA verified within strict specifications.",
      ai_suggested: true
    },
    {
      id: 6,
      category: "measurement",
      factor_name: "Dual RTD Sensor TT-204 Calibration",
      details: "Temperature transmitter checked for sensor calibration drift.",
      verification_status: "Ruled Out",
      evidence_notes: "Metrology certificate verified accurate to +-0.08 deg C.",
      ai_suggested: true
    },
    {
      id: 7,
      category: "milieu",
      factor_name: "Cleanroom ISO 8 HVAC Differential Pressure",
      details: "Cleanroom positive pressure maintained at +22 Pa.",
      verification_status: "Ruled Out",
      evidence_notes: "BMS historian shows zero pressure excursion.",
      ai_suggested: true
    }
  ],
  evidence_items: [
    {
      id: 1,
      item_name: "Batch Manufacturing Record (BMR-ATV-089)",
      evidence_type: "Batch Record",
      status: "Verified & Attached",
      description: "Operator signed pages for synthesis and isolation.",
      gap_impact: "None",
      ai_identified_gap: false
    },
    {
      id: 2,
      item_name: "SCADA 1-Sec Historian Log (Reactor R-201)",
      evidence_type: "SCADA / Historian",
      status: "Verified & Attached",
      description: "Continuous temperature and pressure telemetry.",
      gap_impact: "None",
      ai_identified_gap: false
    },
    {
      id: 3,
      item_name: "QC HPLC Chromatogram for Impurity-C",
      evidence_type: "Lab LIMS / HPLC",
      status: "Verified & Attached",
      description: "Re-injected duplicate confirmation showing 0.42% w/w.",
      gap_impact: "None",
      ai_identified_gap: false
    },
    {
      id: 4,
      item_name: "Seal Teardown Work Order WO-2026-9902",
      evidence_type: "Calibration Logbook",
      status: "Verified & Attached",
      description: "Maintenance inspection report with photographs.",
      gap_impact: "None",
      ai_identified_gap: false
    },
    {
      id: 5,
      item_name: "Metrology Annual Calibration Log for TT-204",
      evidence_type: "Calibration Logbook",
      status: "Missing / Gap Detected",
      description: "Formal certificate needed to satisfy FDA inspector inquiry.",
      gap_impact: "Medium - Audit Observation Risk",
      ai_identified_gap: true
    },
    {
      id: 6,
      item_name: "Solvent Vendor Raw Material COA Lot 9841",
      evidence_type: "Supplier COA",
      status: "Missing / Gap Detected",
      description: "Supplier testing for trace metal impurities pending archive retrieval.",
      gap_impact: "Low - Supportive Documentation",
      ai_identified_gap: true
    }
  ],
  capa_items: [
    {
      id: 1,
      action_type: "Immediate Containment",
      description: "Quarantine Batch ATV-2026-B089 in warehouse quarantine hold area; affix red physical QA Hold tags and SAP ERP block.",
      owner_department: "Quality Assurance",
      assigned_to: "QA Material Control Lead",
      due_date: "2026-10-19",
      status: "Accepted",
      effectiveness_criteria: "100% physical and SAP ERP inventory block verified by QA Lead.",
      ai_suggested: true
    },
    {
      id: 2,
      action_type: "Corrective Action",
      description: "Overhaul Reactor R-201 mechanical seal with upgraded FFKM Chemraz perfluoroelastomer kit and conduct 4.5 bar helium pressure hold test.",
      owner_department: "Maintenance / Engineering",
      assigned_to: "Reliability Engineering Lead",
      due_date: "2026-10-25",
      status: "In Progress",
      effectiveness_criteria: "Hydrostatic pressure hold at 4.5 bar for 2 hours with zero pressure drop.",
      ai_suggested: true
    },
    {
      id: 3,
      action_type: "Preventive Action",
      description: "Revise Preventive Maintenance SOP-PM-104 to reduce seal replacement cycle from 180 to 90 days for all corrosive API reactors.",
      owner_department: "Quality Assurance & Engineering",
      assigned_to: "QA Compliance Manager",
      due_date: "2026-11-15",
      status: "Proposed (AI)",
      effectiveness_criteria: "Zero seal-related deviations across 5 consecutive commercial manufacturing campaigns.",
      ai_suggested: true
    },
    {
      id: 4,
      action_type: "Preventive Action",
      description: "Configure SCADA automated interlock alarm to trigger audible warning and alert if barrier fluid pressure drops below 1.5 bar.",
      owner_department: "Automation & Instrumentation",
      assigned_to: "Automation Lead",
      due_date: "2026-11-30",
      status: "Proposed (AI)",
      effectiveness_criteria: "System functional testing protocol executed and verified in simulation run.",
      ai_suggested: true
    }
  ],
  audit_logs: [
    {
      id: 1,
      action: "INITIAL_SEEDING",
      actor: "System Administrator",
      details: "Demonstration investigation RCA-2026-0412 initialized with full GMP dataset.",
      timestamp: "2026-10-18T05:00:00Z"
    }
  ]
};

export const SAMPLE_PRESETS = [
  {
    id: "atorvastatin_oos_impurity",
    title: "OOS Impurity-C Spike in Atorvastatin Calcium Synthesis",
    api_product_name: "Atorvastatin Calcium Trihydrate API",
    batch_number: "ATV-2026-B089",
    manufacturing_unit: "API Synthesis Block-IV, Reactor R-201",
    process_stage: "Crystallization & Isolation",
    severity: "Critical",
    document_type: "pdf_upload",
    document_name: "QA_Deviation_Report_DEV-2026-0412.pdf",
    raw_text: `QUALITY DEVIATION REPORT (FORM QA-DEV-01)
Facility: Biopharma API Manufacturing Plant 2, Hyderabad Block-IV
Incident ID: DEV-2026-0412
Date/Time of Occurrence: 2026-10-18 03:45 UTC
Product Name: Atorvastatin Calcium Trihydrate API (Ph. Eur. / USP Grade)
Batch Number: ATV-2026-B089 | Batch Size: 450 kg | Stage: Step-6 Final Crystallization

DESCRIPTION OF DEVIATION:
During in-process release testing of Batch ATV-2026-B089, Quality Control reported an Out-of-Specification (OOS) result for Related Substance Impurity-C (Desfluoro-atorvastatin analog). The specification limit is NMT 0.15% (w/w). HPLC assay showed an elevated level of 0.42% (w/w). 

PROCESS LOG SUMMARY:
During the controlled cooling crystallization phase in glass-lined Reactor R-201, the recipe dictated a linear ramp from 65°C down to 15°C over 4.5 hours. SCADA historian logs indicate that at 02:15 UTC, the batch temperature stalled at 38°C for 52 minutes before dropping rapidly. The jacket thermal fluid (ethylene glycol/water 50:50) differential pressure sensor registered a momentary pressure spike of +0.8 bar.

DISASSEMBLY & PRELIMINARY INSPECTION:
Following the event, mechanical maintenance opened the upper manway and examined the double mechanical seal (Tag: MS-201-B). Visual inspection showed thermal scoring and micro-abrasions along the stationary carbon face. Trace glycol residue was detected on the seal barrier chamber drain line. Operator shift log reveals that operator John Doe noticed slight vacuum oscillation but did not escalate per SOP-PR-402 Rev 4.

IMMEDIATE CONTAINMENT ACTIONS:
1. Batch ATV-2026-B089 placed under physical quarantine in Warehouse Hold Room Q-3 with red QA Quarantine tags.
2. Digital ERP inventory status changed to 'QA Block - Pending RCA'.
3. Reactor R-201 locked out and tagged out (LOTO) for mechanical seal teardown and validation.
4. Upstream mother liquor wash testing initiated in QC Laboratory.`
  },
  {
    id: "metformin_residual_solvent",
    title: "Residual Isopropanol Excursion in Metformin HCl Vacuum Drying",
    api_product_name: "Metformin Hydrochloride API",
    batch_number: "MET-2026-904",
    manufacturing_unit: "API Finishing Block-I, Vacuum Cone Dryer VCD-102",
    process_stage: "Vacuum / Fluid Bed Drying",
    severity: "Major",
    document_type: "email_import",
    document_name: "Email_Alert_QC_Head_Residual_Solvents.eml",
    raw_text: `From: dr.mehta.qc@aurapharma.com
To: qa.investigations@aurapharma.com, api.production@aurapharma.com
Date: Mon, 20 Oct 2026 08:30:15 +0530
Subject: HIGH PRIORITY: OOS Residual Isopropanol (IPA) Excursion - Metformin HCl Lot MET-2026-904

Dear QA Investigation Team,

QC Gas Chromatography (Headspace GC-FID) testing for finished Metformin HCl API Batch MET-2026-904 yielded an OOS result for residual Isopropanol (IPA).
- Result: 6,850 ppm (0.685% w/w)
- Specification (ICH Q3C Class 3 Solvents): NMT 5,000 ppm (0.50% w/w)

Process Context:
Drying was executed in Rotary Vacuum Cone Dryer VCD-102 for the standard validated cycle of 14 hours at 60°C under vacuum.
However, DCS vacuum trend review shows that vacuum level degraded from the setpoint of 8-10 mbar absolute up to 55-65 mbar during hours 6 through 11. Operators observed that the vacuum pump oil level was normal, but the vacuum filter bag differential pressure gauge was pegged at maximum (indicating cake blinding).

Containment:
Lot MET-2026-904 is segregated in Quarantine Zone 4. Please initiate formal RCA immediately. We need 5 Whys and Fishbone evaluation before discussing re-drying protocol.`
  },
  {
    id: "ciprofloxacin_black_particles",
    title: "Foreign Particulate Anomaly in Ciprofloxacin HCl Centrifugation",
    api_product_name: "Ciprofloxacin Hydrochloride Monohydrate API",
    batch_number: "CIP-2026-118",
    manufacturing_unit: "API Isolation Suite 3, Basket Centrifuge CF-301",
    process_stage: "Centrifugation / Filtration",
    severity: "Critical",
    document_type: "pasted_text",
    document_name: "Incident_Logbook_Entry_CF301.txt",
    raw_text: `INCIDENT LOG ENTRY - SUITE 3 ISOLATION
Timestamp: 2026-10-21 16:15 UTC
Product: Ciprofloxacin Hydrochloride Monohydrate API (USP/BP)
Batch: CIP-2026-118 (Yield: 320 kg wet cake)

Incident Summary:
During physical visual inspection and sampling of the isolated wet cake from Top-Discharge Basket Centrifuge CF-301, the QC in-process sampler noticed sub-millimeter black speck contaminants localized near the bottom circumference of the centrifuge basket cake.

Investigation Findings:
Production stopped immediately. The discharge chute and hydraulic scraper knife assembly were inspected. The PTFE scraper lip blade (Part # PTFE-SCR-40) exhibited severe abrasive gouging on the lower edge, caused by 1.2 mm mechanical misalignment between the scraper guide pin and the rotating basket wall during the cake unloading cycle.
Maintenance work order WO-9912 shows the scraper arm was serviced 4 days prior, but torque alignment verification was signed off without dynamic clearance gauge verification.`
  }
];

export const PRESET_ANALYSES = {
  atorvastatin_oos_impurity: {
    status: "success",
    document_name: "QA_Deviation_Report_DEV-2026-0412.pdf",
    document_type: "pdf_upload",
    confidence_score: 94.5,
    deviation_info: {
      title: "OOS Impurity-C Spike in Atorvastatin Calcium Synthesis",
      api_product_name: "Atorvastatin Calcium Trihydrate API",
      batch_number: "ATV-2026-B089",
      manufacturing_unit: "API Synthesis Block-IV, Reactor R-201",
      incident_date: "2026-10-18 03:45 UTC",
      process_stage: "Crystallization & Isolation",
      severity: "Critical",
      summary: "Out-of-Specification (OOS) result observed for Related Substance Impurity-C (0.42% w/w vs limit NMT 0.15% w/w). Crystallization temperature ramp stalled at 38°C for 52 minutes due to cooling jacket mechanical seal degradation.",
      immediate_actions_taken: "Quarantined Batch ATV-2026-B089 under physical and ERP SAP hold. Reactor R-201 locked out and tagged out (LOTO) for seal teardown inspection."
    },
    root_cause_synthesis: {
      primary_root_cause: "Premature mechanical seal failure on Reactor R-201 caused by thermal cycling fatigue and inadequate preventive maintenance frequency (180-day cycle vs 90-day required for aggressive solvent exposure), resulting in cooling fluid micro-leakage and crystallization temperature stall.",
      root_cause_category: "Equipment Failure",
      root_cause_rationale: "SCADA jacket temperature trends, cooling fluid pressure fluctuations, and physical inspection of disassembled seal MS-201-B confirmed perfluoroelastomer degradation coinciding with the Impurity-C synthesis spike.",
      contributing_factors: [
        "Lack of automated SCADA barrier fluid pressure alarm interlock",
        "Shift handover communication gap regarding initial jacket pressure oscillation"
      ]
    },
    five_whys: [
      {
        step_number: 1,
        why_question: "Why was Related Substance Impurity-C Out-of-Specification (0.42% vs NMT 0.15%)?",
        answer: "Excessive thermal degradation occurred during the batch cooling crystallization phase.",
        evidence_support: "QC HPLC Chromatogram (Run 1018-04)",
        is_root_cause: false
      },
      {
        step_number: 2,
        why_question: "Why did thermal degradation occur during crystallization?",
        answer: "The cooling temperature stalled at 38°C for 52 minutes instead of cooling linearly at 1.0°C/min.",
        evidence_support: "SCADA Historian Temperature Trend R-201",
        is_root_cause: false
      },
      {
        step_number: 3,
        why_question: "Why did the crystallization temperature stall?",
        answer: "Thermal heat transfer through the reactor jacket was restricted due to cooling fluid micro-leakage and pressure drop.",
        evidence_support: "Jacket differential pressure telemetry log",
        is_root_cause: false
      },
      {
        step_number: 4,
        why_question: "Why did the cooling jacket experience fluid micro-leakage?",
        answer: "The secondary barrier mechanical seal (MS-201-B) suffered micro-cracking and loss of face compression.",
        evidence_support: "Physical maintenance inspection teardown sheet",
        is_root_cause: false
      },
      {
        step_number: 5,
        why_question: "Why did the mechanical seal suffer premature degradation and fail in service?",
        answer: "The Preventive Maintenance (PM) replacement interval was set at 180 days rather than the OEM-mandated 90-day cycle for aggressive organic solvent environments, and predictive vibration/pressure monitoring was absent.",
        evidence_support: "Engineering PM Master Schedule SOP-PM-104",
        is_root_cause: true
      }
    ],
    fishbone_factors: [
      {
        category: "machine",
        factor_name: "Mechanical Seal Barrier Degradation",
        details: "Secondary seal face wore down prematurely under thermal cycling.",
        verification_status: "Confirmed Cause",
        evidence_notes: "Teardown confirmed micro-scoring on carbon face."
      },
      {
        category: "machine",
        factor_name: "Chiller Pump Impeller Cavitation",
        details: "Secondary chiller pump P-204 checked for cavitation vibration.",
        verification_status: "Ruled Out",
        evidence_notes: "Vibration analysis within ISO 10816 normal limits."
      },
      {
        category: "method",
        factor_name: "Cooling Ramp Rate SOP Execution",
        details: "Cooling curve setpoint programmed at 1.0 deg C/min.",
        verification_status: "Ruled Out",
        evidence_notes: "DCS recipe audit trail confirmed correct setpoint entered."
      },
      {
        category: "man",
        factor_name: "Shift Handover Escalation Gap",
        details: "Night shift technician noted pressure fluctuation but did not halt batch.",
        verification_status: "Potential Contributor",
        evidence_notes: "Shift handover log lacks explicit variance escalation note."
      },
      {
        category: "material",
        factor_name: "Solvent Purity (Ethyl Acetate)",
        details: "Recovered solvent lot analyzed for trace peroxides and acid number.",
        verification_status: "Ruled Out",
        evidence_notes: "QC COA verified within strict specifications."
      },
      {
        category: "measurement",
        factor_name: "Dual RTD Sensor TT-204 Calibration",
        details: "Temperature transmitter checked for sensor calibration drift.",
        verification_status: "Ruled Out",
        evidence_notes: "Metrology certificate verified accurate to +-0.08 deg C."
      },
      {
        category: "milieu",
        factor_name: "Cleanroom ISO 8 HVAC Differential Pressure",
        details: "Cleanroom positive pressure maintained at +22 Pa.",
        verification_status: "Ruled Out",
        evidence_notes: "BMS historian shows zero pressure excursion."
      }
    ],
    evidence_and_gaps: [
      {
        item_name: "Batch Manufacturing Record (BMR-ATV-089)",
        evidence_type: "Batch Record",
        status: "Verified & Attached",
        description: "Operator signed pages for synthesis and isolation.",
        gap_impact: "None",
        ai_identified_gap: false
      },
      {
        item_name: "SCADA 1-Sec Historian Log (Reactor R-201)",
        evidence_type: "SCADA / Historian",
        status: "Verified & Attached",
        description: "Continuous temperature and pressure telemetry.",
        gap_impact: "None",
        ai_identified_gap: false
      },
      {
        item_name: "QC HPLC Chromatogram for Impurity-C",
        evidence_type: "Lab LIMS / HPLC",
        status: "Verified & Attached",
        description: "Re-injected duplicate confirmation showing 0.42% w/w.",
        gap_impact: "None",
        ai_identified_gap: false
      },
      {
        item_name: "Seal Teardown Work Order WO-2026-9902",
        evidence_type: "Calibration Logbook",
        status: "Verified & Attached",
        description: "Maintenance inspection report with photographs.",
        gap_impact: "None",
        ai_identified_gap: false
      },
      {
        item_name: "Metrology Annual Calibration Log for TT-204",
        evidence_type: "Calibration Logbook",
        status: "Missing / Gap Detected",
        description: "Formal certificate needed to satisfy FDA inspector inquiry.",
        gap_impact: "Medium - Audit Observation Risk",
        ai_identified_gap: true
      },
      {
        item_name: "Solvent Vendor Raw Material COA Lot 9841",
        evidence_type: "Supplier COA",
        status: "Missing / Gap Detected",
        description: "Supplier testing for trace metal impurities pending archive retrieval.",
        gap_impact: "Low - Supportive Documentation",
        ai_identified_gap: true
      }
    ],
    capa_recommendations: [
      {
        action_type: "Immediate Containment",
        description: "Quarantine Batch ATV-2026-B089 in warehouse quarantine hold area; affix red physical QA Hold tags and SAP ERP block.",
        owner_department: "Quality Assurance",
        assigned_to: "QA Material Control Lead",
        due_date: "2026-10-19",
        effectiveness_criteria: "100% physical and SAP ERP inventory block verified by QA Lead."
      },
      {
        action_type: "Corrective Action",
        description: "Overhaul Reactor R-201 mechanical seal with upgraded FFKM Chemraz perfluoroelastomer kit and conduct 4.5 bar helium pressure hold test.",
        owner_department: "Maintenance / Engineering",
        assigned_to: "Reliability Engineering Lead",
        due_date: "2026-10-25",
        effectiveness_criteria: "Hydrostatic pressure hold at 4.5 bar for 2 hours with zero pressure drop."
      },
      {
        action_type: "Preventive Action",
        description: "Revise Preventive Maintenance SOP-PM-104 to reduce seal replacement cycle from 180 to 90 days for all corrosive API reactors.",
        owner_department: "Quality Assurance & Engineering",
        assigned_to: "QA Compliance Manager",
        due_date: "2026-11-15",
        effectiveness_criteria: "Zero seal-related deviations across 5 consecutive commercial manufacturing campaigns."
      },
      {
        action_type: "Preventive Action",
        description: "Configure SCADA automated interlock alarm to trigger audible warning and alert if barrier fluid pressure drops below 1.5 bar.",
        owner_department: "Automation & Instrumentation",
        assigned_to: "Automation Lead",
        due_date: "2026-11-30",
        effectiveness_criteria: "System functional testing protocol executed and verified in simulation run."
      }
    ]
  },
  metformin_residual_solvent: {
    status: "success",
    document_name: "Email_Alert_QC_Head_Residual_Solvents.eml",
    document_type: "email_import",
    confidence_score: 92.0,
    deviation_info: {
      title: "Residual Isopropanol Excursion in Metformin HCl Vacuum Drying",
      api_product_name: "Metformin Hydrochloride API",
      batch_number: "MET-2026-904",
      manufacturing_unit: "API Finishing Block-I, Vacuum Cone Dryer VCD-102",
      incident_date: "2026-10-20 08:30 UTC",
      process_stage: "Vacuum / Fluid Bed Drying",
      severity: "Major",
      summary: "Finished QC Gas Chromatography testing revealed residual Isopropanol (IPA) at 6,850 ppm, exceeding ICH Q3C limits (NMT 5,000 ppm). Rotary vacuum cone dryer vacuum lost efficiency during hours 6-11 due to filter bag cake blinding.",
      immediate_actions_taken: "Lot MET-2026-904 segregated in Quarantine Zone 4; automated ERP shipping hold initiated."
    },
    root_cause_synthesis: {
      primary_root_cause: "Vacuum filter bag blinding by fine crystalline particulate cake buildup, causing vacuum degradation from 10 mbar to 65 mbar during critical solvent stripping phase.",
      root_cause_category: "Equipment / Process",
      root_cause_rationale: "DCS vacuum curves match filter bag differential pressure gauge maxout; inspection confirmed hardened cake layer on bag fabric.",
      contributing_factors: [
        "Bag pulse-jet nitrogen blowback cleaning cycle frequency set too low for fine-grade crystal lots",
        "Lack of high differential pressure alarm on VCD-102 filter housing"
      ]
    },
    five_whys: [
      {
        step_number: 1,
        why_question: "Why was residual Isopropanol (IPA) above specification at 6,850 ppm?",
        answer: "Thermal mass transfer of volatile solvent stalled during the final drying phase.",
        evidence_support: "Headspace GC-FID analytical run report",
        is_root_cause: false
      },
      {
        step_number: 2,
        why_question: "Why did mass transfer stall during drying?",
        answer: "Effective chamber vacuum degraded from 8-10 mbar up to 55-65 mbar absolute.",
        evidence_support: "VCD-102 DCS vacuum transmitter log",
        is_root_cause: false
      },
      {
        step_number: 3,
        why_question: "Why did vacuum degrade despite normal vacuum pump operation?",
        answer: "Vacuum draw was choked across the vapor line by severe filter bag cake blinding.",
        evidence_support: "Physical differential pressure gauge pegged at maximum scale",
        is_root_cause: false
      },
      {
        step_number: 4,
        why_question: "Why did the filter bags experience blinding?",
        answer: "Nitrogen reverse-pulse blowback cleaning was insufficient to dislodge the micronized crystal dust cake.",
        evidence_support: "Inspection of dismounted filter bags showing 4 mm compressed crust",
        is_root_cause: false
      },
      {
        step_number: 5,
        why_question: "Why was the blowback cleaning cycle insufficient?",
        answer: "The pulse-jet interval was fixed at 30 minutes without adaptive differential pressure feedback, and bag porosity was unsuited for high-fines milling campaigns.",
        evidence_support: "Dryer recipe SOP-DRY-202 & OEM filtration specification",
        is_root_cause: true
      }
    ],
    fishbone_factors: [
      {
        category: "machine",
        factor_name: "Vacuum Filter Bag Cake Blinding",
        details: "Micronized crystal fines blinded gore-tex filter bag pores.",
        verification_status: "Confirmed Cause",
        evidence_notes: "Differential pressure sensor pegged; physical cake encrusted."
      },
      {
        category: "machine",
        factor_name: "Liquid Ring Vacuum Pump P-102 Impeller",
        details: "Vacuum pump sealant fluid temperature and seal check.",
        verification_status: "Ruled Out",
        evidence_notes: "Pump oil and seal fluid parameters verified normal."
      },
      {
        category: "method",
        factor_name: "Nitrogen Pulse-Jet Cleaning Frequency",
        details: "Cleaning pulse timed at 30 min intervals regardless of dP.",
        verification_status: "Potential Contributor",
        evidence_notes: "Fixed recipe lacks dynamic differential pressure trigger."
      },
      {
        category: "material",
        factor_name: "Particle Size Distribution (D90 < 25 um)",
        details: "Upstream wet cake milling produced higher fines fraction.",
        verification_status: "Potential Contributor",
        evidence_notes: "Laser diffraction PSD confirmed smaller median crystal size."
      },
      {
        category: "measurement",
        factor_name: "Dryer Vacuum Gauge Calibration",
        details: "Capacitance manometer calibration check.",
        verification_status: "Ruled Out",
        evidence_notes: "Calibration verified accurate within ±0.5 mbar."
      },
      {
        category: "milieu",
        factor_name: "Dryer Nitrogen Header Pressure",
        details: "Supply pressure for blowback header verified at 6.2 bar.",
        verification_status: "Ruled Out",
        evidence_notes: "Gas utility logs show stable pressure throughout cycle."
      }
    ],
    evidence_and_gaps: [
      {
        item_name: "GC-FID Residual Solvents Chromatogram",
        evidence_type: "Lab LIMS / HPLC",
        status: "Verified & Attached",
        description: "Re-tested in duplicate; verified 6,850 ppm IPA.",
        gap_impact: "None",
        ai_identified_gap: false
      },
      {
        item_name: "VCD-102 Vacuum & Jacket Temperature Historian Log",
        evidence_type: "SCADA / Historian",
        status: "Verified & Attached",
        description: "Confirmed vacuum stall between hours 6 and 11.",
        gap_impact: "None",
        ai_identified_gap: false
      },
      {
        item_name: "Filter Bag Differential Pressure Trend Log",
        evidence_type: "SCADA / Historian",
        status: "Missing / Gap Detected",
        description: "Local dial gauge was manual; electronic logging trend required for regulatory submission.",
        gap_impact: "High - Critical Evidence Gap",
        ai_identified_gap: true
      }
    ],
    capa_recommendations: [
      {
        action_type: "Immediate Containment",
        description: "Maintain physical and SAP inventory quarantine on Metformin HCl Lot MET-2026-904. Formulate validated re-drying protocol.",
        owner_department: "Quality Assurance",
        assigned_to: "QA Material Control Lead",
        due_date: "2026-10-21",
        effectiveness_criteria: "Quarantine status confirmed in ERP; zero unauthorized movement."
      },
      {
        action_type: "Corrective Action",
        description: "Replace blinded filter bags with anti-static PTFE membrane bags and install automated pulse-jet frequency controller.",
        owner_department: "Engineering / Maintenance",
        assigned_to: "Plant Maintenance Manager",
        due_date: "2026-10-28",
        effectiveness_criteria: "Dryer vacuum performance restored to < 10 mbar throughout test run."
      },
      {
        action_type: "Preventive Action",
        description: "Upgrade VCD-102 instrumentation with electronic differential pressure transmitter wired to DCS high-alarm interlock.",
        owner_department: "Instrumentation & Automation",
        assigned_to: "Automation Lead",
        due_date: "2026-11-20",
        effectiveness_criteria: "SCADA alarm triggers reverse-pulse burst when dP exceeds 25 mbar."
      }
    ]
  },
  ciprofloxacin_black_particles: {
    status: "success",
    document_name: "Incident_Logbook_Entry_CF301.txt",
    document_type: "pasted_text",
    confidence_score: 96.0,
    deviation_info: {
      title: "Foreign Particulate Anomaly in Ciprofloxacin HCl Centrifugation",
      api_product_name: "Ciprofloxacin Hydrochloride Monohydrate API",
      batch_number: "CIP-2026-118",
      manufacturing_unit: "API Isolation Suite 3, Basket Centrifuge CF-301",
      incident_date: "2026-10-21 16:15 UTC",
      process_stage: "Centrifugation / Filtration",
      severity: "Critical",
      summary: "QC in-process sampling identified sub-millimeter black particulate contaminants near bottom circumference of wet cake. Hydraulic scraper knife blade exhibited abrasive gouging due to 1.2 mm guide pin misalignment.",
      immediate_actions_taken: "Centrifuge CF-301 halted immediately; 320 kg wet cake quarantined; LOTO applied."
    },
    root_cause_synthesis: {
      primary_root_cause: "1.2 mm mechanical guide pin misalignment on hydraulic scraper arm following maintenance servicing, causing blade friction contact with rotating basket wall and PTFE particle shedding.",
      root_cause_category: "Mechanical Misalignment / Maintenance SOP",
      root_cause_rationale: "Physical inspection of knife lip confirmed abrasive scoring matching the circumferential contact mark inside the centrifuge basket rim.",
      contributing_factors: [
        "Maintenance signoff procedure lacked mandatory dynamic feeder gauge verification",
        "Absence of laser or proximity gap sensors on scraper knife clearance"
      ]
    },
    five_whys: [
      {
        step_number: 1,
        why_question: "Why were foreign black particles present in Ciprofloxacin HCl wet cake?",
        answer: "Polymeric particles were sheared off the discharge scraper blade into the product bed.",
        evidence_support: "FTIR spectroscopy confirmed material is fluoropolymer (PTFE)",
        is_root_cause: false
      },
      {
        step_number: 2,
        why_question: "Why was material sheared from the scraper blade?",
        answer: "The scraper knife blade rubbed against the rotating basket wall during the bottom cake discharge cycle.",
        evidence_support: "Visual teardown inspection photos showing gouged scraper lip",
        is_root_cause: false
      },
      {
        step_number: 3,
        why_question: "Why did the scraper knife rub against the basket wall?",
        answer: "The radial clearance between blade edge and basket wall fell below 0 mm due to a 1.2 mm angular guide pin tilt.",
        evidence_support: "Precision dial indicator measurement of scraper arm pivot",
        is_root_cause: false
      },
      {
        step_number: 4,
        why_question: "Why was the guide pin tilted by 1.2 mm?",
        answer: "During servicing under WO-9912, the technician reassembled the pivot without using the OEM alignment fixture jig.",
        evidence_support: "Maintenance technician interview and work order review",
        is_root_cause: false
      },
      {
        step_number: 5,
        why_question: "Why was the pivot reassembled without the mandatory OEM alignment fixture jig?",
        answer: "Maintenance SOP-MNT-304 did not include a mandatory Quality Assurance witnessing hold point or dynamic feeder feeler gauge tolerance sign-off prior to releasing equipment back to production.",
        evidence_support: "Engineering SOP-MNT-304 Rev 2 review",
        is_root_cause: true
      }
    ],
    fishbone_factors: [
      {
        category: "machine",
        factor_name: "Centrifuge Scraper Arm Pivot Misalignment",
        details: "1.2 mm angular tilt on guide pin caused blade to contact basket.",
        verification_status: "Confirmed Cause",
        evidence_notes: "Teardown confirmed gouged scraper lip and basket contact ring."
      },
      {
        category: "method",
        factor_name: "Post-Maintenance Clearance Verification SOP",
        details: "SOP lacked quantitative feeler gauge verification tolerance limits.",
        verification_status: "Confirmed Cause",
        evidence_notes: "SOP-MNT-304 reviewed; missing dynamic clearance check step."
      },
      {
        category: "man",
        factor_name: "Maintenance Technician Reassembly Execution",
        details: "Technician tightened pivot bolts without alignment jig fixture.",
        verification_status: "Confirmed Cause",
        evidence_notes: "WO-9912 signoff lacked QA engineering counter-signature."
      },
      {
        category: "material",
        factor_name: "Scraper Lip Material Composition",
        details: "Material of construction verified as FDA-compliant food grade PTFE.",
        verification_status: "Ruled Out",
        evidence_notes: "Material MTR certificate confirmed OEM virgin PTFE."
      },
      {
        category: "measurement",
        factor_name: "Basket Runout & Vibration Sensor",
        details: "Accelerometer telemetry during high-speed spin cycle.",
        verification_status: "Ruled Out",
        evidence_notes: "Dynamic balance vibration was within 0.8 mm/s ISO limit."
      },
      {
        category: "milieu",
        factor_name: "Centrifuge Room Static Dissipation Grounding",
        details: "Grounding straps tested for electrostatic dissipation.",
        verification_status: "Ruled Out",
        evidence_notes: "Resistance to ground measured < 10 ohms."
      }
    ],
    evidence_and_gaps: [
      {
        item_name: "FTIR Micro-Spectroscopy Analysis Report",
        evidence_type: "Lab LIMS / HPLC",
        status: "Verified & Attached",
        description: "Confirmed black specks match PTFE scraper material.",
        gap_impact: "None",
        ai_identified_gap: false
      },
      {
        item_name: "Scraper Blade Inspection Photos & Feeler Gauge Log",
        evidence_type: "Calibration Logbook",
        status: "Verified & Attached",
        description: "High-resolution photos documenting gouge on scraper edge.",
        gap_impact: "None",
        ai_identified_gap: false
      },
      {
        item_name: "Centrifuge CF-301 Basket Dynamic Balance Certification",
        evidence_type: "Calibration Logbook",
        status: "Missing / Gap Detected",
        description: "Annual dynamic balancing calibration certificate required for regulatory dossier.",
        gap_impact: "Medium - Audit Observation Risk",
        ai_identified_gap: true
      }
    ],
    capa_recommendations: [
      {
        action_type: "Immediate Containment",
        description: "Reject and formally incinerate contaminated 320 kg Ciprofloxacin wet cake Lot CIP-2026-118 per Hazardous Waste SOP. Lock out CF-301.",
        owner_department: "Quality Assurance",
        assigned_to: "QA Operations Head",
        due_date: "2026-10-22",
        effectiveness_criteria: "Complete destruction manifest signed and witnessed by QA Lead."
      },
      {
        action_type: "Corrective Action",
        description: "Replace gouged scraper blade and rebuild pivot arm assembly using certified OEM optical alignment fixture. Perform dynamic feeler gauge check at 2.5 mm clearance.",
        owner_department: "Mechanical Engineering",
        assigned_to: "Senior Mechanical Engineer",
        due_date: "2026-10-27",
        effectiveness_criteria: "Feeler gauge clearance verified at 2.5 mm ± 0.2 mm across 360-degree basket rotation."
      },
      {
        action_type: "Preventive Action",
        description: "Revise Centrifuge Maintenance SOP-MNT-304 to mandate QA Engineering witnessing hold point and feeler gauge verification for all scraper assembly interventions.",
        owner_department: "Quality Assurance & Engineering",
        assigned_to: "QA Compliance Specialist",
        due_date: "2026-11-10",
        effectiveness_criteria: "100% adherence to mandatory dual-signoff hold points on maintenance work orders."
      }
    ]
  }
};
