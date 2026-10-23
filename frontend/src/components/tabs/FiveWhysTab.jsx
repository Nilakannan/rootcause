import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusCircle, Trash2, CheckCircle2, Star, Sparkles, HelpCircle, FileText } from 'lucide-react';
import { updateFiveWhysNode, addFiveWhysNode, deleteFiveWhysNode } from '../../store/investigationSlice';

export default function FiveWhysTab() {
  const dispatch = useDispatch();
  const currentInvestigation = useSelector((state) => state.investigation.currentInvestigation);
  const nodes = currentInvestigation?.five_whys || [];

  const handleUpdate = (index, field, value) => {
    dispatch(updateFiveWhysNode({ index, field, value }));
  };

  const handleToggleRootCause = (index) => {
    // Set this index as root cause, unset others
    nodes.forEach((node, i) => {
      dispatch(updateFiveWhysNode({ index: i, field: 'is_root_cause', value: i === index }));
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Educational / Regulatory Callout */}
      <div style={{
        background: 'rgba(6, 182, 212, 0.08)',
        border: '1px solid var(--border-accent)',
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
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan-primary)'
          }}>
            <HelpCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ICH Q7 & Q9 Structured 5 Whys Methodology
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Trace causal logic from observed physical symptom down to systemic equipment, calibration, or procedural root cause.
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => dispatch(addFiveWhysNode())}
        >
          <PlusCircle size={15} /> Add Why Step
        </button>
      </div>

      {/* 5 Whys Visual Tree */}
      <div className="five-whys-container">
        {nodes.map((node, index) => {
          const isRoot = node.is_root_cause || index === nodes.length - 1;

          return (
            <div
              key={index}
              className={`why-node ${isRoot ? 'root-cause-node' : ''}`}
            >
              {/* Marker Bubble */}
              <div className="why-node-marker">
                {isRoot ? <Star size={14} fill="#10B981" /> : node.step_number}
              </div>

              {/* Node Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: isRoot ? 'var(--status-approved)' : 'var(--cyan-primary)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    Why #{node.step_number}
                  </span>

                  {node.ai_suggested && (
                    <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>
                      <Sparkles size={10} /> AI Generated
                    </span>
                  )}

                  {isRoot && (
                    <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
                      <Star size={11} fill="currentColor" /> Primary Systemic Root Cause
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    className={`btn btn-sm ${isRoot ? 'btn-success' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    onClick={() => handleToggleRootCause(index)}
                    title="Designate this step as the fundamental Root Cause"
                  >
                    {isRoot ? 'Marked as Root' : 'Set as Root'}
                  </button>

                  {nodes.length > 2 && (
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.25rem 0.5rem' }}
                      onClick={() => dispatch(deleteFiveWhysNode(index))}
                      title="Delete this step"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Question & Answer Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    Why Question
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={node.why_question || ''}
                    onChange={(e) => handleUpdate(index, 'why_question', e.target.value)}
                    placeholder="e.g., Why did the temperature excursion occur?"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: isRoot ? 'var(--status-approved)' : 'var(--text-secondary)' }}>
                    {isRoot ? 'Definitive Root Cause Statement' : 'Technical Causal Answer'}
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    style={{
                      borderColor: isRoot ? 'rgba(16, 185, 129, 0.4)' : undefined,
                      fontWeight: isRoot ? 600 : 400
                    }}
                    value={node.answer || ''}
                    onChange={(e) => handleUpdate(index, 'answer', e.target.value)}
                    placeholder="Explain the technical or systemic reason..."
                  />
                </div>

                {/* Supporting Evidence Citation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(0,0,0,0.25)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <FileText size={14} style={{ color: 'var(--cyan-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    Supporting Evidence:
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', height: '28px' }}
                    value={node.evidence_support || ''}
                    onChange={(e) => handleUpdate(index, 'evidence_support', e.target.value)}
                    placeholder="e.g., SCADA Temperature Log page 4, HPLC Chromatogram Run 2"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
