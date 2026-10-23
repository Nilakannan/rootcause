"""
Pre-configured realistic API Pharmaceutical Quality Deviations & RCA presets.
Covers diverse API processes: Crystallization & Synthesis, Vacuum Drying, Centrifugation & Isolation.
"""

SAMPLE_SCENARIOS = [
    {
        "id": "atorvastatin_oos_impurity",
        "title": "OOS Impurity-C Spike in Atorvastatin Calcium Synthesis",
        "api_product_name": "Atorvastatin Calcium Trihydrate API",
        "batch_number": "ATV-2026-B089",
        "manufacturing_unit": "API Synthesis Block-IV, Reactor R-201",
        "process_stage": "Crystallization & Isolation",
        "severity": "Critical",
        "document_type": "pdf_upload",
        "document_name": "QA_Deviation_Report_DEV-2026-0412.pdf",
        "raw_text": """QUALITY DEVIATION REPORT (FORM QA-DEV-01)
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
4. Upstream mother liquor wash testing initiated in QC Laboratory."""
    },
    {
        "id": "metformin_residual_solvent",
        "title": "Residual Isopropanol Excursion in Metformin HCl Vacuum Drying",
        "api_product_name": "Metformin Hydrochloride API",
        "batch_number": "MET-2026-904",
        "manufacturing_unit": "API Finishing Block-I, Vacuum Cone Dryer VCD-102",
        "process_stage": "Vacuum / Fluid Bed Drying",
        "severity": "Major",
        "document_type": "email_import",
        "document_name": "Email_Alert_QC_Head_Residual_Solvents.eml",
        "raw_text": """From: dr.mehta.qc@aurapharma.com
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
Lot MET-2026-904 is segregated in Quarantine Zone 4. Please initiate formal RCA immediately. We need 5 Whys and Fishbone evaluation before discussing re-drying protocol."""
    },
    {
        "id": "ciprofloxacin_black_particles",
        "title": "Foreign Particulate Anomaly in Ciprofloxacin HCl Centrifugation",
        "api_product_name": "Ciprofloxacin Hydrochloride Monohydrate API",
        "batch_number": "CIP-2026-118",
        "manufacturing_unit": "API Isolation Suite 3, Basket Centrifuge CF-301",
        "process_stage": "Centrifugation / Filtration",
        "severity": "Critical",
        "document_type": "pasted_text",
        "document_name": "Incident_Logbook_Entry_CF301.txt",
        "raw_text": """INCIDENT LOG ENTRY - SUITE 3 ISOLATION
Timestamp: 2026-10-21 16:15 UTC
Product: Ciprofloxacin Hydrochloride Monohydrate API (USP/BP)
Batch: CIP-2026-118 (Yield: 320 kg wet cake)

Incident Summary:
During physical visual inspection and sampling of the isolated wet cake from Top-Discharge Basket Centrifuge CF-301, the QC in-process sampler noticed sub-millimeter black speck contaminants localized near the bottom circumference of the centrifuge basket cake.

Investigation Findings:
Production stopped immediately. The discharge chute and hydraulic scraper knife assembly were inspected. The PTFE scraper lip blade (Part # PTFE-SCR-40) exhibited severe abrasive gouging on the lower edge, caused by 1.2 mm mechanical misalignment between the scraper guide pin and the rotating basket wall during the cake unloading cycle.
Maintenance work order WO-9912 shows the scraper arm was serviced 4 days prior, but torque alignment verification was signed off without dynamic clearance gauge verification."""
    }
]
