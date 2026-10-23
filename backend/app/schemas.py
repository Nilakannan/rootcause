from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

# --- Sub-schemas ---

class FiveWhysNodeBase(BaseModel):
    step_number: int
    why_question: str
    answer: str
    evidence_support: Optional[str] = ""
    is_root_cause: bool = False
    ai_suggested: bool = True

class FiveWhysNodeCreate(FiveWhysNodeBase):
    pass

class FiveWhysNodeResponse(FiveWhysNodeBase):
    id: Optional[int] = None
    investigation_id: Optional[int] = None
    class Config:
        from_attributes = True


class FishboneFactorBase(BaseModel):
    category: str # man, machine, material, method, measurement, milieu
    factor_name: str
    details: Optional[str] = ""
    verification_status: str = "Potential Contributor" # Confirmed Cause, Potential Contributor, Ruled Out, Under Testing
    evidence_notes: Optional[str] = ""
    ai_suggested: bool = True

class FishboneFactorCreate(FishboneFactorBase):
    pass

class FishboneFactorResponse(FishboneFactorBase):
    id: Optional[int] = None
    investigation_id: Optional[int] = None
    class Config:
        from_attributes = True


class EvidenceItemBase(BaseModel):
    item_name: str
    evidence_type: str = "Batch Record"
    status: str = "Verified & Attached" # Verified & Attached, Requested / In Review, Missing / Gap Detected
    description: Optional[str] = ""
    gap_impact: Optional[str] = "" # None, Low, Medium, High - GMP Compliance Risk
    ai_identified_gap: bool = False

class EvidenceItemCreate(EvidenceItemBase):
    pass

class EvidenceItemResponse(EvidenceItemBase):
    id: Optional[int] = None
    investigation_id: Optional[int] = None
    class Config:
        from_attributes = True


class CapaItemBase(BaseModel):
    action_type: str # Immediate Containment, Corrective Action, Preventive Action
    description: str
    owner_department: str = "QA"
    assigned_to: Optional[str] = ""
    due_date: Optional[str] = ""
    status: str = "Proposed (AI)" # Proposed (AI), Accepted, In Progress, Implemented, Closed
    effectiveness_criteria: Optional[str] = ""
    ai_suggested: bool = True

class CapaItemCreate(CapaItemBase):
    pass

class CapaItemResponse(CapaItemBase):
    id: Optional[int] = None
    investigation_id: Optional[int] = None
    class Config:
        from_attributes = True


class AuditLogResponse(BaseModel):
    id: Optional[int] = None
    action: str
    actor: str
    details: Optional[str] = ""
    timestamp: datetime
    class Config:
        from_attributes = True


# --- Investigation Schemas ---

class InvestigationBase(BaseModel):
    title: str
    investigation_number: Optional[str] = None
    status: str = "draft"
    api_product_name: Optional[str] = ""
    batch_number: Optional[str] = ""
    manufacturing_unit: Optional[str] = ""
    incident_date: Optional[str] = ""
    process_stage: Optional[str] = ""
    severity: str = "Major"
    summary: Optional[str] = ""
    immediate_actions_taken: Optional[str] = ""
    source_document_type: Optional[str] = "pasted_text"
    source_document_name: Optional[str] = ""
    raw_input_text: Optional[str] = ""
    primary_root_cause: Optional[str] = ""
    root_cause_category: Optional[str] = ""
    root_cause_confidence: float = 0.0
    root_cause_rationale: Optional[str] = ""
    contributing_factors: List[str] = []
    qualified_person_signoff: bool = False
    signed_by: Optional[str] = ""
    approval_comments: Optional[str] = ""

class InvestigationCreate(InvestigationBase):
    five_whys: List[FiveWhysNodeCreate] = []
    fishbone_factors: List[FishboneFactorCreate] = []
    evidence_items: List[EvidenceItemCreate] = []
    capa_items: List[CapaItemCreate] = []

class InvestigationUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    api_product_name: Optional[str] = None
    batch_number: Optional[str] = None
    manufacturing_unit: Optional[str] = None
    incident_date: Optional[str] = None
    process_stage: Optional[str] = None
    severity: Optional[str] = None
    summary: Optional[str] = None
    immediate_actions_taken: Optional[str] = None
    source_document_type: Optional[str] = None
    source_document_name: Optional[str] = None
    raw_input_text: Optional[str] = None
    primary_root_cause: Optional[str] = None
    root_cause_category: Optional[str] = None
    root_cause_confidence: Optional[float] = None
    root_cause_rationale: Optional[str] = None
    contributing_factors: Optional[List[str]] = None
    qualified_person_signoff: Optional[bool] = None
    signed_by: Optional[str] = None
    approval_comments: Optional[str] = None
    five_whys: Optional[List[FiveWhysNodeCreate]] = None
    fishbone_factors: Optional[List[FishboneFactorCreate]] = None
    evidence_items: Optional[List[EvidenceItemCreate]] = None
    capa_items: Optional[List[CapaItemCreate]] = None

class InvestigationResponse(InvestigationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    signed_at: Optional[datetime] = None
    five_whys: List[FiveWhysNodeResponse] = []
    fishbone_factors: List[FishboneFactorResponse] = []
    evidence_items: List[EvidenceItemResponse] = []
    capa_items: List[CapaItemResponse] = []
    audit_logs: List[AuditLogResponse] = []

    class Config:
        from_attributes = True


# --- AI Analysis Schemas ---

class AIAnalyzeTextRequest(BaseModel):
    input_text: str
    document_type: str = "pasted_text" # pdf_upload, pasted_text, email_import
    document_name: Optional[str] = "Pasted Incident Log"

class AIAnalysisResult(BaseModel):
    deviation_info: dict
    five_whys: List[FiveWhysNodeCreate]
    fishbone_factors: List[FishboneFactorCreate]
    evidence_and_gaps: List[EvidenceItemCreate]
    root_cause_synthesis: dict
    capa_recommendations: List[CapaItemCreate]
    confidence_score: float
    source_citations: List[dict] = []
    investigation_notes: str = ""

class AIChatRefinementRequest(BaseModel):
    current_state: dict
    user_query: str
    context_type: Optional[str] = "general" # five_whys, fishbone, capa, evidence

class SignoffRequest(BaseModel):
    signed_by: str
    approval_comments: Optional[str] = "Approved following thorough QA review and validation."
