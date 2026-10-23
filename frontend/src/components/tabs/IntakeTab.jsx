import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AlertCircle, FileCheck, Layers, Calendar, MapPin, Tag } from 'lucide-react';
import { updateField } from '../../store/investigationSlice';

export default function IntakeTab() {
  const dispatch = useDispatch();
  const currentInvestigation = useSelector((state) => state.investigation.currentInvestigation);

  if (!currentInvestigation) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No active investigation selected. Select one or create a new one.</p>
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner: Source Document & Extraction Metadata */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(15, 23, 42, 0.8))',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan-primary)'
          }}>
            <FileCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Source Record: {currentInvestigation.source_document_name || 'Direct QA Incident Log'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Intake Channel: <strong>{currentInvestigation.source_document_type?.toUpperCase() || 'PASTED TEXT'}</strong> • Investigation ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)' }}>{currentInvestigation.investigation_number}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="badge badge-ai" style={{ fontSize: '0.75rem' }}>
            AI-Assisted Form Fill
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            User editable prior to QP sign-off
          </span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} style={{ color: 'var(--cyan-primary)' }} />
          Deviation Record & Manufacturing Context
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Investigation Title */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Investigation Title</label>
            <input
              type="text"
              className="form-input"
              value={currentInvestigation.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g., OOS Related Substance Impurity-C in Atorvastatin Calcium Batch ATV-2026-B089"
            />
          </div>

          {/* API Product Name */}
          <div className="form-group">
            <label className="form-label">Active Pharmaceutical Ingredient (API)</label>
            <input
              type="text"
              className="form-input"
              value={currentInvestigation.api_product_name || ''}
              onChange={(e) => handleFieldChange('api_product_name', e.target.value)}
              placeholder="e.g., Atorvastatin Calcium Trihydrate API"
            />
          </div>

          {/* Batch / Lot Number */}
          <div className="form-group">
            <label className="form-label">Batch / Lot Number</label>
            <input
              type="text"
              className="form-input"
              style={{ fontFamily: 'var(--font-mono)' }}
              value={currentInvestigation.batch_number || ''}
              onChange={(e) => handleFieldChange('batch_number', e.target.value)}
              placeholder="e.g., ATV-2026-B089"
            />
          </div>

          {/* Manufacturing Unit / Equipment */}
          <div className="form-group">
            <label className="form-label">Manufacturing Plant / Unit / Reactor</label>
            <input
              type="text"
              className="form-input"
              value={currentInvestigation.manufacturing_unit || ''}
              onChange={(e) => handleFieldChange('manufacturing_unit', e.target.value)}
              placeholder="e.g., API Block-IV, Reactor R-201"
            />
          </div>

          {/* Incident Date */}
          <div className="form-group">
            <label className="form-label">Date & Time of Occurrence</label>
            <input
              type="text"
              className="form-input"
              value={currentInvestigation.incident_date || ''}
              onChange={(e) => handleFieldChange('incident_date', e.target.value)}
              placeholder="e.g., 2026-10-18 03:45 UTC"
            />
          </div>

          {/* Process Stage */}
          <div className="form-group">
            <label className="form-label">Process Stage</label>
            <select
              className="form-select"
              value={currentInvestigation.process_stage || 'Crystallization & Isolation'}
              onChange={(e) => handleFieldChange('process_stage', e.target.value)}
            >
              <option value="Reaction / Synthesis">Reaction / Chemical Synthesis</option>
              <option value="Crystallization & Isolation">Crystallization & Isolation</option>
              <option value="Centrifugation / Filtration">Centrifugation / Cake Washing & Filtration</option>
              <option value="Vacuum / Fluid Bed Drying">Vacuum / Fluid Bed Drying</option>
              <option value="Milling & Micronization">Milling & Particle Size Micronization</option>
              <option value="Analytical QC Testing">Analytical QC Lab Testing</option>
              <option value="Packaging & Warehousing">Bulk Packaging & Quarantine</option>
            </select>
          </div>

          {/* Severity */}
          <div className="form-group">
            <label className="form-label">Deviation Severity (Risk Assessment)</label>
            <select
              className="form-select"
              value={currentInvestigation.severity || 'Major'}
              onChange={(e) => handleFieldChange('severity', e.target.value)}
            >
              <option value="Critical">Critical (Direct Patient / CQA / Sterility Impact)</option>
              <option value="Major">Major (Process Parameter Excursion / Yield Drop)</option>
              <option value="Minor">Minor (Documentation / Non-critical drift)</option>
            </select>
          </div>
        </div>

        {/* Technical Summary */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">Technical Incident Summary & Symptoms</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={currentInvestigation.summary || ''}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            placeholder="Detailed technical summary of the observed deviation, sensor alerts, and lab results..."
          />
        </div>

        {/* Immediate Containment Actions */}
        <div className="form-group">
          <label className="form-label" style={{ color: '#FBBF24' }}>
            Immediate Containment Actions Executed
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}
            value={currentInvestigation.immediate_actions_taken || ''}
            onChange={(e) => handleFieldChange('immediate_actions_taken', e.target.value)}
            placeholder="e.g., Physical quarantine of Lot B089 with red tags, ERP inventory block, reactor LOTO..."
          />
        </div>
      </div>
    </div>
  );
}
