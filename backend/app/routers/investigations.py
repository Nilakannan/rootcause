import datetime
import random
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import (
    Investigation,
    FiveWhysNode,
    FishboneFactor,
    EvidenceItem,
    CapaItem,
    AuditLog
)
from ..schemas import (
    InvestigationCreate,
    InvestigationUpdate,
    InvestigationResponse,
    SignoffRequest
)

logger = logging.getLogger("rca.investigations_router")
router = APIRouter(prefix="/api/investigations", tags=["Investigations"])


def generate_investigation_number(db: Session) -> str:
    year = datetime.datetime.utcnow().year
    random_suffix = random.randint(1000, 9999)
    candidate = f"RCA-{year}-{random_suffix}"
    while db.query(Investigation).filter(Investigation.investigation_number == candidate).first():
        candidate = f"RCA-{year}-{random.randint(1000, 9999)}"
    return candidate


@router.get("", response_model=List[InvestigationResponse])
def list_investigations(db: Session = Depends(get_db)):
    """Retrieve all investigations ordered by most recently updated."""
    return db.query(Investigation).order_by(Investigation.updated_at.desc()).all()


@router.get("/{investigation_id}", response_model=InvestigationResponse)
def get_investigation(investigation_id: int, db: Session = Depends(get_db)):
    """Retrieve full investigation details including 5 Whys, Fishbone, Evidence, and CAPAs."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation record not found")
    return inv


@router.post("", response_model=InvestigationResponse)
def create_investigation(payload: InvestigationCreate, db: Session = Depends(get_db)):
    """Create and persist a new RCA investigation from AI extraction or template."""
    inv_num = payload.investigation_number or generate_investigation_number(db)
    
    db_inv = Investigation(
        investigation_number=inv_num,
        title=payload.title,
        status=payload.status or "draft",
        api_product_name=payload.api_product_name,
        batch_number=payload.batch_number,
        manufacturing_unit=payload.manufacturing_unit,
        incident_date=payload.incident_date,
        process_stage=payload.process_stage,
        severity=payload.severity,
        summary=payload.summary,
        immediate_actions_taken=payload.immediate_actions_taken,
        source_document_type=payload.source_document_type,
        source_document_name=payload.source_document_name,
        raw_input_text=payload.raw_input_text,
        primary_root_cause=payload.primary_root_cause,
        root_cause_category=payload.root_cause_category,
        root_cause_confidence=payload.root_cause_confidence,
        root_cause_rationale=payload.root_cause_rationale,
        contributing_factors=payload.contributing_factors or [],
        qualified_person_signoff=payload.qualified_person_signoff,
        signed_by=payload.signed_by,
        approval_comments=payload.approval_comments,
    )
    db.add(db_inv)
    db.flush()

    # 5 Whys
    for node in payload.five_whys:
        db.add(FiveWhysNode(
            investigation_id=db_inv.id,
            step_number=node.step_number,
            why_question=node.why_question,
            answer=node.answer,
            evidence_support=node.evidence_support,
            is_root_cause=node.is_root_cause,
            ai_suggested=node.ai_suggested
        ))

    # Fishbone Factors
    for factor in payload.fishbone_factors:
        db.add(FishboneFactor(
            investigation_id=db_inv.id,
            category=factor.category.lower(),
            factor_name=factor.factor_name,
            details=factor.details,
            verification_status=factor.verification_status,
            evidence_notes=factor.evidence_notes,
            ai_suggested=factor.ai_suggested
        ))

    # Evidence Items & Gaps
    for ev in payload.evidence_items:
        db.add(EvidenceItem(
            investigation_id=db_inv.id,
            item_name=ev.item_name,
            evidence_type=ev.evidence_type,
            status=ev.status,
            description=ev.description,
            gap_impact=ev.gap_impact,
            ai_identified_gap=ev.ai_identified_gap
        ))

    # CAPA Items
    for capa in payload.capa_items:
        db.add(CapaItem(
            investigation_id=db_inv.id,
            action_type=capa.action_type,
            description=capa.description,
            owner_department=capa.owner_department,
            assigned_to=capa.assigned_to,
            due_date=capa.due_date,
            status=capa.status,
            effectiveness_criteria=capa.effectiveness_criteria,
            ai_suggested=capa.ai_suggested
        ))

    # Audit Log
    db.add(AuditLog(
        investigation_id=db_inv.id,
        action="INVESTIGATION_CREATED",
        actor="Quality Investigator / AI System",
        details=f"Investigation {inv_num} registered for batch {payload.batch_number} ({payload.api_product_name})."
    ))

    db.commit()
    db.refresh(db_inv)
    return db_inv


@router.put("/{investigation_id}", response_model=InvestigationResponse)
def update_investigation(investigation_id: int, payload: InvestigationUpdate, db: Session = Depends(get_db)):
    """Update fields, review changes, edit 5 Whys, fishbone, evidence, and CAPAs."""
    db_inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not db_inv:
        raise HTTPException(status_code=404, detail="Investigation record not found")

    # Update base fields if provided
    update_data = payload.dict(exclude_unset=True)
    for field in [
        "title", "status", "api_product_name", "batch_number", "manufacturing_unit",
        "incident_date", "process_stage", "severity", "summary", "immediate_actions_taken",
        "source_document_type", "source_document_name", "raw_input_text",
        "primary_root_cause", "root_cause_category", "root_cause_confidence",
        "root_cause_rationale", "contributing_factors", "qualified_person_signoff",
        "signed_by", "approval_comments"
    ]:
        if field in update_data and update_data[field] is not None:
            setattr(db_inv, field, update_data[field])

    # If sub-collections are provided, replace them cleanly
    if payload.five_whys is not None:
        db.query(FiveWhysNode).filter(FiveWhysNode.investigation_id == investigation_id).delete()
        for node in payload.five_whys:
            db.add(FiveWhysNode(
                investigation_id=investigation_id,
                step_number=node.step_number,
                why_question=node.why_question,
                answer=node.answer,
                evidence_support=node.evidence_support,
                is_root_cause=node.is_root_cause,
                ai_suggested=node.ai_suggested
            ))

    if payload.fishbone_factors is not None:
        db.query(FishboneFactor).filter(FishboneFactor.investigation_id == investigation_id).delete()
        for factor in payload.fishbone_factors:
            db.add(FishboneFactor(
                investigation_id=investigation_id,
                category=factor.category.lower(),
                factor_name=factor.factor_name,
                details=factor.details,
                verification_status=factor.verification_status,
                evidence_notes=factor.evidence_notes,
                ai_suggested=factor.ai_suggested
            ))

    if payload.evidence_items is not None:
        db.query(EvidenceItem).filter(EvidenceItem.investigation_id == investigation_id).delete()
        for ev in payload.evidence_items:
            db.add(EvidenceItem(
                investigation_id=investigation_id,
                item_name=ev.item_name,
                evidence_type=ev.evidence_type,
                status=ev.status,
                description=ev.description,
                gap_impact=ev.gap_impact,
                ai_identified_gap=ev.ai_identified_gap
            ))

    if payload.capa_items is not None:
        db.query(CapaItem).filter(CapaItem.investigation_id == investigation_id).delete()
        for capa in payload.capa_items:
            db.add(CapaItem(
                investigation_id=investigation_id,
                action_type=capa.action_type,
                description=capa.description,
                owner_department=capa.owner_department,
                assigned_to=capa.assigned_to,
                due_date=capa.due_date,
                status=capa.status,
                effectiveness_criteria=capa.effectiveness_criteria,
                ai_suggested=capa.ai_suggested
            ))

    # Audit entry
    db.add(AuditLog(
        investigation_id=investigation_id,
        action="INVESTIGATION_UPDATED",
        actor="Investigator",
        details="User modified and saved investigation attributes and RCA findings."
    ))

    db_inv.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(db_inv)
    return db_inv


@router.delete("/{investigation_id}")
def delete_investigation(investigation_id: int, db: Session = Depends(get_db)):
    """Delete investigation record."""
    db_inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not db_inv:
        raise HTTPException(status_code=404, detail="Investigation record not found")
    
    db.delete(db_inv)
    db.commit()
    return {"status": "success", "message": f"Investigation #{investigation_id} deleted"}


@router.post("/{investigation_id}/sign-off", response_model=InvestigationResponse)
def sign_off_investigation(investigation_id: int, req: SignoffRequest, db: Session = Depends(get_db)):
    """Qualified Person (QP) / Head of QA formal regulatory sign-off compliant with 21 CFR Part 11."""
    db_inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not db_inv:
        raise HTTPException(status_code=404, detail="Investigation record not found")

    db_inv.qualified_person_signoff = True
    db_inv.signed_by = req.signed_by
    db_inv.signed_at = datetime.datetime.utcnow()
    db_inv.approval_comments = req.approval_comments or "Approved following formal QA review."
    db_inv.status = "qa_approved"

    db.add(AuditLog(
        investigation_id=investigation_id,
        action="QA_FORMAL_SIGNOFF",
        actor=req.signed_by,
        details=f"Electronic signature affixed by {req.signed_by}. Status changed to QA_APPROVED."
    ))

    db.commit()
    db.refresh(db_inv)
    return db_inv
