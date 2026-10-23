import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Sparkles,
  FileText,
  CheckCircle,
  PlusCircle,
  Save,
  ShieldCheck,
  ChevronDown,
  Layers,
  AlertTriangle
} from 'lucide-react';
import {
  toggleAiPanel,
  setExportModalOpen,
  setNewModalOpen,
  setSignoffModalOpen,
  setCurrentInvestigation,
  setIsSaving
} from '../store/investigationSlice';
import { api } from '../services/api';

export default function Header() {
  const dispatch = useDispatch();
  const {
    currentInvestigation,
    investigations,
    isAiPanelOpen,
    hasUnsavedChanges,
    isSaving
  } = useSelector((state) => state.investigation);

  const handleSelectInvestigation = async (e) => {
    const id = parseInt(e.target.value);
    if (!id) return;
    try {
      const inv = await api.getInvestigation(id);
      dispatch(setCurrentInvestigation(inv));
    } catch (err) {
      console.error('Error switching investigation:', err);
    }
  };

  const handleSave = async () => {
    if (!currentInvestigation) return;
    dispatch(setIsSaving(true));
    try {
      let saved;
      if (currentInvestigation.id) {
        saved = await api.updateInvestigation(currentInvestigation.id, currentInvestigation);
      } else {
        saved = await api.createInvestigation(currentInvestigation);
      }
      dispatch(setCurrentInvestigation(saved));
      // Refresh list
      const list = await api.getInvestigations();
      dispatch({ type: 'investigation/setInvestigations', payload: list });
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      dispatch(setIsSaving(false));
    }
  };

  const getSeverityBadgeClass = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'badge-critical';
      case 'major': return 'badge-major';
      default: return 'badge-minor';
    }
  };

  const isApproved = currentInvestigation?.qualified_person_signoff || currentInvestigation?.status === 'qa_approved';

  return (
    <header className="app-header">
      {/* Brand */}
      <div className="header-brand">
        <div className="brand-icon">
          <Layers size={22} />
        </div>
        <div>
          <div className="brand-title">AURA-QMS <span style={{ color: 'var(--cyan-primary)', fontSize: '0.85em' }}>• RCA</span></div>
          <div className="brand-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Active Pharmaceutical Ingredients Suite</span>
            <span style={{
              fontSize: '0.65rem',
              padding: '1px 6px',
              borderRadius: '999px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#38bdf8',
              letterSpacing: '0.04em',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              GitHub Live
            </span>
          </div>
        </div>
      </div>

      {/* Investigation Selector & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            className="form-select"
            style={{
              paddingRight: '2rem',
              minWidth: '280px',
              fontWeight: 600,
              background: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'var(--border-medium)',
              cursor: 'pointer'
            }}
            value={currentInvestigation?.id || ''}
            onChange={handleSelectInvestigation}
          >
            {investigations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.investigation_number} : {inv.api_product_name || inv.title}
              </option>
            ))}
          </select>
        </div>

        {currentInvestigation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${getSeverityBadgeClass(currentInvestigation.severity)}`}>
              <AlertTriangle size={12} />
              {currentInvestigation.severity}
            </span>

            {isApproved ? (
              <span className="badge badge-approved">
                <CheckCircle size={12} />
                QA Signed Off
              </span>
            ) : (
              <span className="badge badge-ai">
                Under Review
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="header-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => dispatch(setNewModalOpen(true))}
          title="Create New RCA Record"
        >
          <PlusCircle size={16} />
          New RCA
        </button>

        <button
          className={`btn btn-sm ${hasUnsavedChanges ? 'btn-primary' : 'btn-secondary'}`}
          onClick={handleSave}
          disabled={isSaving}
          title="Save Investigation"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes *' : 'Saved'}
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => dispatch(setExportModalOpen(true))}
          title="Generate Regulatory PDF Report"
        >
          <FileText size={16} />
          Export Audit PDF
        </button>

        {!isApproved && (
          <button
            className="btn btn-success btn-sm"
            onClick={() => dispatch(setSignoffModalOpen(true))}
            title="Qualified Person Sign-Off (21 CFR Part 11)"
          >
            <ShieldCheck size={16} />
            QP Sign-off
          </button>
        )}

        {/* AI Copilot Drawer Toggle */}
        <button
          className={`btn btn-sm ${isAiPanelOpen ? 'btn-ai' : 'btn-secondary'}`}
          onClick={() => dispatch(toggleAiPanel())}
          style={{ position: 'relative' }}
          title="Toggle AI Quality Copilot"
        >
          <Sparkles size={16} />
          {isAiPanelOpen ? 'Close AI Panel' : 'AI Copilot'}
          {!isAiPanelOpen && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--cyan-primary)',
              boxShadow: '0 0 8px var(--cyan-primary)'
            }} />
          )}
        </button>
      </div>
    </header>
  );
}
