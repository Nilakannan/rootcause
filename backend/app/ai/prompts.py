"""
Pharmaceutical Quality Investigation & RCA System Prompts
Compliant with:
- ICH Q7: Good Manufacturing Practice Guide for Active Pharmaceutical Ingredients
- ICH Q9: Quality Risk Management
- ICH Q10: Pharmaceutical Quality System
- FDA 21 CFR Part 211 / cGMP
"""

SYSTEM_RCA_EXPERT = """You are an elite Senior Quality Assurance & Technical Operations Investigator specializing in Active Pharmaceutical Ingredients (API) chemical synthesis, crystallization, and isolation processes under FDA cGMP, ICH Q7, and ICH Q10 guidelines.

Your mission is to conduct a rigorous, science-based, and data-driven Root Cause Analysis (RCA) on an API manufacturing quality deviation or lab OOS incident.

Key Principles for API Pharma Investigations:
1. True Root Cause vs. Symptom: Never stop at human error or superficial symptoms (e.g. "operator opened wrong valve"). Always investigate the deeper systemic, engineering, sensor drift, maintenance, or process design deficiencies that enabled the issue.
2. Ishikawa 6Ms: Systematically categorize factors into Man (human factors/training/qualification), Machine (equipment/piping/sensors/seals), Material (raw materials/solvents/reagents/catalysts), Method (SOPs/recipes/cooling curves), Measurement (analytical/HPLC/calibration/sampling), and Milieu (cleanroom/HVAC/particulate/relative humidity).
3. Evidence vs. Assumption: Distinguish confirmed facts from hypotheses. Highlight critical missing evidence or unverified assumptions that regulatory inspectors (FDA/EMA) would flag.
4. Robust CAPA: Actions must include: Immediate Containment (batch quarantine), Corrective Action (eliminate root cause), and Preventive Action (prevent recurrence across lines/products), with objective, measurable effectiveness checks (e.g., 3 consecutive validation batches).

Always return responses strictly adhering to the requested JSON structure.
"""

DEVIATION_EXTRACTION_PROMPT = """Analyze the provided incident document, email, or raw text for an Active Pharmaceutical Ingredient (API) quality deviation.
Extract all key regulatory facts into valid JSON.

Document Content:
\"\"\"{input_text}\"\"\"

Required JSON schema:
{{
  "title": "Concise technical title (e.g., 'OOS Related Substance Impurity-C in Atorvastatin Calcium Batch ATV-2026-B089')",
  "api_product_name": "API name (e.g. Atorvastatin Calcium Trihydrate API, Metformin HCl, etc.)",
  "batch_number": "Lot/Batch number if found, or 'N/A'",
  "manufacturing_unit": "Facility block, reactor, or cleanroom line (e.g., 'API Block-IV, Reactor R-201')",
  "incident_date": "Date/time of deviation or 'Recent'",
  "process_stage": "One of: Reaction / Synthesis, Crystallization & Isolation, Centrifugation / Filtration, Vacuum / Fluid Bed Drying, Milling & Micronization, Analytical QC Testing, Packaging",
  "severity": "Critical (patient impact/sterility/OOS critical quality attribute), Major (process parameter excursion/yield drop/yield limit), or Minor (documentation/minor drift)",
  "summary": "Clear, professional 2-3 sentence technical summary of the observed deviation and symptoms.",
  "immediate_actions_taken": "Immediate containment steps executed (e.g. quarantined batch, halted downstream processing, purged lines, initiated investigation).",
  "citations": [
    {{"field": "severity", "snippet": "exact quote from text justifying this"}},
    {{"field": "batch_number", "snippet": "exact quote from text"}}
  ]
}}
"""

