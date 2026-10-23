import logging
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base, SessionLocal
from .models import Investigation, FiveWhysNode, FishboneFactor, EvidenceItem, CapaItem, AuditLog
from .routers import investigations, ai_analysis

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("rca.main")

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise AI-Powered Root Cause Analysis (RCA) & CAPA Suite for API Pharmaceutical Manufacturers."
)

# Enable CORS for React frontend (Vite default port 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(investigations.router)
app.include_router(ai_analysis.router)


@app.on_event("startup")
def seed_initial_demo_if_empty():
    """Seed a realistic initial investigation so the user sees a complete, rich record on launch."""
    db = SessionLocal()
    try:
        count = db.query(Investigation).count()
        if count == 0:
            logger.info("Database is empty. Seeding initial demonstration API RCA investigation...")
            demo_inv = Investigation(
                investigation_number="RCA-2026-0412",
                title="OOS Impurity-C Spike in Atorvastatin Calcium Synthesis",
                status="in_review",
                api_product_name="Atorvastatin Calcium Trihydrate API",
                batch_number="ATV-2026-B089",
                manufacturing_unit="API Synthesis Block-IV, Reactor R-201",
                incident_date="2026-10-18 03:45 UTC",
                process_stage="Crystallization & Isolation",
                severity="Critical",
                summary="Out-of-Specification (OOS) result observed for Related Substance Impurity-C (0.42% w/w vs limit NMT 0.15% w/w). Crystallization temperature ramp stalled at 38°C for 52 minutes due to cooling jacket mechanical seal degradation.",
                immediate_actions_taken="Quarantined Batch ATV-2026-B089 under physical and ERP SAP hold. Reactor R-201 locked out and tagged out (LOTO) for seal teardown inspection.",
                source_document_type="pdf_upload",
                source_document_name="QA_Deviation_Report_DEV-2026-0412.pdf",
                primary_root_cause="Premature mechanical seal failure on Reactor R-201 caused by thermal cycling fatigue and inadequate preventive maintenance frequency (180-day cycle vs 90-day required for aggressive solvent exposure), resulting in cooling fluid micro-leakage and crystallization temperature stall.",
                root_cause_category="Equipment Failure",
                root_cause_confidence=94.5,
                root_cause_rationale="SCADA jacket temperature trends, cooling fluid pressure fluctuations, and physical inspection of disassembled seal MS-201-B confirmed perfluoroelastomer degradation coinciding with the Impurity-C synthesis spike.",
                contributing_factors=[
                    "Lack of automated SCADA barrier fluid pressure alarm interlock",
                    "Shift handover communication gap regarding initial jacket pressure oscillation"
                ],
                qualified_person_signoff=False
            )
            db.add(demo_inv)
            db.flush()

            # Seed 5 Whys
            whys = [
                (1, "Why was Related Substance Impurity-C Out-of-Specification (0.42% vs NMT 0.15%)?", "Excessive thermal degradation occurred during the batch cooling crystallization phase.", "QC HPLC Chromatogram (Run 1018-04)", False),
                (2, "Why did thermal degradation occur during crystallization?", "The cooling temperature stalled at 38°C for 52 minutes instead of cooling linearly at 1.0°C/min.", "SCADA Historian Temperature Trend R-201", False),
                (3, "Why did the crystallization temperature stall?", "Thermal heat transfer through the reactor jacket was restricted due to cooling fluid micro-leakage and pressure drop.", "Jacket differential pressure telemetry log", False),
                (4, "Why did the cooling jacket experience fluid micro-leakage?", "The secondary barrier mechanical seal (MS-201-B) suffered micro-cracking and loss of face compression.", "Physical maintenance inspection teardown sheet", False),
                (5, "Why did the mechanical seal suffer premature degradation and fail in service?", "The Preventive Maintenance (PM) replacement interval was set at 180 days rather than the OEM-mandated 90-day cycle for aggressive organic solvent environments, and predictive vibration/pressure monitoring was absent.", "Engineering PM Master Schedule SOP-PM-104", True)
            ]
            for step, q, a, ev, is_root in whys:
                db.add(FiveWhysNode(
                    investigation_id=demo_inv.id,
                    step_number=step,
                    why_question=q,
                    answer=a,
                    evidence_support=ev,
                    is_root_cause=is_root,
                    ai_suggested=True
                ))

            # Seed 6M Fishbone
            factors = [
                ("machine", "Mechanical Seal Barrier Degradation", "Secondary seal face wore down prematurely under thermal cycling.", "Confirmed Cause", "Teardown confirmed micro-scoring on carbon face."),
                ("machine", "Chiller Pump Impeller Cavitation", "Secondary chiller pump P-204 checked for cavitation vibration.", "Ruled Out", "Vibration analysis within ISO 10816 normal limits."),
                ("method", "Cooling Ramp Rate SOP Execution", "Cooling curve setpoint programmed at 1.0 deg C/min.", "Ruled Out", "DCS recipe audit trail confirmed correct setpoint entered."),
                ("man", "Shift Handover Escalation Gap", "Night shift technician noted pressure fluctuation but did not halt batch.", "Potential Contributor", "Shift handover log lacks explicit variance escalation note."),
                ("material", "Solvent Purity (Ethyl Acetate)", "Recovered solvent lot analyzed for trace peroxides and acid number.", "Ruled Out", "QC COA verified within strict specifications."),
                ("measurement", "Dual RTD Sensor TT-204 Calibration", "Temperature transmitter checked for sensor calibration drift.", "Ruled Out", "Metrology certificate verified accurate to +-0.08 deg C."),
                ("milieu", "Cleanroom ISO 8 HVAC Differential Pressure", "Cleanroom positive pressure maintained at +22 Pa.", "Ruled Out", "BMS historian shows zero pressure excursion.")
            ]
            for cat, name, det, stat, notes in factors:
                db.add(FishboneFactor(
                    investigation_id=demo_inv.id,
                    category=cat,
                    factor_name=name,
                    details=det,
                    verification_status=stat,
                    evidence_notes=notes,
                    ai_suggested=True
                ))

            # Seed Evidence & Gaps
            evidence_data = [
                ("Batch Manufacturing Record (BMR-ATV-089)", "Batch Record", "Verified & Attached", "Operator signed pages for synthesis and isolation.", "None", False),
                ("SCADA 1-Sec Historian Log (Reactor R-201)", "SCADA / Historian", "Verified & Attached", "Continuous temperature and pressure telemetry.", "None", False),
                ("QC HPLC Chromatogram for Impurity-C", "Lab LIMS / HPLC", "Verified & Attached", "Re-injected duplicate confirmation showing 0.42% w/w.", "None", False),
                ("Seal Teardown Work Order WO-2026-9902", "Calibration Logbook", "Verified & Attached", "Maintenance inspection report with photographs.", "None", False),
                ("Metrology Annual Calibration Log for TT-204", "Calibration Logbook", "Missing / Gap Detected", "Formal certificate needed to satisfy FDA inspector inquiry.", "Medium - Audit Observation Risk", True),
                ("Solvent Vendor Raw Material COA Lot 9841", "Supplier COA", "Missing / Gap Detected", "Supplier testing for trace metal impurities pending archive retrieval.", "Low - Supportive Documentation", True)
            ]
            for item, ev_type, stat, desc, gap, ai_gap in evidence_data:
                db.add(EvidenceItem(
                    investigation_id=demo_inv.id,
                    item_name=item,
                    evidence_type=ev_type,
                    status=stat,
                    description=desc,
                    gap_impact=gap,
                    ai_identified_gap=ai_gap
                ))

            # Seed CAPA Items
            capas = [
                ("Immediate Containment", "Quarantine Batch ATV-2026-B089 in warehouse quarantine hold area; affix red physical QA Hold tags and SAP ERP block.", "Quality Assurance", "QA Material Control Lead", "2026-10-19", "Accepted", "100% physical and SAP ERP inventory block verified by QA Lead.", True),
                ("Corrective Action", "Overhaul Reactor R-201 mechanical seal with upgraded FFKM Chemraz perfluoroelastomer kit and conduct 4.5 bar helium pressure hold test.", "Maintenance / Engineering", "Reliability Engineering Lead", "2026-10-25", "In Progress", "Hydrostatic pressure hold at 4.5 bar for 2 hours with zero pressure drop.", True),
                ("Preventive Action", "Revise Preventive Maintenance SOP-PM-104 to reduce seal replacement cycle from 180 to 90 days for all corrosive API reactors.", "Quality Assurance & Engineering", "QA Compliance Manager", "2026-11-15", "Proposed (AI)", "Zero seal-related deviations across 5 consecutive commercial manufacturing campaigns.", True),
                ("Preventive Action", "Configure SCADA automated interlock alarm to trigger audible warning and alert if barrier fluid pressure drops below 1.5 bar.", "Automation & Instrumentation", "Automation Lead", "2026-11-30", "Proposed (AI)", "System functional testing protocol executed and verified in simulation run.", True)
            ]
            for act_type, desc, dept, assignee, due, stat, crit, ai_sug in capas:
                db.add(CapaItem(
                    investigation_id=demo_inv.id,
                    action_type=act_type,
                    description=desc,
                    owner_department=dept,
                    assigned_to=assignee,
                    due_date=due,
                    status=stat,
                    effectiveness_criteria=crit,
                    ai_suggested=ai_sug
                ))

            # Seed Audit Log
            db.add(AuditLog(
                investigation_id=demo_inv.id,
                action="INITIAL_SEEDING",
                actor="System Administrator",
                details="Demonstration investigation RCA-2026-0412 initialized with full GMP dataset."
            ))

            db.commit()
            logger.info("Initial demo investigation seeded successfully!")
    finally:
        db.close()


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "groq_configured": bool(settings.GROQ_API_KEY),
        "primary_model": settings.GROQ_MODEL,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
