import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  investigations: [],
  currentInvestigation: null,
  activeTab: 'intake', // intake, five_whys, fishbone, evidence_gaps, root_cause_capa, audit_signoff
  isAiPanelOpen: true,
  isExportModalOpen: false,
  isNewModalOpen: false,
  isSignoffModalOpen: false,
  isSaving: false,
  hasUnsavedChanges: false,
  
  // AI Copilot State
  aiState: {
    isAnalyzing: false,
    pipelineStep: 'idle', // idle, extracting, five_whys, fishbone, gap_analysis, capa, completed, error
    extractedData: null,
    chatMessages: [
      {
        sender: 'ai',
        text: 'Hello, I am your API Quality Investigation Copilot. You can upload an incident report (PDF), paste raw logbook text, or select one of our pharmaceutical presets to extract deviation facts and run automated 5 Whys, Fishbone, and CAPA analysis.'
      }
    ],
    selectedPresetId: null
  }
};

const investigationSlice = createSlice({
  name: 'investigation',
  initialState,
  reducers: {
    setInvestigations: (state, action) => {
      state.investigations = action.payload;
    },
    setCurrentInvestigation: (state, action) => {
      state.currentInvestigation = action.payload;
      state.hasUnsavedChanges = false;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleAiPanel: (state) => {
      state.isAiPanelOpen = !state.isAiPanelOpen;
    },
    setAiPanelOpen: (state, action) => {
      state.isAiPanelOpen = action.payload;
    },
    setExportModalOpen: (state, action) => {
      state.isExportModalOpen = action.payload;
    },
    setNewModalOpen: (state, action) => {
      state.isNewModalOpen = action.payload;
    },
    setSignoffModalOpen: (state, action) => {
      state.isSignoffModalOpen = action.payload;
    },
    setIsSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    
    // Form modifications
    updateField: (state, action) => {
      const { field, value } = action.payload;
      if (state.currentInvestigation) {
        state.currentInvestigation[field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    
    // 5 Whys modifications
    updateFiveWhysNode: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.currentInvestigation && state.currentInvestigation.five_whys) {
        state.currentInvestigation.five_whys[index][field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    addFiveWhysNode: (state, action) => {
      if (state.currentInvestigation) {
        const nextStep = (state.currentInvestigation.five_whys?.length || 0) + 1;
        state.currentInvestigation.five_whys = state.currentInvestigation.five_whys || [];
        state.currentInvestigation.five_whys.push({
          step_number: nextStep,
          why_question: `Why step ${nextStep}?`,
          answer: 'Enter root cause progression...',
          evidence_support: 'Pending verification',
          is_root_cause: false,
          ai_suggested: false
        });
        state.hasUnsavedChanges = true;
      }
    },
    deleteFiveWhysNode: (state, action) => {
      const index = action.payload;
      if (state.currentInvestigation && state.currentInvestigation.five_whys) {
        state.currentInvestigation.five_whys.splice(index, 1);
        // Re-index steps
        state.currentInvestigation.five_whys.forEach((node, i) => {
          node.step_number = i + 1;
        });
        state.hasUnsavedChanges = true;
      }
    },

    // Fishbone factor modifications
    updateFishboneFactor: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.currentInvestigation && state.currentInvestigation.fishbone_factors) {
        state.currentInvestigation.fishbone_factors[index][field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    addFishboneFactor: (state, action) => {
      const factor = action.payload;
      if (state.currentInvestigation) {
        state.currentInvestigation.fishbone_factors = state.currentInvestigation.fishbone_factors || [];
        state.currentInvestigation.fishbone_factors.push(factor);
        state.hasUnsavedChanges = true;
      }
    },
    deleteFishboneFactor: (state, action) => {
      const index = action.payload;
      if (state.currentInvestigation && state.currentInvestigation.fishbone_factors) {
        state.currentInvestigation.fishbone_factors.splice(index, 1);
        state.hasUnsavedChanges = true;
      }
    },

    // Evidence modifications
    updateEvidenceItem: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.currentInvestigation && state.currentInvestigation.evidence_items) {
        state.currentInvestigation.evidence_items[index][field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    addEvidenceItem: (state, action) => {
      if (state.currentInvestigation) {
        state.currentInvestigation.evidence_items = state.currentInvestigation.evidence_items || [];
        state.currentInvestigation.evidence_items.push(action.payload);
        state.hasUnsavedChanges = true;
      }
    },
    deleteEvidenceItem: (state, action) => {
      const index = action.payload;
      if (state.currentInvestigation && state.currentInvestigation.evidence_items) {
        state.currentInvestigation.evidence_items.splice(index, 1);
        state.hasUnsavedChanges = true;
      }
    },

    // CAPA modifications
    updateCapaItem: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.currentInvestigation && state.currentInvestigation.capa_items) {
        state.currentInvestigation.capa_items[index][field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    addCapaItem: (state, action) => {
      if (state.currentInvestigation) {
        state.currentInvestigation.capa_items = state.currentInvestigation.capa_items || [];
        state.currentInvestigation.capa_items.push(action.payload);
        state.hasUnsavedChanges = true;
      }
    },
    deleteCapaItem: (state, action) => {
      const index = action.payload;
      if (state.currentInvestigation && state.currentInvestigation.capa_items) {
        state.currentInvestigation.capa_items.splice(index, 1);
        state.hasUnsavedChanges = true;
      }
    },

    // AI Pipeline Actions
    setAiAnalyzing: (state, action) => {
      state.aiState.isAnalyzing = action.payload;
    },
    setAiPipelineStep: (state, action) => {
      state.aiState.pipelineStep = action.payload;
    },
    setExtractedData: (state, action) => {
      state.aiState.extractedData = action.payload;
    },
    addChatMessage: (state, action) => {
      state.aiState.chatMessages.push(action.payload);
    },

    // Population from AI Panel into RCA Form
    populateAllFromAi: (state) => {
      const data = state.aiState.extractedData;
      if (!data) return;

      const dev = data.deviation_info || {};
      const root = data.root_cause_synthesis || {};

      state.currentInvestigation = {
        ...state.currentInvestigation,
        title: dev.title || state.currentInvestigation?.title || 'API Quality Investigation',
        api_product_name: dev.api_product_name || '',
        batch_number: dev.batch_number || '',
        manufacturing_unit: dev.manufacturing_unit || '',
        incident_date: dev.incident_date || '',
        process_stage: dev.process_stage || 'Crystallization & Isolation',
        severity: dev.severity || 'Major',
        summary: dev.summary || '',
        immediate_actions_taken: dev.immediate_actions_taken || '',
        source_document_name: data.document_name || 'Extracted Document',
        source_document_type: data.document_type || 'pasted_text',
        raw_input_text: data.raw_input_text || '',
        primary_root_cause: root.primary_root_cause || '',
        root_cause_category: root.root_cause_category || 'Equipment Failure',
        root_cause_confidence: data.confidence_score || 91.5,
        root_cause_rationale: root.root_cause_rationale || '',
        contributing_factors: root.contributing_factors || [],
        five_whys: (data.five_whys || []).map((w, i) => ({
          ...w,
          step_number: w.step_number || i + 1,
          ai_suggested: true
        })),
        fishbone_factors: (data.fishbone_factors || []).map(f => ({
          ...f,
          ai_suggested: true
        })),
        evidence_items: (data.evidence_and_gaps || []).map(e => ({
          ...e,
          ai_identified_gap: e.ai_identified_gap || false
        })),
        capa_items: (data.capa_recommendations || []).map(c => ({
          ...c,
          status: 'Proposed (AI)',
          ai_suggested: true
        }))
      };
      state.hasUnsavedChanges = true;
    },

    populateSectionFromAi: (state, action) => {
      const section = action.payload; // 'deviation', 'five_whys', 'fishbone', 'evidence', 'capa'
      const data = state.aiState.extractedData;
      if (!data || !state.currentInvestigation) return;

      if (section === 'deviation') {
        const dev = data.deviation_info || {};
        state.currentInvestigation.title = dev.title || state.currentInvestigation.title;
        state.currentInvestigation.api_product_name = dev.api_product_name || state.currentInvestigation.api_product_name;
        state.currentInvestigation.batch_number = dev.batch_number || state.currentInvestigation.batch_number;
        state.currentInvestigation.manufacturing_unit = dev.manufacturing_unit || state.currentInvestigation.manufacturing_unit;
        state.currentInvestigation.process_stage = dev.process_stage || state.currentInvestigation.process_stage;
        state.currentInvestigation.severity = dev.severity || state.currentInvestigation.severity;
        state.currentInvestigation.summary = dev.summary || state.currentInvestigation.summary;
        state.currentInvestigation.immediate_actions_taken = dev.immediate_actions_taken || state.currentInvestigation.immediate_actions_taken;
      } else if (section === 'five_whys') {
        state.currentInvestigation.five_whys = data.five_whys || [];
      } else if (section === 'fishbone') {
        state.currentInvestigation.fishbone_factors = data.fishbone_factors || [];
      } else if (section === 'evidence') {
        state.currentInvestigation.evidence_items = data.evidence_and_gaps || [];
      } else if (section === 'capa') {
        state.currentInvestigation.capa_items = data.capa_recommendations || [];
        const root = data.root_cause_synthesis || {};
        state.currentInvestigation.primary_root_cause = root.primary_root_cause || state.currentInvestigation.primary_root_cause;
        state.currentInvestigation.root_cause_confidence = data.confidence_score || state.currentInvestigation.root_cause_confidence;
        state.currentInvestigation.root_cause_rationale = root.root_cause_rationale || state.currentInvestigation.root_cause_rationale;
      }
      state.hasUnsavedChanges = true;
    }
  }
});

export const {
  setInvestigations,
  setCurrentInvestigation,
  setActiveTab,
  toggleAiPanel,
  setAiPanelOpen,
  setExportModalOpen,
  setNewModalOpen,
  setSignoffModalOpen,
  setIsSaving,
  updateField,
  updateFiveWhysNode,
  addFiveWhysNode,
  deleteFiveWhysNode,
  updateFishboneFactor,
  addFishboneFactor,
  deleteFishboneFactor,
  updateEvidenceItem,
  addEvidenceItem,
  deleteEvidenceItem,
  updateCapaItem,
  addCapaItem,
  deleteCapaItem,
  setAiAnalyzing,
  setAiPipelineStep,
  setExtractedData,
  addChatMessage,
  populateAllFromAi,
  populateSectionFromAi
} = investigationSlice.actions;

export default investigationSlice.reducer;
