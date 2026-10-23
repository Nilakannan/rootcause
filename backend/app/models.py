import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    investigation_number = Column(String(50), unique=True, index=True)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="draft")  # draft, under_ai_analysis, in_review, qa_approved, closed
    
    # Deviation details
    api_product_name = Column(String(150), default="")
    batch_number = Column(String(100), default="")
    manufacturing_unit = Column(String(150), default="")
    incident_date = Column(String(50), default="")
    process_stage = Column(String(100), default="")
    severity = Column(String(50), default="Major")  # Minor, Major, Critical
    summary = Column(Text, default="")
    immediate_actions_taken = Column(Text, default="")
    
    # Source document / intake
    source_document_type = Column(String(50), default="pasted_text") # pdf_upload, pasted_text, email_import, preset
    source_document_name = Column(String(255), default="")
    raw_input_text = Column(Text, default="")
    
    # Root cause analysis synthesis
    primary_root_cause = Column(Text, default="")
    root_cause_category = Column(String(100), default="")
    root_cause_confidence = Column(Float, default=0.0)
    root_cause_rationale = Column(Text, default="")
    contributing_factors = Column(JSON, default=list)
    
    # QA Sign-off
    qualified_person_signoff = Column(Boolean, default=False)
    signed_by = Column(String(150), default="")
    signed_at = Column(DateTime, nullable=True)
    approval_comments = Column(Text, default="")
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    five_whys = relationship("FiveWhysNode", back_populates="investigation", cascade="all, delete-orphan", order_by="FiveWhysNode.step_number")
    fishbone_factors = relationship("FishboneFactor", back_populates="investigation", cascade="all, delete-orphan")
    evidence_items = relationship("EvidenceItem", back_populates="investigation", cascade="all, delete-orphan")
    capa_items = relationship("CapaItem", back_populates="investigation", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="investigation", cascade="all, delete-orphan", order_by="desc(AuditLog.timestamp)")


class FiveWhysNode(Base):
    __tablename__ = "five_whys_nodes"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    step_number = Column(Integer, nullable=False)
    why_question = Column(String(255), nullable=False)
    answer = Column(Text, nullable=False)
    evidence_support = Column(String(255), default="")
    is_root_cause = Column(Boolean, default=False)
    ai_suggested = Column(Boolean, default=True)

    investigation = relationship("Investigation", back_populates="five_whys")


class FishboneFactor(Base):
    __tablename__ = "fishbone_factors"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    category = Column(String(50), nullable=False)  # man, machine, material, method, measurement, milieu
    factor_name = Column(String(255), nullable=False)
    details = Column(Text, default="")
    verification_status = Column(String(50), default="Potential Contributor") # Confirmed Cause, Potential Contributor, Ruled Out, Under Testing
    evidence_notes = Column(Text, default="")
    ai_suggested = Column(Boolean, default=True)

    investigation = relationship("Investigation", back_populates="fishbone_factors")


class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    item_name = Column(String(255), nullable=False)
    evidence_type = Column(String(100), default="Batch Record")  # Batch Record, SCADA / Historian, Lab LIMS / HPLC, Calibration Logbook, Environmental Monitoring, Supplier COA
    status = Column(String(50), default="Verified & Attached") # Verified & Attached, Requested / In Review, Missing / Gap Detected
    description = Column(Text, default="")
    gap_impact = Column(String(100), default="") # None, Low, Medium, High - GMP Compliance Risk
    ai_identified_gap = Column(Boolean, default=False)

    investigation = relationship("Investigation", back_populates="evidence_items")


class CapaItem(Base):
    __tablename__ = "capa_items"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    action_type = Column(String(50), nullable=False) # Immediate Containment, Corrective Action, Preventive Action
    description = Column(Text, nullable=False)
    owner_department = Column(String(100), default="QA")
    assigned_to = Column(String(150), default="")
    due_date = Column(String(50), default="")
    status = Column(String(50), default="Proposed (AI)") # Proposed (AI), Accepted, In Progress, Implemented, Closed
    effectiveness_criteria = Column(Text, default="")
    ai_suggested = Column(Boolean, default=True)

    investigation = relationship("Investigation", back_populates="capa_items")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    action = Column(String(100), nullable=False)
    actor = Column(String(150), default="System")
    details = Column(Text, default="")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    investigation = relationship("Investigation", back_populates="audit_logs")
