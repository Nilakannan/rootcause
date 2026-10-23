import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusCircle, Sparkles, X, FileText } from 'lucide-react';
import {
  setNewModalOpen,
  setCurrentInvestigation,
  setInvestigations,
  setAiPanelOpen,
  setActiveTab
} from '../store/investigationSlice';
import { api } from '../services/api';

export default function NewInvestigationModal() {
  const dispatch = useDispatch();
  const isNewModalOpen = useSelector((state) => state.investigation.isNewModalOpen);

  const [title, setTitle] = useState('');
  const [product, setProduct] = useState('');
  const [batch, setBatch] = useState('');
  const [unit, setUnit] = useState('API Synthesis Block-IV');
  const [stage, setStage] = useState('Crystallization & Isolation');
  const [severity, setSeverity] = useState('Major');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isNewModalOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newInv = await api.createInvestigation({
        title: title.trim() || 'New API Quality Investigation',
        api_product_name: product.trim() || 'Active Pharmaceutical Ingredient (API)',
        batch_number: batch.trim() || 'NEW-LOT',
        manufacturing_unit: unit,
        process_stage: stage,
        severity: severity,
        summary: 'Investigation initiated. Awaiting AI extraction or investigator data entry.',
        immediate_actions_taken: 'Quarantined batch in GMP warehouse hold zone.',
        five_whys: [
          {
            step_number: 1,
            why_question: 'Why did the observed quality deviation occur?',
            answer: 'Pending investigation',
            evidence_support: 'Pending verification',
            is_root_cause: false,
            ai_suggested: false
          },
          {
            step_number: 2,
            why_question: 'Why did that process condition occur?',
            answer: 'Pending investigation',
            evidence_support: 'Pending verification',
            is_root_cause: true,
            ai_suggested: false
          }
        ],
        fishbone_factors: [
          {
            category: 'machine',
            factor_name: 'Reactor / Equipment Assessment',
            details: 'Initial mechanical inspection',
            verification_status: 'Under Testing',
            ai_suggested: false
          }
        ],
        evidence_items: [
          {
            item_name: 'Batch Manufacturing Record (BMR)',
            evidence_type: 'Batch Record',
            status: 'Requested / In Review',
            description: 'Execution logbook pages',
            gap_impact: 'None',
            ai_identified_gap: false
          }
        ],
        capa_items: [
          {
            action_type: 'Immediate Containment',
            description: 'Segregate batch under QA quarantine hold tags.',
            owner_department: 'Quality Assurance',
            assigned_to: 'QA Inspector',
            due_date: 'Immediate',
            status: 'Accepted',
            effectiveness_criteria: 'Verification by QA Lead',
            ai_suggested: false
          }
        ]
      });

      dispatch(setCurrentInvestigation(newInv));
      const list = await api.getInvestigations();
      dispatch(setInvestigations(list));
      dispatch(setNewModalOpen(false));
      dispatch(setActiveTab('intake'));
    } catch (err) {
      alert(`Error creating investigation: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartWithAi = () => {
    dispatch(setNewModalOpen(false));
    dispatch(setAiPanelOpen(true));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-primary)'
            }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Initialize New RCA Investigation
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Active Pharmaceutical Ingredients (API) Quality Protocol
              </div>
            </div>
          </div>

          <button
            onClick={() => dispatch(setNewModalOpen(false))}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Launch with AI */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
          border: '1px solid var(--indigo-ai)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} style={{ color: 'var(--indigo-ai)' }} /> Recommended: Launch with AI Intake
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Upload incident PDF or select a pharma preset to auto-populate the full investigation.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ai btn-sm"
            onClick={handleStartWithAi}
          >
            Open AI Copilot
          </button>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Investigation Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Yield Loss and Crystallization Excursion in Paracetamol DC"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">API Product Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Paracetamol DC API"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Batch / Lot #</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. PCM-2026-081"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Process Stage</label>
              <select
                className="form-select"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option value="Reaction / Synthesis">Reaction / Synthesis</option>
                <option value="Crystallization & Isolation">Crystallization & Isolation</option>
                <option value="Centrifugation / Filtration">Centrifugation / Filtration</option>
                <option value="Vacuum / Fluid Bed Drying">Vacuum / Fluid Bed Drying</option>
                <option value="Milling & Micronization">Milling & Micronization</option>
                <option value="Analytical QC Testing">Analytical QC Testing</option>
              </select>
            </div>

            <div>
              <label className="form-label">Severity Level</label>
              <select
                className="form-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(setNewModalOpen(false))}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <PlusCircle size={15} />
              {isSubmitting ? 'Creating...' : 'Initialize Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