FIVE_WHYS_PROMPT = """Based on the API manufacturing deviation below, construct a rigorous 5 Whys causal chain.
Move progressively from the observed physical symptom down to the systemic engineering or procedural root cause.

Deviation Details:
Title: {title}
API Product: {api_product_name}
Process Stage: {process_stage}
Summary: {summary}
Input Raw Content:
\"\"\"{input_text}\"\"\"

Requirements:
- Provide exactly 5 steps (Why 1 to Why 5).
- Step 5 must represent the fundamental root cause (set is_root_cause=true).
- For each step, cite supporting evidence or mark 'Pending log verification' if assumed.

Required JSON schema:
{{
  "five_whys": [
    {{
      "step_number": 1,
      "why_question": "Why did the primary symptom occur?",
      "answer": "Clear technical answer based on evidence.",
      "evidence_support": "Citation from batch record, SCADA, or lab chromatogram.",
      "is_root_cause": false
    }},
    {{
      "step_number": 2,
      "why_question": "Why did that happen?",
      "answer": "Technical explanation.",
      "evidence_support": "Evidence citation.",
      "is_root_cause": false
    }},
    {{
      "step_number": 3,
      "why_question": "Why was that condition allowed to develop?",
      "answer": "Technical explanation.",
      "evidence_support": "Evidence citation.",
      "is_root_cause": false
    }},
    {{
      "step_number": 4,
      "why_question": "Why was the barrier or control insufficient to detect or prevent it?",
      "answer": "Technical explanation.",
      "evidence_support": "Evidence citation.",
      "is_root_cause": false
    }},
    {{
      "step_number": 5,
      "why_question": "What fundamental management system, maintenance PM, or design flaw caused this?",
      "answer": "Definitive systemic root cause.",
      "evidence_support": "Systemic evidence.",
      "is_root_cause": true
    }}
  ]
}}
"""

FISHBONE_PROMPT = """Analyze the API quality deviation using the Ishikawa 6M Framework:
1. Man (Human factors, SOP adherence, training, shift handoff, fatigue)
2. Machine (Reactors, chillers, agitator seals, valves, sensors, filter integrity)
3. Material (Solvent purity, raw material assay, reagent degradation, recycled mother liquor)
4. Method (Batch manufacturing record SOP, cooling ramp rate, washing volume, hold time)
5. Measurement (HPLC baseline drift, column contamination, temperature sensor calibration, sample bias)
6. Milieu / Environment (Cleanroom ISO rating, differential pressure, relative humidity, particulate count)

Incident Details:
Title: {title}
API Product: {api_product_name}
Summary: {summary}
Input Document Content:
\"\"\"{input_text}\"\"\"

Requirements:
- Provide 2 to 3 realistic, technical factors for EACH of the 6 categories.
- Assign verification_status: 'Confirmed Cause', 'Potential Contributor', 'Ruled Out', or 'Under Testing'.
- Detail evidence notes for each factor.

Required JSON schema:
{{
  "fishbone_factors": [
    {{
      "category": "machine",
      "factor_name": "Mechanical Seal Glycol Leakage",
      "details": "Secondary barrier seal degraded allowing trace cooling medium ingress into reaction mass.",
      "verification_status": "Confirmed Cause",
      "evidence_notes": "Seal pressure drop noted on SCADA at 04:12 UTC; trace ethylene glycol found in reaction mixture."
    }}
  ]
}}
"""

