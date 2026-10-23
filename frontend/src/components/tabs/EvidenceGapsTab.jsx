import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldAlert, CheckCircle2, AlertTriangle, PlusCircle, Trash2, FileCheck, FileQuestion, Sparkles } from 'lucide-react';
import { updateEvidenceItem, addEvidenceItem, deleteEvidenceItem } from '../../store/investigationSlice';

const EVIDENCE_TYPES = [
  'Batch Record',
  'SCADA / Historian',
  'Lab LIMS / HPLC',
  'Calibration Logbook',
  'Environmental Monitoring',
  'Supplier COA',
  'Work Order / Teardown'
];

export default function EvidenceGapsTab() {
  const dispatch = useDispatch();
  const currentInvestigation = useSelector((state) => state.investigation.currentInvestigation);
  const items = currentInvestigation?.evidence_items || [];

  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('Batch Record');
  const [newItemStatus, setNewItemStatus] = useState('Verified & Attached');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemGapImpact, setNewItemGapImpact] = useState('None');

  const gaps = items.filter(i => i.status === 'Missing / Gap Detected' || i.ai_identified_gap);
  const verified = items.filter(i => i.status === 'Verified & Attached');

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    dispatch(addEvidenceItem({
      item_name: newItemName.trim(),
      evidence_type: newItemType,
      status: newItemStatus,
      description: newItemDesc.trim(),
      gap_impact: newItemStatus === 'Missing / Gap Detected' ? newItemGapImpact : 'None',
      ai_identified_gap: newItemStatus === 'Missing / Gap Detected'
    }));

    setNewItemName('');
    setNewItemDesc('');
  };

  const handleResolveGap = (index) => {
    dispatch(updateEvidenceItem({ index, field: 'status', value: 'Verified & Attached' }));
    dispatch(updateEvidenceItem({ index, field: 'gap_impact', value: 'None' }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Evidence Health Banner */}
      <div style={{
        background: gaps.length > 0
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(17, 24, 39, 0.9))'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(17, 24, 39, 0.9))',
        border: '1px solid ' + (gaps.length > 0 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.3)'),
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
            background: gaps.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: gaps.length > 0 ? '#F87171' : '#34D399'
          }}>
            {gaps.length > 0 ? <ShieldAlert size={22} /> : <CheckCircle2 size={22} />}
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {gaps.length > 0
                ? `${gaps.length} Information Gap(s) Detected for Regulatory Defensibility`
                : 'All Core Evidence Verified & Attached'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              FDA 21 CFR Part 211 & ICH Q7 require objective evidence prior to closing API quality investigations.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ATTACHED</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34D399' }}>{verified.length}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GAPS</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: gaps.length > 0 ? '#F87171' : 'var(--text-secondary)' }}>
              {gaps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Gaps Alert Deck */}
      {gaps.length > 0 && (
        <div className="glass-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <h3 style={{ fontSize: '1rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FileQuestion size={18} />
            AI-Identified Missing Evidence & Audit Vulnerabilities
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {gaps.map((gap, i) => {
              const originalIndex = items.indexOf(gap);
              return (
                <div
                  key={i}
                  style={{
                    background: 'rgba(239, 68, 68, 0.06)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span className="badge badge-gap">
                        {gap.gap_impact || 'GMP Compliance Risk'}
                      </span>
                      {gap.ai_identified_gap && (
                        <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>
                          <Sparkles size={10} /> AI Flagged
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {gap.item_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Category: <strong>{gap.evidence_type}</strong>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      {gap.description}
                    </p>
                  </div>

                  <button
                    className="btn btn-success btn-sm"
                    style={{ marginTop: '1rem', width: '100%' }}
                    onClick={() => handleResolveGap(originalIndex)}
                  >
                    <CheckCircle2 size={14} /> Mark Verified & Attach Document
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Comprehensive Evidence Checklist Table */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Complete Investigation Evidence & Data Integrity Log
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-rca">
            <thead>
              <tr>
                <th style={{ width: '220px' }}>Evidence Item Name</th>
                <th style={{ width: '160px' }}>Type</th>
                <th style={{ width: '170px' }}>Verification Status</th>
                <th>Description / Findings</th>
                <th style={{ width: '150px' }}>Regulatory Impact</th>
                <th style={{ width: '60px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                      value={item.item_name || ''}
                      onChange={(e) => dispatch(updateEvidenceItem({ index, field: 'item_name', value: e.target.value }))}
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                      value={item.evidence_type || 'Batch Record'}
                      onChange={(e) => dispatch(updateEvidenceItem({ index, field: 'evidence_type', value: e.target.value }))}
                    >
                      {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                      value={item.status || 'Verified & Attached'}
                      onChange={(e) => dispatch(updateEvidenceItem({ index, field: 'status', value: e.target.value }))}
                    >
                      <option value="Verified & Attached">Verified & Attached</option>
                      <option value="Requested / In Review">Requested / In Review</option>
                      <option value="Missing / Gap Detected">Missing / Gap Detected</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                      value={item.description || ''}
                      onChange={(e) => dispatch(updateEvidenceItem({ index, field: 'description', value: e.target.value }))}
                      placeholder="Summary of findings..."
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                      value={item.gap_impact || 'None'}
                      onChange={(e) => dispatch(updateEvidenceItem({ index, field: 'gap_impact', value: e.target.value }))}
                    >
                      <option value="None">None</option>
                      <option value="Low - Supportive Doc">Low - Supportive Doc</option>
                      <option value="Medium - Audit Risk">Medium - Audit Risk</option>
                      <option value="High - GMP Audit Risk">High - GMP Audit Risk</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.25rem 0.5rem' }}
                      onClick={() => dispatch(deleteEvidenceItem(index))}
                      title="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Add Evidence Form */}
        <form onSubmit={handleAddNew} style={{
          display: 'grid',
          gridTemplateColumns: '220px 160px 170px 1fr auto',
          gap: '0.75rem',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          alignItems: 'end'
        }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Evidence Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Chiller Pump Logbook"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Type</label>
            <select
              className="form-select"
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
            >
              {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Status</label>
            <select
              className="form-select"
              value={newItemStatus}
              onChange={(e) => setNewItemStatus(e.target.value)}
            >
              <option value="Verified & Attached">Verified & Attached</option>
              <option value="Requested / In Review">Requested / In Review</option>
              <option value="Missing / Gap Detected">Missing / Gap Detected</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="Brief description or document reference..."
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '38px', whiteSpace: 'nowrap' }}>
            <PlusCircle size={15} /> Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
