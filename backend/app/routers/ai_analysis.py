import io
import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pypdf import PdfReader
from typing import Optional, List
from ..schemas import (
    AIAnalyzeTextRequest,
    AIAnalysisResult,
    AIChatRefinementRequest,
    FiveWhysNodeCreate,
    FishboneFactorCreate,
    EvidenceItemCreate,
    CapaItemCreate
)
from ..ai.workflow import execute_rca_pipeline
from ..ai.groq_client import groq_ai_client
from ..ai.sample_data import SAMPLE_SCENARIOS
from ..ai.prompts import SYSTEM_RCA_EXPERT

logger = logging.getLogger("rca.ai_router")
router = APIRouter(prefix="/api/ai", tags=["AI Investigation Engine"])


@router.get("/presets")
def get_sample_presets():
    """Return realistic API pharma deviation templates for 1-click demo/testing."""
    return [
        {
            "id": s["id"],
            "title": s["title"],
            "api_product_name": s["api_product_name"],
            "batch_number": s["batch_number"],
            "process_stage": s["process_stage"],
            "severity": s["severity"],
            "document_type": s["document_type"],
            "document_name": s["document_name"],
            "raw_text": s["raw_text"]
        }
        for s in SAMPLE_SCENARIOS
    ]


@router.get("/presets/{preset_id}")
def get_preset_by_id(preset_id: str):
    """Retrieve full preset text and metadata."""
    for s in SAMPLE_SCENARIOS:
        if s["id"] == preset_id:
            return s
    raise HTTPException(status_code=404, detail="Preset scenario not found")


@router.post("/analyze-text")
def analyze_raw_text(req: AIAnalyzeTextRequest):
    """Run LangGraph RCA pipeline on raw text or imported email content."""
    if not req.input_text or len(req.input_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Input text must be at least 20 characters long.")

    try:
        pipeline_output = execute_rca_pipeline(
            input_text=req.input_text,
            document_name=req.document_name or "Pasted Incident Log",
            document_type=req.document_type
        )
        
        return {
            "status": "success",
            "document_name": req.document_name,
            "document_type": req.document_type,
            "deviation_info": pipeline_output.get("deviation_info", {}),
            "five_whys": pipeline_output.get("five_whys", []),
            "fishbone_factors": pipeline_output.get("fishbone_factors", []),
            "evidence_and_gaps": pipeline_output.get("evidence_and_gaps", []),
            "root_cause_synthesis": pipeline_output.get("root_cause_synthesis", {}),
            "capa_recommendations": pipeline_output.get("capa_recommendations", []),
            "confidence_score": pipeline_output.get("confidence_score", 90.0),
            "citations": pipeline_output.get("citations", []),
            "raw_input_text": req.input_text
        }
    except Exception as e:
        logger.error(f"Error executing AI text analysis: {e}")
        raise HTTPException(status_code=500, detail=f"AI RCA processing error: {str(e)}")


@router.post("/analyze-document")
async def analyze_uploaded_document(
    file: UploadFile = File(...),
    document_type: str = Form("pdf_upload")
):
    """Extract text from uploaded PDF/text document and execute LangGraph RCA workflow."""
    filename = file.filename
    content = await file.read()
    extracted_text = ""

    if filename.lower().endswith(".pdf"):
        try:
            pdf_reader = PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        except Exception as e:
            logger.error(f"Failed to parse PDF {filename}: {e}")
            raise HTTPException(status_code=400, detail="Could not parse PDF content. Please check file formatting.")
    else:
        # Plain text / eml / doc
        try:
            extracted_text = content.decode("utf-8", errors="ignore")
        except Exception as e:
            extracted_text = str(content)

    if not extracted_text or len(extracted_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Document contains insufficient text for Root Cause Analysis.")

    pipeline_output = execute_rca_pipeline(
        input_text=extracted_text,
        document_name=filename,
        document_type=document_type
    )

    return {
        "status": "success",
        "document_name": filename,
        "document_type": document_type,
        "deviation_info": pipeline_output.get("deviation_info", {}),
        "five_whys": pipeline_output.get("five_whys", []),
        "fishbone_factors": pipeline_output.get("fishbone_factors", []),
        "evidence_and_gaps": pipeline_output.get("evidence_and_gaps", []),
        "root_cause_synthesis": pipeline_output.get("root_cause_synthesis", {}),
        "capa_recommendations": pipeline_output.get("capa_recommendations", []),
        "confidence_score": pipeline_output.get("confidence_score", 91.0),
        "citations": pipeline_output.get("citations", []),
        "raw_input_text": extracted_text
    }


@router.post("/chat-assistant")
def chat_with_investigation_copilot(req: AIChatRefinementRequest):
    """Interactive AI Quality Copilot for refining 5-Whys, Fishbone, or drafting specific CAPAs."""
    system_prompt = (
        f"{SYSTEM_RCA_EXPERT}\n\n"
        f"You are conversing with a QA Investigator reviewing an ongoing API Root Cause Analysis.\n"
        f"Context Scope: {req.context_type}\n"
        f"Current Investigation Snapshot: {req.current_state.get('title', 'Active Investigation')}, "
        f"Product: {req.current_state.get('api_product_name', 'API')}, "
        f"Primary Root Cause: {req.current_state.get('primary_root_cause', 'Under analysis')}.\n\n"
        f"Answer clearly and provide actionable, regulatory-compliant technical guidance."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": req.user_query}
    ]

    answer = groq_ai_client.call_chat_freeform(messages, temperature=0.3)
    return {"reply": answer}