GAP_ANALYSIS_PROMPT = """Perform an evidence strength evaluation and regulatory Gap Analysis under FDA cGMP and ICH Q7 expectations for this API deviation investigation.

Identify:
1. What evidence is already verified and attached (e.g. SCADA historian trend, HPLC chromatogram, batch record page).
2. What critical evidence is MISSING or needed for defensible regulatory sign-off (e.g. sensor calibration certificates, supplier COA, cleaning validation swab results, maintenance work orders).

Incident Details:
Title: {title}
API Product: {api_product_name}
Process Stage: {process_stage}
Input Document Content:
\"\"\"{input_text}\"\"\"

Required JSON schema:
{{
  "evidence_and_gaps": [
    {{
      "item_name": "SCADA Temperature Historian Trend (R-201)",
      "evidence_type": "SCADA / Historian",
      "status": "Verified & Attached",
      "description": "Continuous 1-second interval temperature log for the crystallization jacket.",
      "gap_impact": "None",
      "ai_identified_gap": false
    }},
    {{
      "item_name": "Calibrated RTD Sensor Calibration Certificate (TT-204)",
      "evidence_type": "Calibration Logbook",
      "status": "Missing / Gap Detected",
      "description": "Annual calibration record for temperature transmitter TT-204 to rule out thermal sensor drift.",
      "gap_impact": "High - Regulatory GMP audit vulnerability if not verified",
      "ai_identified_gap": true
    }}
  ]
}}
"""

ROOT_CAUSE_AND_CAPA_PROMPT = """Synthesize the Primary Root Cause, Contributing Factors, and formal Corrective and Preventive Actions (CAPA) for this API deviation.

Incident:
Title: {title}
API: {api_product_name}
Stage: {process_stage}
5 Whys Root Conclusion: {five_whys_root}
Fishbone Confirmed Causes: {fishbone_confirmed}

Input Document Content:
\"\"\"{input_text}\"\"\"

Requirements for CAPA:
1. Immediate Containment Action: Quarantine affected batch, halt downstream processing, sample inspection.
2. Corrective Action (CA): Directly correct the identified failure mechanism.
3. Preventive Action (PA): Long-term system/equipment upgrade, PM schedule revision, automated interlock, SOP retraining.
4. Include clear owner departments (Engineering, Production, QA, QC, Maintenance), target due dates, and objective Effectiveness Check criteria (e.g., '3 consecutive commercial batches showing Impurity-C < 0.05% with Cpk > 1.33').

Required JSON schema:
{{
  "root_cause_synthesis": {{
    "primary_root_cause": "Comprehensive technical statement of the primary root cause.",
    "root_cause_category": "Equipment Failure | Process Parameter Excursion | Material Quality | Human Error / Training Gap | Environmental Anomaly | Analytical / Method Error",
    "root_cause_confidence": 92.5,
    "root_cause_rationale": "Scientific explanation linking the evidence to this conclusion.",
    "contributing_factors": [
      "Secondary contributing factor 1",
      "Secondary contributing factor 2"
    ]
  }},
  "capa_recommendations": [
    {{
      "action_type": "Immediate Containment",
      "description": "Quarantine Batch ATV-2026-B089 in warehouse quarantine hold area; affix red physical QA Hold tags.",
      "owner_department": "Quality Assurance",
      "assigned_to": "QA Material Control Lead",
      "due_date": "Immediate (24 hrs)",
      "status": "Proposed (AI)",
      "effectiveness_criteria": "100% physical and SAP ERP inventory block verified by QA Lead."
    }},
    {{
      "action_type": "Corrective Action",
      "description": "Replace worn mechanical seal on Reactor R-201 with FFKM perfluoroelastomer seal kit and re-pressure test.",
      "owner_department": "Maintenance / Mechanical Engineering",
      "assigned_to": "Lead Reliability Engineer",
      "due_date": "Within 5 days",
      "status": "Proposed (AI)",
      "effectiveness_criteria": "Hydrostatic pressure test at 4.5 bar hold for 2 hours with zero pressure drop."
    }},
    {{
      "action_type": "Preventive Action",
      "description": "Integrate SCADA automated safety interlock to trigger audio-visual alarm and auto-vent if cooling jacket delta-T exceeds 5.0 deg C for > 60 seconds.",
      "owner_department": "Process Automation & Instrumentation",
      "assigned_to": "Automation Specialist",
      "due_date": "Within 30 days",
      "status": "Proposed (AI)",
      "effectiveness_criteria": "Simulation validation protocol executed; 3 consecutive production batches operating without spurious trips."
    }}
  ]
}}
"""
